package handlers

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
)

type Handler struct {
	DB *sql.DB
}

type User struct {
	PhoneNumber string `json:"phonenumber"`
	PIN         string `json:"pin"`
}

func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var user User

	err := json.NewDecoder(r.Body).Decode(&user)
	fmt.Printf("user: %+v\n", user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
	}

	hashedPIN := hashPIN(user.PIN)
	var exists bool
	fmt.Printf("phone number: %s, pin: %s, hashed pin: %s \n", user.PhoneNumber, user.PIN, hashedPIN)
	err = h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE phone_number =$1 AND pin =$2)", user.PhoneNumber, hashedPIN).Scan(&exists)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if exists {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("success!"))
	} else {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
	}

}

func hashPIN(pin string) string {
	hash := sha256.Sum256([]byte(pin))
	return hex.EncodeToString(hash[:])
}
