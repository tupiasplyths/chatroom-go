package main

import (
	"encoding/json"
	"log"
	"net/http"
	"github.com/tupiasplyths/chatroom-server/hash"
	db "github.com/tupiasplyths/chatroom-server/dbConnect"

	
)

var database = db.DbConnect()

type User struct{
	Username string `json:"username"`
	Password string `json:"password"`
	Email string `json:"email"`
}


func signup (w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Fatal(err)
	}
	hashedPassword, err := hash.HashString(user.Password)
	if err != nil {
		log.Fatal(err)
	} 
	rows, err := database.Query(`SELECT username FROM users WHERE username = $1`, user.Username)
	if err != nil {
		log.Fatal(err)
	} 

	if rows.Next() {
		
	}

	_, err = database.Query(`INSERT INTO accounts (username, email, password) VALUES ($1, $2, $3)`, user.Username, user.Email, hashedPassword )
	if err != nil {
		log.Fatal(err)
	}
}