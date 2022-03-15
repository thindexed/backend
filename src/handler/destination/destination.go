package destination

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

func RegisterHandlers(mux *mux.Router) {
	// Register the ResponseHandler for the allocation Service
	//
	mux.Handle("/api/v1/destination", http.HandlerFunc(handler))
}

func handler(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Handle destination call")

	destination_endpoint := uri + "/destination-configuration/v1/subaccountDestinations"

	client := &http.Client{}

	// prepare tokenExchange with the XSUAAclient
	//
	data := url.Values{}

		r, err = http.NewRequest("POST", xsuaa_endpoint, strings.NewReader(data.Encode())) // URL-encoded payload
		if err != nil {
			log.Fatal(err)
		}
		r.Header.Add("Content-Type", "application/x-www-form-urlencoded")
		r.Header.Add("Content-Length", strconv.Itoa(len(data.Encode())))
		r.Header.Add("X-zid", zone_uuid)
		r.Header.Add("Accept", "application/json")

		res, err := client.Do(r)
		if err != nil {
			log.Fatal(err)
		}
		log.Println(res.Status)
		defer res.Body.Close()
		body, err := ioutil.ReadAll(res.Body)
		if err != nil {
			log.Fatal(err)
		}
		// log.Println(string(body))

		// Call the destination service
		//
		var token DestinationToken
		json.Unmarshal(body, &token)
		// log.Println(token.AccessToken)

		data = url.Values{}
		r, err = http.NewRequest("GET", destination_endpoint, strings.NewReader(data.Encode())) // URL-encoded payload
		if err != nil {
			log.Fatal(err)
		}
		r.Header.Add("Authorization", "Bearer "+token.AccessToken)
		r.Header.Add("Accept", "application/json")

		res, err = client.Do(r)
		if err != nil {
			log.Fatal(err)
		}
		log.Println(res.Status)
		defer res.Body.Close()
		body, err = ioutil.ReadAll(res.Body)
		if err != nil {
			log.Fatal(err)
		}
		// log.Println(string(body))
		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
		return
	} else {
		fmt.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte("[]"))
}
