package handler

import (
	"github.com/gorilla/mux"
	"github.com/thindexed/backend/pkg/handler/fortune"
)

func RegisterHandlers(mux *mux.Router) {

	fortune.RegisterHandlers(mux)
}
