package main

import (
	"os"
	"log"
	"database/sql"
	_ "github.com/lib/pq"
)

func dbURL() string {
	dbUsername := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbAddress := os.Getenv("DB_ADDRESS")

	url := "postgresql://" + dbUsername + ":" + dbPassword + "@(" + dbAddress + ")/" + dbName + "?sslmode=disable"
	return url
}

func dbConnect() *sql.DB {
	db, err := sql.Open("postgres", dbURL())
	if err != nil {
		log.Fatal(err)
	}
	return db
}