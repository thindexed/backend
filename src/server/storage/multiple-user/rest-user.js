const shortid = require('../../util/shortid')
const sanitize = require("sanitize-filename")

const classroom = require('../../classroom')

// dont't expose passwords or other sensible data to the outer world
function mapUser(user) {
  if (Array.isArray(user)) {
    return user.map(data => mapUser(data))
  }
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    role: user.role
  }
}


exports.init = (app, args)=>{
}

// each backend storage with authentication MUST have an "userinfo" endpoint
//
exports.userinfo = (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(403).send("user not logged in")
  } else {
    res.send(mapUser(req.user))
  }
}

exports.list = (req, res) => {
  classroom.users.all()
    .then( users => {
      users = users.map(u => mapUser(u))
      res.status(200).send(users)
    })
    .catch( error => {
      res.status(500).send(error)
    })
}

exports.get = (req, res) => {
  classroom.users.get(req.params.id)
    .then((user) => {
      res.status(200).send(mapUser(user))
    })
    .catch((error) => {
      res.status(500).send(error)
    })
}

exports.del = (req, res) => {
  classroom.users.del(req.params.id)
    .then(() => {
      res.status(200).send("done")
    })
    .catch((error) => {
      res.status(500).send(error)
    })
}

exports.put = (req, res) => {
  let user = req.body

  // it is not allowed to change the username or the id
  delete user.username
  delete user.id

  classroom.users.update(req.params.id, user)
    .then((userUpdated) => {
      res.status(200).send(mapUser(userUpdated))
    })
    .catch((error) => {
      res.status(500).send(error)
    })
}


exports.post = (req, res) => {
  let user = req.body

  if (!user.username) {
    res.status(400).send("username");
    return
  }
  if (!user.password) {
    res.status(400).send("password");
    return
  }
  if (!user.displayName) {
    res.status(400).send("displayName");
    return
  }

  user.id = shortid.generate()
  user.username = sanitize(user.username).replace(/ /g, "")
  classroom.users.getByUsername(user.username)
    .then( dublicatUser => {
      res.status(422).send("username")
    })
    .catch( error => {
      classroom.users.create(user)
        .then( userCreated => {
          res.status(200).send(mapUser(userCreated))
        })
    })
}
