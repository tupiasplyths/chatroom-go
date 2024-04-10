package dbConnect

import (
	"os"
	"log"
	"fmt"
	"database/sql"
	_ "github.com/lib/pq"
	"github.com/joho/godotenv"
)

func dbURL() string {
	godotenv.Load(".env")
	dbUsername := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbAddress := os.Getenv("DB_ADDRESS")
	dbPort := os.Getenv("DB_PORT")
	// url := "postgresql://" + dbUsername + ":" + dbPassword + "@(" + dbAddress + ")/" + dbName + "?sslmode=disable"
	url := fmt.Sprintf(
		"host=%s user=%s port=%s password=%s dbname=%s sslmode=disable", 
		dbAddress, dbUsername, dbPort, dbPassword, dbName)
	return url
}

func DbConnect() *sql.DB {
	db, err := sql.Open("postgres", dbURL())
	if err != nil {
		log.Fatal(err)
	}  
	log.Println("db connected")
	return db
}