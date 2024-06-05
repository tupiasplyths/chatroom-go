package main

import (
	"os"
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/gorilla/sessions"

	db "github.com/tupiasplyths/chatroom-server/dbConnect"
)

var (
	_ = godotenv.Load(".env")
	database = db.DB_Connect()
	key = []byte(os.Getenv("SESSION_KEY"))
	store = sessions.NewCookieStore(key)
)

func main() {
	store.Options = &sessions.Options{
		Domain: "localhost",
		MaxAge: 300,
	}
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
	http.HandleFunc("/api/authenicate", authenicate)
	log.Fatal(http.ListenAndServe(listen_address, nil))
}