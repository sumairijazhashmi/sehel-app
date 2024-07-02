package handlers

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
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

type GetUser struct {
	Name         *string `json:"name,omitempty"`
	BusinessName *string `json:"business_name,omitempty"`
	Description  *string `json:"description,omitempty"`
	Category     *string `json:"category,omitempty"`
	Location     *string `json:"location,omitempty"`
	PhoneNumber  string  `json:"phone_number"`
}

type EditUser struct {
	Name         string `json:"name"`
	PhoneNumber  string `json:"phonenumber"`
	BusinessName string `json:"businessname"`
	Category     string `json:"category"`
	Location     string `json:"location"`
	Description  string `json:"description"`
}

type ChangePINs struct {
	PhoneNumber string `json:"phonenumber"`
	OldPin      string `json:"oldpin"`
	NewPin      string `json:"newpin"`
}

type PhoneNumberUser struct {
	OldPhoneNumber string `json:"oldphonenumber"`
	NewPhoneNumber string `json:"newphonenumber"`
	PIN            string `json:"pin"`
}

type File struct {
	ID       int
	Filename string
	FileData []byte
}

type Notification struct {
	Recipient string `json:"recipient"`
	Body      string `json:"body"`
	CreatedAt string `json:"created_at"`
	Params    string `json:"params"`
}

func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var user LoginUser

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
	}

	hashedPIN := hashPIN(user.PIN)
	var exists bool
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

