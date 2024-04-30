package main

import (
	// "flag"
	// "fmt"
	"fmt"
	"log"
	"net/http"
)

func main() {
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
	log.Fatal(http.ListenAndServe("0.0.0.0:3789", nil))
}