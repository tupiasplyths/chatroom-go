package main

import (
	// "flag"
	// "fmt"
	"fmt"
	"log"
	"net/http"
)

func CountClients(server *WsServer) int {
	return len(server.clients)
}

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
	log.Fatal(http.ListenAndServe("0.0.0.0:3789", nil))
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	// allow cors for any origin
	// TODO: delete when implement SSL
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}