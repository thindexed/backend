#!/usr/bin/env node
const express = require('express')
const app = express()
const http = require('http').Server(app)


const { program } = require('commander')
const bodyParser = require('body-parser')
const colors = require('colors')
const io = require('./comm/websocket').connect(http, {path: '/socket.io'})


program
  .option('--folder <string>',  'The storage folder to use if the type of storage supports it', process.env.HOME + "/.brainbox/" )
  .option('--port <number>',    'The port number for the server to use', 8080)

program.parse(process.argv)


console.log("+==========================================================================+")
console.log('| '+'    Welcome to brainbox - the beginning of something awesome'.red+'             |');
console.log("|==========================================================================|")

// application specific configuration settings
//
const storage = require("./storage/multiple-user")


// Tell the bodyparser middleware to accept more data
//
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))


runServer()

// =======================================================================
//
// The main HTTP Server and socket.io run loop. Serves the HTML files
// and the socket.io access point to change/read the GPIO pins if the server
// is running on an Raspberry Pi
//
// =======================================================================
async function  runServer() {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.get('/', (req, res) => res.redirect('/home/'));

  await storage.init(app, program)

  http.listen(program.port, function () {
    console.log('| System is up and running. Copy the URL below and open this               |');
    console.log('| in your browser: http://localhost:' + program.port + '/                    ');
    console.log("============================================================================")
  });
}
