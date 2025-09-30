# chatroom-go  
**A simple Go-based chatroom application with a frontend**  

---

## 🧩 About  
This is a lightweight, open-source chatroom implemented in **Go** with a **frontend** component. It allows users to join a chatroom, send messages, and interact with a simple backend. The project is designed to be easy to use, extendable, and a great starting point for learning Go or building a basic chat application.

---

## 📦 Features  
- **Frontend Component**: A simple web frontend (HTML, CSS, JavaScript) for interacting with the backend.  
- **Room Management**: Users can join and leave rooms.  
- **Message Sending**: Send messages to a specific room.  
- **Basic Authentication**: Users can log in with a username and password.  

---

## 📦 Client 
The `client/` folder contains the frontend code, which is a simple web application. You can run it separately using a web server like **HTTP Server** or **Node.js**.  

### 📁 Frontend Code (React.js)
The frontend is a basic web app with the following features:  
- User login (via username/password).  
- Room listing.  
- Message sending to a specific room.  

---

## 📌 Usage  
Run the backend (CLI) and frontend (web) separately:  

```bash
# Run backend (CLI)
go run github.com/tupiasplyths/chatroom-server

# Run frontend (web)
cd client
bun install
bun start
```  

> **Note**: The frontend is a **separate project** from the backend. It can be run independently.


---

## 📱 Platforms  
- **Operating System**: Linux, macOS, Windows  
- **Dependencies**: Go 1.20+ (backend)  
- **Frontend Dependencies**: Node.js (npm) or Bun (for web version)  
- **Database**: PostgreSQL>=6

---

## 📚 References  
- [Frontend Code](client/) (HTML, CSS, JS)  

---

