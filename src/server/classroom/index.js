
exports.init = function(app, args){
  let db = require("./db")
  db.init(app, args)

  let graph = require("./graph")
  graph.init(app, args)
}


exports.groups = require('./groups')
exports.assignments = require('./assignments')

exports.graph = require('./graph')
