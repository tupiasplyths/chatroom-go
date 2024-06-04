package main

import (
	// "flag"
	// "fmt"
	"os"
	"github.com/joho/godotenv"
	"fmt"
	"log"
	"net/http"
)

func main() {
	godotenv.Load(".env")
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
	log.Fatal(http.ListenAndServe(listen_address, nil))
}