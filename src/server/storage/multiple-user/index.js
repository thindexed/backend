const colors = require('colors')
const path = require('path')
const express = require('express')
const makeDir = require('make-dir')
const uuid = require('uuid/v4')
const shortid = require('../../util/shortid')
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const Session = require('express-session')
const FileStore = require('session-file-store')(Session)
const bcrypt = require("bcrypt")
const sanitize = require("../../util/sanitize-filepath")
const generic = require("../_base_")
const update = require("../../update")
const {thumbnail, generateShapeIndex} = require("../../converter/thumbnail")
const classroom = require('./../../classroom')
let {token_set, token_get} = require("./token-user")
const {trim} = require("../../util/string")

let restUser = require("./rest-user")
let restPassword = require("./rest-password")
let restGroup = require("./rest-group")
let restAssignment = require("./rest-assignment")
let restRegistration = require("./rest-registration")

let permissionsAnonym = require("./permissions-anonym")
let permissionsUser = require("./permissions-user")
let permissionsAdmin = require("./permissions-admin")

let brainsHomeDir = null
let sheetsHomeDir = null
let brainsSharedDir = null
let sheetsSharedDir = null

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function (username, password, cb) {
    classroom.users.getByUsername(username)
      .then((user) => {
        bcrypt.compare(password, user.password)
          .then((result) => {
            if (result) {
              return cb(null, user)
            }
            return cb(null, false)
          })
      })
      .catch(error => {
        cb(null, false)
      })
  }))

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
  cb(null, user.id)
});

passport.deserializeUser(function (id, cb) {
  classroom.users.get(id)
    .then( user => {
      cb(null, user)
    })
    .catch( error => {
      cb(null, false)
    })
})

// convertToUserBaseFolder
function userFolder(baseFolder, req) {
  return baseFolder + req.user.username + path.sep
}


function ensureLoggedIn(options) {
  if (typeof options == 'string') {
    options = {redirectTo: options}
  }
  options = options || {}
  let url = options.redirectTo || '/login'
  let setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo
  return function (req, res, next) {
    // token is required for server side rendering with
    // puppeteer
    let token = req.query.token
    if (token) {
      let user = token_get(token)
      if (!req.user) {
        req.user = user
      }
    }

    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url
      }
      return res.redirect(url)
    }
    next()
  }
}

