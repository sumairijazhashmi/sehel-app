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

type LoginUser struct {
	PhoneNumber string `json:"phonenumber"`
	PIN         string `json:"pin"`
}

type SignUpUser struct {
	Name        string `json:"name"`
	PhoneNumber string `json:"phonenumber"`
	PIN         string `json:"pin"`
}

type ProfileUser struct {
	PhoneNumber  string `json:"phonenumber"`
	BusinessName string `json:"businessname"`
	Category     string `json:"category"`
	Location     string `json:"location"`
	Description  string `json:"description"`
}

func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var user LoginUser

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

func (h *Handler) SignUpHandler(w http.ResponseWriter, r *http.Request) {
	// Decode JSON payload
	var user SignUpUser
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Check if user already exists
	var exists bool
	err = h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE phone_number =$1)", user.PhoneNumber).Scan(&exists)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if exists {
		http.Error(w, "Account with that phone number already exists.", http.StatusConflict)
		return
	}

	hashedPIN := hashPIN(user.PIN)
	stmt, err := h.DB.Prepare("INSERT INTO users (name, phone_number, pin) VALUES ($1, $2, $3)")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(user.Name, user.PhoneNumber, hashedPIN)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("success!"))
}

func (h *Handler) MakeProfileHandler(w http.ResponseWriter, r *http.Request) {
	var user ProfileUser

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	var exists bool
	err = h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE phone_number =$1)", user.PhoneNumber).Scan(&exists)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if !exists {
		http.Error(w, "Account doesn't exist.", http.StatusConflict)
		return
	}

	stmt, err := h.DB.Prepare("UPDATE users SET business_name=$1, location=$2, category=$3, description=$4 WHERE phone_number=$5")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(user.BusinessName, user.Location, user.Category, user.Description, user.PhoneNumber)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("success!"))

}

func hashPIN(pin string) string {
	hash := sha256.Sum256([]byte(pin))
	return hex.EncodeToString(hash[:])
}
