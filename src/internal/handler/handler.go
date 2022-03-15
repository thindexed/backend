package handler

import (
	"thindexed/backend/internal/handler/fortune"

	"github.com/gorilla/mux"
)

func RegisterHandlers(mux *mux.Router) {

	fortune.RegisterHandlers(mux)
}
