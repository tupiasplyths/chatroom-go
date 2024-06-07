package session;

import (
	"fmt"
	"net/http"
	"github.com/gorilla/sessions"
)

var (
	key = []byte("bun-bun-cha")
	encryption_key = []byte("bun-bun-cha-encryption-key")
	store = sessions.NewCookieStore(key, encryption_key)
)

func checkSession(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "cookie-name")
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

func setSession(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "cookie-name")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values["authenticated"] = true
	session.Save(r, w)
}

func clearSession(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "cookie-name")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values["authenticated"] = false
	session.Save(r, w)
}