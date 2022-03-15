const classroom = require('../../classroom')
const shortid = require('../../util/shortid')

exports.init = (app, args)=>{
}

exports.validate = (req, res) => {
  if(req.params.name.length<7){
    res.status(422).send("invalid")
    return
  }

  classroom.users.getByUsername(req.params.name)
    .then((user) => {
      if(user){
        res.status(422).send("invalid")
      }
      else{
        res.status(200).send("valid")
      }
    })
    .catch((error) => {
      res.status(200).send("valid")
    })
}


exports.post = (req, res) => {
  let data = req.body

  if (!data.username) {
    res.status(400).send("username")
    return
  }

  if(data.username.indexOf(" ")>=0){
    res.status(400).send("username")
    return
  }

  let generatedPassword = shortid.generate()
  let userToCreate = {
    username: data.username,
    displayName: data.username,
    role: "user",
    id: shortid.generate(),
    password: generatedPassword
  }

  classroom.users.getByUsername(userToCreate.username)
    .then( dublicatUser => {
      res.status(422).send("username")
    })
    .catch( error => {
      classroom.users.create(userToCreate)
        .then( () => {
          // in the "create" process we return the generated password. The user must change
          // them after the first login
          let newUser = JSON.parse(JSON.stringify(userToCreate))
          newUser.password = generatedPassword
          res.status(200).send(newUser)
        })
    })
}