function ensureAdminLoggedIn(options) {
  if (typeof options == 'string') {
    options = {redirectTo: options}
  }
  options = options || {}
  let url = options.redirectTo || '/login'
  let setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo
  return function (req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated() || req.user.role !== "admin") {
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url
      }
      return res.redirect(url)
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
    const shapesAppDir = path.normalize(path.join(__dirname, '..', '..', '..', 'repository', 'shapes') + path.sep)
    const brainsAppDir = path.normalize(path.join(__dirname, '..', '..', '..', 'repository', 'brains') + path.sep)

    // Ensure that the required storage folder exists
    //
    makeDir(brainsSharedDir)
    makeDir(sheetsSharedDir)
    makeDir(sheetsHomeDir)
    makeDir(brainsHomeDir)

    classroom.init(app, args)
    restUser.init(app, args)
    restPassword.init(app, args)
    restGroup.init(app, args)
    restAssignment.init(app, args, sheetsSharedDir, brainsSharedDir)
    restRegistration.init(app, args)

    // add & configure middleware
    app.use(Session({
      genid: () => uuid(),
      store: new FileStore(),
      secret: 'ASDFQ"§$%$E&%RTZHFGDSAW$%/&EUTZDJFGH',
      resave: false,
      saveUninitialized: true
    }))


    // Initialize Passport and restore authentication state, if any, from the
    // session.
    app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));
    app.use(passport.initialize())
    app.use(passport.session())

    // inject the authentication endpoints.
    //
    app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), this.onLoggedIn)
    app.use('/login', (req, res, next) => {
      if (req.query.returnTo) {
        req.session.returnTo = req.query.returnTo
      }
      next()
    }, express.static(__dirname + '/../../../frontend/login'))

    app.get('/logout', (req, res) => {
      req.logout();
      res.redirect(req.query.returnTo ? `../${req.query.returnTo}/` : '/')
    })


    console.log("| You are using the " + "'multiple-user'".bold.green + " file storage engine.                   |")
    console.log("| This kind of storage is perfect for small or medium user groups.         |")
    console.log("| It contains a simple user management and a basic login page.             |")
    console.log("|                                                                          |")
    console.log("| You can choose another storage with the '--storage' command line argument|")
    console.log("|                                                                          |")
    console.log("| User File Locations:                                                     |")
    console.log("|    Simulator: " + brainsHomeDir)
    console.log("|    Author: " + sheetsHomeDir)


    // the UI ask for the permissions of the related user to setup the UI in good fashion.
    // This is just for the UI part. the backend protects the endpoints as well.
    //
    app.get('/permissions', (req, res) => {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        res.send(permissionsAnonym)
      } else {
        if (req.user.role === "admin") {
          res.send(permissionsAdmin)
        } else {
          res.send(permissionsUser)
        }
      }
    })

    // Rest API for Password handling
    //
    // only an admin can create a "reset password" request right now
    // endpoint to generate a password reset token
    app.use ("/password",       express.static(__dirname + '/../../../frontend/resetpwd'))
    app.post("/password/token",        ensureAdminLoggedIn(), restPassword.token_post)
    // endpoint to check if the token is valid
    app.get ("/password/token/:token",                        restPassword.token_get)
    // endpoint to set the password. requires a valid token and the new password
    app.post("/password",                                     restPassword.set)


    // Self Registration
    //
    app.use ('/register', express.static(__dirname + '/../../../frontend/register'));
    app.get ('/api/register/validate/:name', restRegistration.validate)
    app.post('/api/register/',               restRegistration.post)

    // User Management API
    //
    app.use   ('/user',               ensureAdminLoggedIn(), express.static(__dirname + '/../../../frontend/user'));
    app.get   ('/api/admin/user',     ensureAdminLoggedIn(), restUser.list)
    app.get   ('/api/admin/user/:id', ensureAdminLoggedIn(), restUser.get)
    app.delete('/api/admin/user/:id', ensureAdminLoggedIn(), restUser.del)
    app.put   ('/api/admin/user/:id', ensureAdminLoggedIn(), restUser.put)
    app.post  ('/api/admin/user',     ensureAdminLoggedIn(), restUser.post)
    app.get   ('/userinfo',                                  restUser.userinfo)

    // Group Management API
    // User can create groups and invite people to these groups
    //
    app.use   ('/groups',                  ensureLoggedIn(), express.static(__dirname + '/../../../frontend/groups'));
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


    // Serve the static content for the different modules of brainbox
    //
    app.use('/_common',  express.static(__dirname + '/../../../frontend/_common'));
    app.use('/designer', express.static(__dirname + '/../../../frontend/designer'));
    app.use('/circuit',  express.static(__dirname + '/../../../frontend/circuit'));
    app.use('/author',   express.static(__dirname + '/../../../frontend/author'));
    app.use('/home',     express.static(__dirname + '/../../../frontend/home'));

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

    // =================================================================
    // Handle system shape files
    //
    // =================================================================
    app.use('/shapes/global', express.static(shapesAppDir));
    app.get('/api/global/shape/list', (req, res) => module.exports.listFiles(shapesAppDir, req.query.path, res))
    app.get('/api/global/shape/get', (req, res) => module.exports.getJSONFile(shapesAppDir, req.query.filePath, res))
    app.get('/api/global/shape/image', (req, res) => module.exports.getBase64Image(shapesAppDir, req.query.filePath, res))
    app.post('/api/global/shape/delete', ensureAdminLoggedIn(), (req, res) => {
      module.exports.deleteFile(shapesAppDir, req.body.filePath)
      module.exports.deleteFile(shapesAppDir, req.body.filePath.replace(".shape", ".js"))
      module.exports.deleteFile(shapesAppDir, req.body.filePath.replace(".shape", ".md"))
      module.exports.deleteFile(shapesAppDir, req.body.filePath.replace(".shape", ".custom"))
      module.exports.deleteFile(shapesAppDir, req.body.filePath.replace(".shape", ".png"), res)
      generateShapeIndex()
    })
    app.post('/api/global/shape/rename', ensureAdminLoggedIn(), (req, res) => module.exports.renameFile(shapesAppDir, req.body.from, req.body.to, res))
    app.post('/api/global/shape/save', ensureAdminLoggedIn(), (req, res) => module.exports.writeShape(shapesAppDir, req.body.filePath, req.body.content, req.body.commitMessage, res))
    app.post('/api/global/shape/folder', ensureAdminLoggedIn(), (req, res) => module.exports.createFolder(shapesAppDir, req.body.filePath, res))

    // =================================================================
    // Handle system update files
    //
    // =================================================================
    app.get('/api/updates/shapes', ensureAdminLoggedIn(), (req, res) => update.getLatestShapeRelease(res))
    app.post('/api/updates/shapes', ensureAdminLoggedIn(), async (req, res) => update.upgradeTo(shapesAppDir, req.body.url, res))
  },

  listFiles: generic.listFiles,
  getJSONFile: generic.getJSONFile,
  getBase64Image: generic.getBase64Image,
  renameFile: generic.renameFile,
  deleteFile: generic.deleteFile,
  writeFile: generic.writeFile,
  createFolder: generic.createFolder,

  onLoggedIn(req, res) {
    let returnTo = req.session.returnTo ? `../${trim(req.session.returnTo,'/')}/` : '/'
    res.redirect(returnTo)
    makeDir(sheetsHomeDir + req.user.username)
    makeDir(brainsHomeDir + req.user.username)
  },

  writeShape: function (baseDir, subDir, content, reason, res) {
    const io = require('../../comm/websocket').io

    module.exports.writeFile(baseDir, subDir, content, res, (err) => {
      // inform the browser that the processing of the
      // code generation is ongoing
      //
      io.sockets.emit("file:generating", {
        filePath: subDir
      })

      // create the js/png/md async to avoid a blocked UI
      //
      thumbnail(baseDir, subDir)

      io.sockets.emit("file:generated", {
        filePath: subDir,
        imagePath: subDir.replace(".shape", ".png"),
        jsPath: subDir.replace(".shape", ".js")
      })

      // commit the shape to the connected github backend
      // (if configured)
      update.commitShape(path.join(baseDir, subDir), subDir, reason)
    })
  },

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

