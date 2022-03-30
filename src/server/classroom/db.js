const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const makeDir = require('make-dir')
const path = require('path')

let db = null


exports.init = async function (app, args) {
  let dbDir = path.join(args.folder, "classroom", path.sep)
  let dbFile = path.join(dbDir, 'db.json')

  // Ensure that the required storage folder exists
  //
  makeDir(dbDir)

  const adapter = new FileSync(dbFile)
  db = low(adapter)

  // Set some defaults (required if your JSON file is empty)
  //
  db.defaults({groups: [], assignments: []})
    .write()
}

exports.db = function () {
  return db
}
