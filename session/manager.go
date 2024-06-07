package session;

import (
	"os"
	"fmt"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/gorilla/sessions"
)

var (
	_ = godotenv.Load(".env")
	key = []byte(os.Getenv("SESSION_KEY"))
	// encryption_key = []byte("bun-bun-cha-encryption-key")
	store = sessions.NewCookieStore(key)
)

func CheckSession(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "chatroom_session")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}
	
	fmt.Fprintf(w, "Hello, %v\n", session.Values["username"])
}

func SetSession(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "chatroom_session")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values["authenticated"] = true
	session.Save(r, w)
}

func ClearSession(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "chatroom_session")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values["authenticated"] = false
	session.Save(r, w)
}