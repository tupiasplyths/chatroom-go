package main

import (
	"os"
	"fmt"
	"log"
	"net/http"

	db "github.com/tupiasplyths/chatroom-server/dbConnect"
)

var (
	logfile, _ = os.OpenFile("logs/server.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)
	database = db.DB_Connect()
)

func main() {
	log.SetOutput(logfile)
	listen_address := "0.0.0.0:" + os.Getenv("LISTEN_PORT")
	fmt.Println("server started")
	WsServer := NewWebSocketServer()
	go WsServer.Run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		ServeWS(w, r, WsServer)
	})
	http.HandleFunc("/clientcount", func(w http.ResponseWriter, r *http.Request) {
		log.Println(CountClients(WsServer))
	})
	http.HandleFunc("/signup", signup)
	http.HandleFunc("/login", login)
	http.HandleFunc("/api/channelID", returnChannelID)
	http.HandleFunc("/api/authenticate", authenticate)
	log.Fatal(http.ListenAndServe(listen_address, nil))
}