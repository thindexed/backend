let db = require("./db").db

let type = "Assignment"
let entity = "assignments"


exports.get = async function (id, mergeWith) {
  mergeWith = mergeWith || {}
  return new Promise((resolve, reject) => {
    let result = db()
      .get(entity)
      .find({id})
      .value()
    if (result) {
      resolve( {...mergeWith, ...result } )
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
    db().get(entity)
      .push(data)
      .write()
    return resolve(data)
  })
}
