package fortune

import (
	"net/http"

	"github.com/gorilla/mux"
)

func init() {
}

func RegisterHandlers(mux *mux.Router) {
	// Register the ResponseHandler for the allocation Service
	//
	mux.Handle("/api/v1/fortune", http.HandlerFunc(handler))
}

func handler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte("jsonMsg"))
	return
}
