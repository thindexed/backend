FROM --platform=linux/amd64 golang:1.17-alpine AS builder

WORKDIR /go/src

COPY internal ./internal
COPY cmd ./cmd
COPY go.mod .
COPY go.sum .

# Build 
RUN go build -o main ./cmd/fortune/main.go

FROM --platform=linux/amd64 alpine AS runtime

WORKDIR /app

RUN addgroup beaker && \
    adduser --gecos "" --ingroup beaker --disabled-password beaker

USER beaker:beaker
COPY --from=builder --chown=beaker:beaker /go/src/main .
COPY --from=builder --chown=beaker:beaker /go/src/internal/lib ./internal/lib

ENTRYPOINT ["/app/main"]
