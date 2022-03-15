const shortid = require('../../util/shortid')

const classroom = require('../../classroom')


function mapUser(user) {
  if (Array.isArray(user)) {
    return user.map(data => mapUser(data))
  }
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName
  }
}

// dont't expose sensitive data per accident. Add a
// mapping layer in between before expose the object
function mapGroup(group) {
  if (Array.isArray(group)) {
    return group.map(data => mapGroup(data))
  }
  return {
    id: group.id,
    role: group.role,
    joinToken: group.joinToken,
    owner: group.owner,
    members: group.members,
    assignments: group.assignments,
    name: group.name
  }
}

exports.init = (app, args)=>{

}

exports.list = (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(403).send("user not logged in")
  } else {
    Promise.all([
      classroom.graph.get({subject: "" + req.user.id, predicate: "owner"})
        .then((groupSPOs) => {
          return Promise.all(groupSPOs.map(spo => classroom.groups.get(spo.object, {role: "owner"})))
        }),
      classroom.graph.get({subject: "" + req.user.id, predicate: "member"})
        .then((groupSPOs) => {
          return Promise.all(groupSPOs.map(spo => classroom.groups.get(spo.object, {role: "member"})))
        })
    ])
      .then((groups) => {
        res.status(200).send(mapGroup(groups.flat()))
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }
}

exports.get = (req, res) => {
  Promise.all([
    // get all users of the group
    classroom.graph.get({predicate: "member", object: "" + req.params.id})
      .then((groupSPOs) => {
        return Promise.all(groupSPOs.map(spo => classroom.users.get(spo.subject)))
      }),
    // get the owner of the group
    classroom.graph.get({predicate: "owner", object: "" + req.params.id})
      .then((groupSPOs) => {
        return Promise.all(groupSPOs.map(spo => classroom.users.get(spo.subject)))
      }),
    // the group itself either as as owner
    classroom.graph.get({subject: "" + req.user.id,  predicate: "owner", object: req.params.id})
      .then((groupSPOs) => {
        return Promise.all(groupSPOs.map(spo => classroom.groups.get(spo.object, {role: "owner"})))
      }),
    // or as member.
    classroom.graph.get({subject: "" + req.user.id,  predicate: "member", object: req.params.id})
      .then((groupSPOs) => {
        return Promise.all(groupSPOs.map(spo => classroom.groups.get(spo.object, {role: "member"})))
      }),
    // get all assignments
    classroom.graph.get({subject: "" + req.params.id, predicate: "hasAssignment"})
      .then((assignmentSPOs) => {
        return Promise.all(assignmentSPOs.map(spo => classroom.assignments.get(spo.object)))
      })
  ])
    .then((data) => {
      // either you are "owner" (data[2]) or "member" (data[3])
      // we merge the and use the first element....anyhow - the array contains only ONE element.
      //
      let group = {
        members: mapUser(data[0]),
        owner: mapUser(data[1][0]),
        assignments: data[4],
        ...data[2].concat(data[3])[0]

      }
      res.status(200).send(mapGroup(group))
    })
    .catch((error) => {
      res.status(500).send(error)
    })
}

exports.del = (req, res) => {
  // ensure that the calling user is the owner of the group before we delete them
  //
  classroom.graph.get({subject: req.user.id, predicate: "owner", object: req.params.id})
    .then((rv) => {
      if(rv.length===0){
        return Promise.reject("not owner of group")
      }
      rv.forEach(r => {
        // get ALL relations to the named group
        classroom.graph.get({object: r.object})
          .then((data) => {
            // delete all relations of the group
            return classroom.graph.del(data)
          })
          .then((data) => {
            // delete the group metadata itself from the DB
            return classroom.groups.del(req.params.id)
          })
      })
      res.status(200).send("done")
    })
    .catch((error) => {
      res.status(403).send(error)
    })
}

exports.put = (req, res) => {
  let data = req.body
  // it is not allowed to change the id
  delete data.id

  classroom.groups.update(req.params.id, data)
    .then((dataUpdated) => {
      res.status(200).send(mapGroup(dataUpdated))
    })
    .catch((error) => {
      res.status(500).send(error)
    })
}


exports.join = (req, res) => {
  let data = req.body
  if (!data.joinToken) {
    res.status(400).send("joinToken")
    return
  }

  classroom.groups.findByJoinToken(data.joinToken)
    .then((group) => {
      classroom.graph.get({subject: req.user.id, predicate: "owner", object: group.id})
        .then((rv) => {
          if(rv.length>0){
            return Promise.reject("conflict. user is owner of group. join not possible")
          }
          classroom.graph.put([{subject: req.user.id, predicate: "member", object: group.id}])
          res.status(200).send(mapGroup(group))
        })
    })
    .catch((error) => {
      res.status(403).send(error)
    })
}


exports.unjoin = (req, res) => {
  classroom.graph.del({subject: req.user.id, predicate: "member", object: req.params.id})
    .then(() => {
      res.status(200).send("done")
    })
    .catch((error) => {
      res.status(403).send(error)
    })
}

exports.post = (req, res) => {
  let data = req.body

  if (!data.name) {
    res.status(400).send("data");
    return
  }

  data.id = shortid.generate()
  data.joinToken = shortid.generate()

  classroom.groups.create(data)
    .then(() => {
      // generate the triple in the graph DB to indicate, that I'm the owner
      return classroom.graph.put({subject: req.user.id, predicate: "owner", object: data.id})
    })
    .then(() => {
      req.params.id = data.id
      exports.get(req, res)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
}
