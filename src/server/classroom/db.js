const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const makeDir = require('make-dir')
const path = require('path')
const fs = require('fs')
const bcrypt = require("bcrypt")


let db = null

let defaultUsers = [
  {id: "1", username: 'admin', password: 'secret', displayName: 'Admin', role: "admin", email: 'admin@example.com'},
  {id: "2", username: 'jack',  password: 'secret', displayName: 'Jack',  role: "user",  email: 'jack@example.com'},
  {id: "3", username: 'jill',  password: 'secret', displayName: 'Jill',  role: "user",  email: 'jill@example.com'}
]

exports.init = async function (app, args) {
  let dbDir = path.join(args.folder, "classroom", path.sep)
  let dbFile = path.join(dbDir, 'db.json')
  let initialRun = !fs.existsSync(dbFile)

  // Ensure that the required storage folder exists
  //
  makeDir(dbDir)

  const adapter = new FileSync(dbFile)
  db = low(adapter)

  // Set some defaults (required if your JSON file is empty)
  //
  db.defaults({users: [], groups: [], assignments: []})
    .write()

  // setup some default users if we start the first time
  //
  if (initialRun) {
    console.log("Setting up default users for the first run")
    defaultUsers.forEach((user) => {
      bcrypt.hash(user.password, 10, function (err, hash) {
        console.log(user)
        user.password = hash
        db.get("users")
          .push(user)
          .write()
      })
    })
  }
}

exports.db = function () {
  return db
}
