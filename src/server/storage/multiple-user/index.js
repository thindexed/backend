const path = require('path')
const makeDir = require('make-dir')
const shortid = require('../../util/shortid')
const sanitize = require("../../util/sanitize-filepath")
const generic = require("../_base_")
const classroom = require('./../../classroom')
let {token_set, token_get} = require("./token-user")

let restGroup = require("./rest-group")
let restAssignment = require("./rest-assignment")

let brainsHomeDir = null
let sheetsHomeDir = null
let brainsSharedDir = null
let sheetsSharedDir = null

// convertToUserBaseFolder
function userFolder(baseFolder, req) {
  return baseFolder + req.user.username + path.sep
}

function ensureLoggedIn(options) {
  return function (req, res, next) {
    let role = req.get("x-role")
    if ( role !== "admin" || role !== "user") {
      res.status(401).send('denie')
      return
    }
    next()
  }
}

function ensureAdminLoggedIn(options) {
  return function (req, res, next) {
    let role = req.get("x-role")
    if ( role !== "admin") {
      res.status(401).send('denie')
      return
    }
    next();
  }
}


// Storage backend for the personal usage
//
module.exports = {

  init: function (app, args) {
    // calculate the persistence folder for the brains/sheets files
    //
    brainsHomeDir = path.join(args.folder, "brains", path.sep)
    sheetsHomeDir = path.join(args.folder, "sheets", path.sep)
    brainsSharedDir = path.join(args.folder, "shared", "brains", path.sep)
    sheetsSharedDir = path.join(args.folder, "shared", "sheets", path.sep)
    const sheetsAppDir = path.normalize(path.join(__dirname, '..', '..', '..', 'repository', 'sheets') + path.sep)
    const brainsAppDir = path.normalize(path.join(__dirname, '..', '..', '..', 'repository', 'brains') + path.sep)

    // Ensure that the required storage folder exists
    //
    makeDir(brainsSharedDir)
    makeDir(sheetsSharedDir)
    makeDir(sheetsHomeDir)
    makeDir(brainsHomeDir)

    classroom.init(app, args)
    restGroup.init(app, args)
    restAssignment.init(app, args, sheetsSharedDir, brainsSharedDir)

    console.log("| You are using the " + "'multiple-user'".bold.green + " file storage engine.                   |")
    console.log("| This kind of storage is perfect for small or medium user groups.         |")
    console.log("| It contains a simple user management and a basic login page.             |")
    console.log("|                                                                          |")
    console.log("| You can choose another storage with the '--storage' command line argument|")
    console.log("|                                                                          |")
    console.log("| User File Locations:                                                     |")
    console.log("|    Simulator: " + brainsHomeDir)
    console.log("|    Author: " + sheetsHomeDir)

    // Group Management API
    // User can create groups and invite people to these groups
    //
    app.get   ('/api/user/group',          ensureLoggedIn(), restGroup.list)
    app.get   ('/api/user/group/:id',      ensureLoggedIn(), restGroup.get)
    app.delete('/api/user/group/:id',      ensureLoggedIn(), restGroup.del)
    app.put   ('/api/user/group/:id',      ensureLoggedIn(), restGroup.put)
    app.post  ('/api/user/group',          ensureLoggedIn(), restGroup.post)
    app.post  ('/api/user/group/join',     ensureLoggedIn(), restGroup.join)
    app.delete('/api/user/group/join/:id', ensureLoggedIn(), restGroup.unjoin)
    // group assignment
    app.post  ('/api/user/group/:groupId/assignment',     ensureLoggedIn(), restAssignment.post)
    app.delete('/api/user/group/:groupId/assignment/:id', ensureLoggedIn(), restAssignment.del)


    // =================================================================
    // endpoints for shared circuits / sheets
    // It is even accessible for unknown users
    // =================================================================
    app.get ('/api/shared/sheet/get',  (req, res) => module.exports.getJSONFile(sheetsSharedDir, req.query.filePath, res))
    app.post('/api/shared/sheet/save', (req, res) => module.exports.writeSheet(sheetsSharedDir, shortid.generate() + ".sheet", req.body.content, res))
    app.get ('/api/shared/brain/get',  (req, res) => module.exports.getJSONFile(brainsSharedDir, req.query.filePath, res))
    app.post('/api/shared/brain/save', (req, res) => module.exports.writeBrain(brainsSharedDir, shortid.generate() + ".brain", req.body.content, res))


    // =================================================================
    // Handle user Author files
    //
    // =================================================================
    app.get ('/api/user/sheet/list',   ensureLoggedIn(), (req, res) => module.exports.listFiles(userFolder(sheetsHomeDir, req), req.query.path, res))
    app.get ('/api/user/sheet/get',    ensureLoggedIn(), (req, res) => module.exports.getJSONFile(userFolder(sheetsHomeDir, req), req.query.filePath, res))
    app.post('/api/user/sheet/delete', ensureLoggedIn(), (req, res) => module.exports.deleteFile(userFolder(sheetsHomeDir, req), req.body.filePath, res))
    app.post('/api/user/sheet/rename', ensureLoggedIn(), (req, res) => module.exports.renameFile(userFolder(sheetsHomeDir, req), req.body.from, req.body.to, res))
    app.post('/api/user/sheet/save',   ensureLoggedIn(), (req, res) => module.exports.writeSheet(userFolder(sheetsHomeDir, req), req.body.filePath, req.body.content, res))
    app.post('/api/user/sheet/folder', ensureLoggedIn(), (req, res) => module.exports.createFolder(userFolder(sheetsHomeDir, req), req.body.filePath, res))
    app.get ('/api/user/sheet/pdf',    ensureLoggedIn(), (req, res) => {
      let {render} = require("../../converter/pdf")
      // inject a session token to ensure that "puppeteer" can access the user page without login.
      let id = token_set(req.user)
      render(`http://localhost:${args.port}/author/page.html?user=${req.query.file}&token=${id}`).then(pdf => {
        res.set({'Content-Type': 'application/pdf', 'Content-Length': pdf.length})
        res.send(pdf)
      })
    })


    // =================================================================
    // Handle user brain files
    //
    // =================================================================
    app.get('/api/user/brain/list', ensureLoggedIn(), (req, res) => module.exports.listFiles(userFolder(brainsHomeDir, req), req.query.path, res))
    app.get('/api/user/brain/get', ensureLoggedIn(), (req, res) => module.exports.getJSONFile(userFolder(brainsHomeDir, req), req.query.filePath, res))
    app.get('/api/user/brain/image', ensureLoggedIn(), (req, res) => module.exports.getBase64Image(userFolder(brainsHomeDir, req), req.query.filePath, res))
    app.post('/api/user/brain/delete', ensureLoggedIn(), (req, res) => module.exports.deleteFile(userFolder(brainsHomeDir, req), req.body.filePath, res))
    app.post('/api/user/brain/rename', ensureLoggedIn(), (req, res) => module.exports.renameFile(userFolder(brainsHomeDir, req), req.body.from, req.body.to, res))
    app.post('/api/user/brain/save', ensureLoggedIn(), (req, res) => module.exports.writeBrain(userFolder(brainsHomeDir, req), req.body.filePath, req.body.content, res))
    app.post('/api/user/brain/folder', ensureLoggedIn(), (req, res) => module.exports.createFolder(userFolder(brainsHomeDir, req), req.body.filePath, res))


    // =================================================================
    // Handle pre-installed brain files
    //
    // =================================================================
    app.get('/api/global/brain/list', (req, res) => module.exports.listFiles(brainsAppDir, req.query.path, res))
    app.get('/api/global/brain/get', (req, res) => module.exports.getJSONFile(brainsAppDir, req.query.filePath, res))
    app.get('/api/global/brain/image', (req, res) => module.exports.getBase64Image(brainsAppDir, req.query.filePath, res))
    app.post('/api/global/brain/delete', ensureAdminLoggedIn(), (req, res) => module.exports.deleteFile(brainsAppDir, req.body.filePath, res))
    app.post('/api/global/brain/rename', ensureAdminLoggedIn(), (req, res) => module.exports.renameFile(brainsAppDir, req.body.from, req.body.to, res))
    app.post('/api/global/brain/save', ensureAdminLoggedIn(), (req, res) => module.exports.writeBrain(brainsAppDir, req.body.filePath, req.body.content, res))
    app.post('/api/global/brain/folder', ensureAdminLoggedIn(), (req, res) => module.exports.createFolder(brainsAppDir, req.body.filePath, res))


    // =================================================================
    // Handle pre-installed sheet files
    //
    // =================================================================
    app.get('/api/global/sheet/list', (req, res) => module.exports.listFiles(sheetsAppDir, req.query.path, res))
    app.get('/api/global/sheet/get', (req, res) => module.exports.getJSONFile(sheetsAppDir, req.query.filePath, res))
    app.post('/api/global/sheet/delete', ensureAdminLoggedIn(), (req, res) => module.exports.deleteFile(sheetsAppDir, req.body.filePath, res))
    app.post('/api/global/sheet/rename', ensureAdminLoggedIn(), (req, res) => module.exports.renameFile(sheetsAppDir, req.body.from, req.body.to, res))
    app.post('/api/global/sheet/save', ensureAdminLoggedIn(), (req, res) => module.exports.writeSheet(sheetsAppDir, req.body.filePath, req.body.content, res))
    app.post('/api/global/sheet/folder', ensureAdminLoggedIn(), (req, res) => module.exports.createFolder(sheetsAppDir, req.body.filePath, res))
    app.get('/api/global/sheet/pdf', (req, res) => {
      let {render} = require("../../converter/pdf")
      render(`http://localhost:${args.port}/author/page.html?global=${req.query.file}`).then(pdf => {
        res.set({'Content-Type': 'application/pdf', 'Content-Length': pdf.length})
        res.send(pdf)
      })
    })
  },

  listFiles: generic.listFiles,
  getJSONFile: generic.getJSONFile,
  getBase64Image: generic.getBase64Image,
  renameFile: generic.renameFile,
  deleteFile: generic.deleteFile,
  writeFile: generic.writeFile,
  createFolder: generic.createFolder,

  writeBrain: function (baseDir, subDir, content, res) {
    // "sanitize" is done in the base implementation as well. But we new the 'sanitize' in this method
    // as well for the socket.emit method.
    subDir = sanitize(subDir)
    module.exports.writeFile(baseDir, subDir, content, res, (err) => {
      const io = require('../../comm/websocket').io
      io.sockets.emit("brain:generated", {
        filePath: subDir
      })
    })
  },

  writeSheet: function (baseDir, subDir, content, res) {
    module.exports.writeFile(baseDir, subDir, content, res)
  }
}
 