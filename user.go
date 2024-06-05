package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	// "github.com/google/uuid"
	// "github.com/gorilla/sessions"
	// "github.com/gorilla/sessions"
	"github.com/tupiasplyths/chatroom-server/hash"
)



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
	session, err := store.Get(r, "chatroom_session")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var user User
	err = json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		fmt.Println(r.Body)
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
	if !flag {
		w.WriteHeader(http.StatusOK)
		session.Values["authenticated"] = false
		json.NewEncoder(w).Encode(&Response{Message: "wrong username or password"})
		return		
	}
	w.WriteHeader(http.StatusOK)
	// cookie := sessions.NewCookie(
	// 	"chatroom_session", 
	// 	uuid.NewString(), 
	// 	&sessions.Options{
	// 		MaxAge: 300,
	// 	},
	// )
	// http.SetCookie(w, cookie)
	session.Values["authenticated"] = true
	session.Values["username"] = user.Username
	session.Save(r, w)
	if err != nil {
		log.Println("ERROR: saving session error: ", err)
	}
	json.NewEncoder(w).Encode(&Response{Message: "login success"})
}

func authenicate(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	session, err := store.Get(r, "chatroom_session")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if session.Values["authenticated"] == true {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(&Response{Message: "authenticated"})
	} else {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(&Response{Message: "not authenticated"})
	}
}