package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
}
var (
	newline = []byte{'\n'}
	// space = []byte{' '}
)

type Client struct {
	Name string
	conn *websocket.Conn
	wsServer *WsServer
	send chan []byte
	rooms map[*Room]bool
}

func newClient(conn *websocket.Conn, wsServer *WsServer, name string) *Client {
	return &Client{
		conn: conn,
		wsServer: wsServer,
		send: make(chan []byte, 256),
		rooms: make(map[*Room]bool),
		Name: name,
	}
}

func ServeWS(w http.ResponseWriter, r *http.Request, wsServer *WsServer) {
	//enable cross origin
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	name, ok := r.URL.Query()["name"]
	if !ok || len(name[0]) < 1 {
		log.Println("Url Param 'name' is missing")
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := newClient(conn, wsServer, name[0])
	fmt.Printf("new client\n")
	fmt.Println(client.GetName())
	go client.writePump()
	go client.readPump()


	wsServer.register <- client
}

func (client *Client) readPump() {
	defer func() {
		client.disconnect()
	}()

	client.conn.SetReadLimit(10000)
	client.conn.SetReadDeadline(time.Now().Add(60*time.Second))
	client.conn.SetPongHandler(func(string) error { client.conn.SetReadDeadline(time.Now().Add(60 * time.Second)); return nil })

	for {
		_, msg, err := client.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("unexpected error: %v", err)
			}
			break
		}

		// client.wsServer.broadcast <- msg
		client.handleNewMessage(msg)
	}
}

func (client *Client) writePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		client.conn.Close()
	}()

	for {
		select {
		case message, ok := <-client.send:
			client.conn.SetWriteDeadline(time.Now().Add(10  *time.Second))
			if !ok {
				client.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			w, err := client.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(client.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-client.send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			client.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := client.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (client *Client) disconnect() {
	client.wsServer.unregister <- client
	for room := range client.rooms {
		room.unregister <- client
	}
	close(client.send)
	client.conn.Close()
}

func (client *Client) GetName() string {
	return client.Name
}

func (client *Client) handleNewMessage(jsonMessage []byte) {
	var message Message
	if err := json.Unmarshal(jsonMessage, &message); err != nil {
		log.Printf("json: %s", err)
	}

	message.Sender = client

	switch message.Action {
	case SendMessageAction:
		roomName := message.Target
		if room := client.wsServer.findRoomByName(roomName.Name); room != nil {
			room.broadcast <- &message
		}
		log.Printf("received a message from %s to room %s\n", client.GetName(), message.Target.GetName())
		fmt.Println(message.Message)
	case JoinRoomAction:
		client.handleJoinRoomMessage(message)
	case LeaveRoomAction:
		client.handleLeaveRoomMessage(message)
	case "get-users":
		roomName := message.Target
		if room := client.wsServer.findRoomByName(roomName.Name); room != nil {
			room.ListRoomsClients()
		}
		log.Println("re-list users")
	case "get-rooms":
		client.handleRoomListRequest()
	}

}

func (client *Client) handleJoinRoomMessage(message Message) {
	roomName := message.Message

	room := client.wsServer.findRoomByName(roomName)
	if room == nil {
		room = client.wsServer.createRoom(roomName)
	}

	client.rooms[room] = true
	room.register <- client
}

func (client *Client) handleLeaveRoomMessage(message Message) {
	room := client.wsServer.findRoomByName(message.Message)
	delete(client.rooms, room)

	room.unregister <- client
}

func (client *Client) handleRoomListRequest() {
	var roomList []string
	for room := range client.wsServer.rooms {
		roomList = append(roomList, room.GetName())
	}

	message := &Message{
		Action:  "list-rooms",
		Message: fmt.Sprintf("%s", roomList),
	}
	client.send <- message.encode()
}