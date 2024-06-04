package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	db "github.com/tupiasplyths/chatroom-server/dbConnect"
	"github.com/tupiasplyths/chatroom-server/hash"
)

var database = db.DbConnect()

type User struct{
	Username string `json:"username"`
	Password string `json:"password"`
	Email string `json:"email"`
}

type Response struct {
	Message string `json:"message"`
}

func signup(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	// w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	
	var user User
	fmt.Println(r.Body)
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Println("ERROR: json decode error: ", err)
	}
	hashedPassword, err := hash.HashString(user.Password)
	if err != nil {
		log.Println("ERROR: hashing error: ", err)
	} 
	rows, err := database.Query(`SELECT username FROM accounts WHERE username = $1`, user.Username)
	if err != nil {
		log.Println("ERROR: select query error: ", err)
	} 

	if rows.Next() {
		log.Println("WARNING:username already exists")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(&Response{Message: "username already exists"})
		return
	}

	_, err = database.Query(`INSERT INTO accounts (username, email, password) VALUES ($1, $2, $3)`, user.Username, user.Email, hashedPassword )
	if err != nil {
		log.Println("ERROR: query error: ", err)
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(&Response{Message: "user created"})
}

func login(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Println("ERROR: decode error: ", err)
	}
	if user.Username == "" {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(&Response{Message: "username is empty"})
		return
	}

	var hashedPassword string
	var flag bool
	err = database.QueryRow(`SELECT password FROM accounts WHERE username = $1`, user.Username).Scan(&hashedPassword)
	
	if err == sql.ErrNoRows {
		log.Println("no username matched")
	} else if err != nil {
		log.Print("ERROR: row scanning error ")
		log.Println(err)
	} else {
		flag = hash.CheckHash(user.Password, hashedPassword)
		fmt.Printf("flag is %t\n", flag)
	}

	if flag {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(&Response{Message: "login success"})
	} else {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(&Response{Message: "wrong username or password"})
	}
}