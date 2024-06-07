package session

import (
	"os"
	// "fmt"
	// "encoding/json"
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

func CheckSession(w http.ResponseWriter, r *http.Request) bool {
	session, err := store.Get(r, "chatroom_session")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return false
	}

	if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
		return false 
	} else {
		return true
	}
}

func SetSession(w http.ResponseWriter, r *http.Request, username string) {
	store.Options = &sessions.Options{
		MaxAge: 300,
		SameSite: http.SameSiteNoneMode,
		Secure: true,
	}
	session, err := store.Get(r, "chatroom_session")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values["authenticated"] = true
	session.Values["username"] = username
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