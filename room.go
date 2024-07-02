package main

import (
	"fmt"
	"log"
)

type Room struct {
	Name string `json:"name"`
	clients map[*Client]bool
	register chan *Client
	unregister chan *Client
	broadcast chan *Message
}

func NewRoom(name string) *Room {
	return &Room{
		Name: name,
		clients: make(map[*Client]bool),
		register: make(chan *Client),
		unregister: make(chan *Client),
		broadcast: make(chan *Message),
	}
}

func (room *Room) RunRoom() {
	for {
		select {
		case client := <-room.register:
			room.registerClientInRoom(client)
		case client := <-room.unregister:
			room.unregisterClientInRoom(client)
		case message := <-room.broadcast:
			room.broadcastToRoom(message.encode())
		}
	}
}

func (room *Room) registerClientInRoom(client *Client) {
	room.notifyClientsJoined(client)
	room.clients[client] = true
	fmt.Printf("new client %s in room %s\n", client.GetName(), room.GetName())
}

func (room *Room) unregisterClientInRoom(client *Client) {
	delete(room.clients, client)
}

func (room *Room) broadcastToRoom(message []byte) {
	for client := range room.clients {
		client.send <- message
	}
	log.Printf("sent a message to room %s\n", room.GetName())
}

func (room *Room) notifyClientsJoined(client *Client) {
	message := &Message{
		Action:  SendMessageAction,
		Target:  room,
		Message: fmt.Sprintf("welcome %s", client.GetName()),
		Sender:  &Client{name: "bot"},
	}

	room.broadcastToRoom(message.encode())
}

func (room *Room) ListRoomsClients() {
	var clients[] string
	for client := range room.clients {
		clients = append(clients, client.GetName())
	}
	message := &Message{
		Action:  "list-users",
		Target:  room,
		Message: fmt.Sprintf("%s", clients),
		Sender:  &Client{name: "bot"},
	}
	room.broadcastToRoom(message.encode())
	log.Println("sending users list")

}

func (room *Room) GetName() string {
	return room.Name
}

func (room *Room) GetClients() map[*Client]bool {
	return room.clients
}