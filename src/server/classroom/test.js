const path = require('path')

let dir = process.env.HOME + "/.brainbox/"
let file = path.join(dir, "classroom", "graph", path.sep)

db = require("./graph")
db.init("", {folder:dir})

// ensure that the calling user is member/owner of the group before we delete them
//
Promise.all([
  db.get({subject: "1", predicate: "owner", object: "qNifCO65q"}),
  db.get({subject: "1", predicate: "member", object: "qNifCO65q"})
])
  .then((groups) => {
    if(groups.length===0) {
      throw "user is not member of the requested group"
    }
    db.get({subject:"qNifCO65q", predicate:"hasAttachment"})
      .then((data)=>{
        console.log(data)
      })
  })
  .catch(error => {
    console.log(error)
  })
