package main

import (
	"es-app/db"
	"es-app/model"
	"fmt"
	"log"
)

func main() {
	dbConn := db.NewDB()
	defer func() {
		if r := recover(); r != nil {
			log.Fatalf("🔴 Migration failed: %v", r)
		} else {
			fmt.Println("🟢 Successfully migrated")
		}
	}()
	defer db.CloseDB(dbConn)

	if err := dbConn.AutoMigrate(&model.User{}); err != nil {
		log.Fatalf("🔴 Error during migration: %v", err)
	}
}
