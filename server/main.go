package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"server/handlers"

	_ "github.com/lib/pq"
)

func baseHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hi there, I think I work")
}

func main() {
	fmt.Println("REST API in GO")

	db, err := sql.Open("postgres", "postgres://postgres:admin@localhost/hci_app?sslmode=disable")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// Attempt to connect to the database
	err = db.Ping()
	if err != nil {
		panic(err)
	}

	handler := &handlers.Handler{
		DB: db,
	}

	fmt.Println("Successfully connected to PostgreSQL database!")

	mux := http.NewServeMux()

	mux.HandleFunc("/", baseHandler)
	mux.HandleFunc("POST /login", handler.LoginHandler)
	mux.HandleFunc("POST /signup", handler.SignUpHandler)
	mux.HandleFunc("POST /makeprofile", handler.MakeProfileHandler)
	mux.HandleFunc("POST /uploadprofilepic", handler.UploadProfilePic)
	mux.HandleFunc("GET /getprofilepic", handler.GetProfilePic)
	mux.HandleFunc("GET /getname", handler.GetName)
	mux.HandleFunc("GET /getuser", handler.GetUser)
	mux.HandleFunc("POST /edituser", handler.EditUser)
	mux.HandleFunc("POST /editpin", handler.EditPIN)
	mux.HandleFunc("POST /editphonenumber", handler.EditPhoneNumber)
	mux.HandleFunc("POST /writenotification", handler.WriteNotification)
	mux.HandleFunc("GET /getnotifications", handler.GetNotifications)
	mux.HandleFunc("GET /gettransactions", handler.GetTransactions)

	mainHandler := corsMiddleware(mux)

	if err := http.ListenAndServe(":8080", mainHandler); err != nil {
		fmt.Println(err.Error())
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from any origin with methods (GET, POST, etc.) and headers (Content-Type)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// If it's an OPTIONS request, send back the Allow headers and return immediately
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler in the chain
		next.ServeHTTP(w, r)
	})
}
