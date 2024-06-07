package main

import (
	"bufio"
	"encoding/json"
	// "fmt"
	"log"
	"net/http"
	"os"
)

func CountClients(server *WsServer) int {
	return len(server.clients)
}

func enableCors(w *http.ResponseWriter) {
	// (*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	// allow cors for any origin
	// TODO: delete when implement SSL
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func returnChannelID(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
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

	w.WriteHeader(205)
	json.NewEncoder(w).Encode(&Response{Message: "no channelIDs"})
}