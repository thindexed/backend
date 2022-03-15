const makeDir = require('make-dir')
const path = require('path')
const fs = require('fs')

let levelup = require('levelup')
let leveldown = require('leveldown')
let levelgraph = require('levelgraph')

let db = null

exports.init = function (app, args) {
  let dbDir = path.join(args.folder, "classroom", "graph", path.sep)
  let initialRun = !fs.existsSync(dbDir)

  // Ensure that the required storage folder exists
  //
  makeDir(dbDir)

  db = levelgraph(levelup(leveldown(dbDir)))
}

exports.put = function(data) {
  return new Promise((resolve, reject) => {
    db.put(data, (error) => {
      if(error) reject(error)
      else resolve(data)
    })
  })
}


exports.del = function(data) {
  return new Promise((resolve, reject) => {
    db.del(data, (error) => {
      debugger
      if(error) reject(error)
      else resolve(data)
    })
  })
}

exports.get = function(data) {
  return new Promise((resolve, reject) => {
    db.get(data,(error, result) => {
      if(error) reject(error)
      else resolve( JSON.parse("[" + new String(result).toString() + "]"))
    })
  })
}

exports.search = function(data) {
  return new Promise((resolve, reject) => {
    db.search(data,(error, result) => {
      if(error) reject(error)
      else resolve(JSON.parse("[" + new String(result).toString() + "]"))
    })
  })
}

exports.v = function(data) {
  return db.v(data)
}
