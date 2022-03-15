const fs = require('fs-extra')
const path = require('path')

const shortid = require('../../util/shortid')
const classroom = require('../../classroom')

let sheetsSharedDir=null
let brainsSharedDir=null

exports.init = (app, args, sheetsDir, brainsDir)=>{
  sheetsSharedDir = sheetsDir
  brainsSharedDir = brainsDir
}

exports.del = (req, res) => {

  // ensure that we are the owner of the group before we attach a document to it
  //
  classroom.graph.get({subject: req.user.id, predicate: "owner", object: req.params.groupId})
    .then((rv) => {
      if (rv.length === 0) {
        return Promise.reject("not owner of group")
      }

      // read the assignment to the get some meta data about files to delete
      //
      classroom.assignments.get(req.params.id).then( assignment =>{
        classroom.assignments.del(req.params.id)
          .then(() => {
            return classroom.graph.del({subject: req.params.groupId, predicate: "hasAssignment", object: req.params.id})
          })
          .then(() => {
            let file = path.join(sheetsSharedDir, assignment.shared)
            fs.unlink(file)
          })
          .then(() => {
            res.status(200).send("done")
          })
          .catch((error) => {
            res.status(500).send(error)
          })
      })
    })
}


exports.post = (req, res) => {
  let data = req.body

  data.group = req.params.groupId

  if (!data.name) {
    res.status(400).send("name");
    return
  }

  if (!data.shared) {
    res.status(400).send("shared");
    return
  }

  if (!data.type) {
    res.status(400).send("type");
    return
  }

  data.id = shortid.generate()
  data.name = path.basename(data.name)

  // ensure that we are the owner of the group before we attach a document to it
  //
  classroom.graph.get({subject: req.user.id, predicate: "owner", object: data.group})
    .then((rv) => {
      if (rv.length === 0) {
        return Promise.reject("not owner of group")
      }

      // read the content of the document and create a copy of them
      //
      classroom.assignments.create({id: data.id, type: data.type, shared: data.shared, name: data.name})
        .then(() => {
          // generate the triple in the graph DB to indicate, that the user has assigned a document to the group
          //
          return classroom.graph.put({subject: data.group, predicate: "hasAssignment", object: data.id})
        })
        .then(() => {
          res.status(200).send("done")
        })
        .catch((error) => {
          res.status(500).send(error)
        })
    })
}