func (h *Handler) UploadProfilePic(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(20 << 20) // Limit upload size to 10 MB
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("photo")
	phonenumber := r.FormValue("phonenumber")
	if err != nil {
		http.Error(w, "Unable to retrieve the file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	const dir = "profile_pics"
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		err = os.Mkdir(dir, 0755)
		if err != nil {
			http.Error(w, "Unable to create directory", http.StatusInternalServerError)
			return
		}
	}

	fileExtension := filepath.Ext(header.Filename)
	if fileExtension == "" {
		http.Error(w, "Unable to determine file extension", http.StatusBadRequest)
		return
	}

	filePath := filepath.Join(dir, phonenumber+fileExtension)

	dst, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Unable to create the file on server", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	if err != nil {
		http.Error(w, "Unable to save the file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("success!"))
}

func (h *Handler) GetProfilePic(w http.ResponseWriter, r *http.Request) {

	phoneNumber := r.URL.Query().Get("phoneNumber")

	const dir = "profile_pics"
	filePattern := filepath.Join(dir, phoneNumber+"*")

	matches, err := filepath.Glob(filePattern)
	if err != nil || len(matches) == 0 {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	filePath := matches[0]
	file, err := os.Open(filePath)
	if err != nil {
		http.Error(w, "Unable to open file", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	contentType := "application/octet-stream"
	if strings.HasSuffix(filePath, ".jpg") || strings.HasSuffix(filePath, ".jpeg") {
		contentType = "image/jpeg"
	} else if strings.HasSuffix(filePath, ".png") {
		contentType = "image/png"
	} else if strings.HasSuffix(filePath, ".gif") {
		contentType = "image/gif"
	}

	w.Header().Set("Content-Type", contentType)
	_, err = io.Copy(w, file)
	if err != nil {
		http.Error(w, "Unable to serve the file", http.StatusInternalServerError)
		return
	}

}

func (h *Handler) GetName(w http.ResponseWriter, r *http.Request) {
	phoneNumber := r.URL.Query().Get("phoneNumber")

	var name string
	err := h.DB.QueryRow("SELECT name FROM users WHERE phone_number=$1", phoneNumber).Scan(&name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(name))
}

func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
	phoneNumber := r.URL.Query().Get("phoneNumber")

	var user GetUser
	user.PhoneNumber = phoneNumber

	// Define variables for each field
	var name, businessName, description, category, location sql.NullString

	err := h.DB.QueryRow(
		"SELECT name, business_name, description, category, location FROM users WHERE phone_number=$1",
		phoneNumber).Scan(&name, &businessName, &description, &category, &location)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if name.Valid {
		user.Name = &name.String
	}
	if businessName.Valid {
		user.BusinessName = &businessName.String
	}
	if description.Valid {
		user.Description = &description.String
	}
	if category.Valid {
		user.Category = &category.String
	}
	if location.Valid {
		user.Location = &location.String
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (h *Handler) EditUser(w http.ResponseWriter, r *http.Request) {

	var user EditUser
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Incorrect Payload", http.StatusInternalServerError)
		return
	}

	stmt, err := h.DB.Prepare("UPDATE users SET name=$2, business_name=$3, description=$4, category=$5, location=$6 WHERE phone_number=$1")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(user.PhoneNumber, user.Name, user.BusinessName, user.Description, user.Category, user.Location)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("success"))

}

func (h *Handler) EditPhoneNumber(w http.ResponseWriter, r *http.Request) {
	var user PhoneNumberUser
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Incorrect Payload", http.StatusInternalServerError)
		return
	}

	pinHash := hashPIN(user.PIN)
	var storedPin string
	err = h.DB.QueryRow("SELECT pin FROM users WHERE phone_number=$1", user.OldPhoneNumber).Scan(&storedPin)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if pinHash != storedPin {
		http.Error(w, "Incorrect Pin", http.StatusUnauthorized)
		return
	}

	var scan bool
	err = h.DB.QueryRow("SELECT * FROM users WHERE phone_number=$1", user.NewPhoneNumber).Scan(&scan)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if scan {
		http.Error(w, "Phone Number already exists!", http.StatusBadRequest)
		return
	}

	stmt, err := h.DB.Prepare("UPDATE users SET phone_number=$1 WHERE phone_number=$2")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(user.NewPhoneNumber, user.OldPhoneNumber)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("success"))

}

func (h *Handler) EditPIN(w http.ResponseWriter, r *http.Request) {

	var pins ChangePINs
	err := json.NewDecoder(r.Body).Decode(&pins)
	if err != nil {
		http.Error(w, "Incorrect Payload", http.StatusInternalServerError)
		return
	}

	oldPinHash := hashPIN(pins.OldPin)
	var storedPin string
	err = h.DB.QueryRow("SELECT pin FROM users WHERE phone_number=$1", pins.PhoneNumber).Scan(&storedPin)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if oldPinHash != storedPin {
		http.Error(w, "Incorrect Pin", http.StatusUnauthorized)
		return
	}

	hashPin := hashPIN(pins.NewPin)
	stmt, err := h.DB.Prepare("UPDATE users SET pin=$1 WHERE phone_number=$2")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(hashPin, pins.PhoneNumber)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("success"))

}

func (h *Handler) WriteNotification(w http.ResponseWriter, r *http.Request) {

	var notif Notification
	err := json.NewDecoder(r.Body).Decode(&notif)
	if err != nil {
		http.Error(w, "Incorrect Payload", http.StatusInternalServerError)
	}

	stmt, err := h.DB.Prepare("INSERT INTO notifications VALUES ($1, $2, $3, $4)")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	defer stmt.Close()

	date, err := time.Parse(time.RFC3339, notif.CreatedAt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err = stmt.Exec(notif.Recipient, notif.Body, date, notif.Params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("success"))

}

func (h *Handler) GetNotifications(w http.ResponseWriter, r *http.Request) {

	phoneNumber := r.URL.Query().Get("phoneNumber")

	rows, err := h.DB.Query("SELECT * FROM notifications WHERE recipient = $1", phoneNumber)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	defer rows.Close()

	var notifs []Notification
	for rows.Next() {
		var row Notification
		err := rows.Scan(&row.Recipient, &row.Body, &row.CreatedAt, &row.Params)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		notifs = append(notifs, row)
	}

	err = rows.Err()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifs)
}

func hashPIN(pin string) string {
	hash := sha256.Sum256([]byte(pin))
	return hex.EncodeToString(hash[:])
}
