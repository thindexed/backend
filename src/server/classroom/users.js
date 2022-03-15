const bcrypt = require("bcrypt");

let db = require("./db").db


let type = "user"
let entity = "users"


exports.get = async function (id, mergeWith) {
  mergeWith = mergeWith || {}
  return new Promise((resolve, reject) => {
    let result = db()
      .get(entity)
      .find({id})
      .value()
    if (result) {
      resolve({...mergeWith, ...result})
    } else {
      reject(type + ' ' + id + ' does not exist')
    }
  })
}


exports.getByUsername = async function (username, mergeWith) {
  mergeWith = mergeWith || {}
  return new Promise((resolve, reject) => {
    let result = db()
      .get(entity)
      .find({username})
      .value()
    if (result) {
      resolve({...mergeWith, ...result})
    } else {
      reject(type + ' ' + username + ' does not exist')
    }
  })
}


exports.all = async function () {
  debugger
  return new Promise((resolve, reject) => {
    let result = db()
      .get(entity)
      .value()
    if (result) {
      if (Array.isArray(result)) {
        resolve(result)
      } else {
        resolve([result])
      }
    } else {
      reject(type + ' ' + id + ' does not exist')
    }
  })
}


exports.del = async function (id) {
  return new Promise((resolve, reject) => {
    db()
      .get(entity)
      .remove({id})
      .write()
    resolve()
  })
}


exports.update = async function (id, data) {
  return new Promise((resolve, reject) => {
    let current = db()
      .get(entity)
      .find({id})
      .value()

    if (current) {
      Object.assign(current, data)
      db()
        .get(entity)
        .find({id})
        .assign(current)
        .write()
      resolve(current)
    } else {
      reject("unknown " + type)
    }
  })
}


exports.create = async function (data) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(data.password, 10, function (err, hash) {
      data.password = hash
      db().get(entity)
        .push(data)
        .write()
      resolve(data)
    })
  })
}
