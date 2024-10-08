package main

import (
	"bufio"
	"encoding/json"
	"slices"
	"strings"

	// "fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

var (
	_ = godotenv.Load(".env")
	allowedOrigin = strings.Split(os.Getenv("ALLOWED_ORIGIN"), ", ")

)

func CountClients(server *WsServer) int {
	return len(server.clients)
}

func enableCors(w *http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	if slices.Contains(allowedOrigin, origin) {
		// (*w).Header().Set("Access-Control-Allow-Origin", os.Getenv("FRONTEND_URL"))
		(*w).Header().Set("Access-Control-Allow-Origin", origin)
	}
	// (*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	// allow cors for any origin
	// TODO: delete when implement SSL
	// (*w).Header().Set("Access-Control-Allow-Credentials", "true")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Access-Control-Allow-Credentials, Access-Control-Allow-Origin")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
}

func returnChannelID(w http.ResponseWriter, r *http.Request) {
	enableCors(&w, r)
	w.Header().Set("Content-Type", "application/json")

	file, err := os.Open("channelIDs.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	var channelIDs string

	scanner := bufio.NewScanner(file)
	scanner.Split(bufio.ScanLines)
	for scanner.Scan() {
		channelIDs += scanner.Text() + ","
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	if len(channelIDs) > 0 {
		channelIDs = channelIDs[:len(channelIDs)-1]
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(&Response{Message: channelIDs})
		return
	}

	w.WriteHeader(http.StatusNoContent)
	json.NewEncoder(w).Encode(&Response{Message: "no channelIDs"})
}