const path = require('path')

let levelup = require('levelup')
let leveldown = require('leveldown')
let levelgraph = require('levelgraph')

let dir = process.env.HOME + "/.brainbox/"
let file = path.join(dir, "classroom", "graph", path.sep)

db = levelgraph(levelup(leveldown(file)))

/*
new Promise ((resolve, reject) => {
  db.put({
    subject: "qNifCO65q",
    predicate: "hasAttachment",
    object: "myAttachment"
  }, function(error, rv){
    if(error) reject(error)
    else resolve(new String(rv).toString())
  })
}).then( (data)=>{
  console.log(data)
})
*/

new Promise ((resolve, reject) => {
  db.search([{
    predicate: "hasAttachment"
  }], function(error, rv){
    if(error) reject(error)
    else resolve(new String(rv).toString())
  })
}).then( (data)=>{
  console.log(data)
})
