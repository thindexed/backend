package destination

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

var fortunes []string

const fortunesLibFile = "./fortunes.txt"

func init() {
	fortunes = readFortunesData(fortunesLibFile)
}

func RegisterHandlers(mux *mux.Router) {
	// Register the ResponseHandler for the allocation Service
	//
	mux.Handle("/api/v1/fortune", http.HandlerFunc(handler))
}

func handler(w http.ResponseWriter, r *http.Request) {

	jsonMsg, err := json.Marshal(FortuneMsg{Fortune: getFortunes()})
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonMsg)
	return

}

func readFortunesData(fileName string) []string {
	rawData, err := os.ReadFile(fileName)
	if err != nil {
		panic(err)
	}

	re := regexp.MustCompile("(?s)%")
	split := re.Split(string(rawData), -1)

	set := []string{}

	for i := range split {
		// Trim the string (keeps new line in between)
		// set = append(set, strings.Trim(split[i], " \n"))
		// Replace all newlines
		set = append(set, strings.Replace(split[i], "\n", "", -1))
	}

	fmt.Println("Debug: # of fortunes: ", len(split))
	return set
}

// Get Fortunes
func getFortunes() string {
	rand.Seed(time.Now().UnixNano())
	return fortunes[rand.Intn(len(fortunes))]
}
