package hash

import (
	"golang.org/x/crypto/bcrypt"
)

func HashString(password string) (string, error) {
	hashedString, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(hashedString), err
}

func CheckHash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}