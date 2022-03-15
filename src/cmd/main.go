package main

import (
	"fmt"

	"log"
	"net/http"
	"os"

	"github.com/thindexed/backend/pkg/handler"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No '.env' file. Running with default")
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Running on http://localhost:%v\n", port)
	mux := mux.NewRouter()
	handler.RegisterHandlers(mux)

	err := http.ListenAndServe(":"+port, mux)
	if err != nil {
		panic(err)
	}
}
