

let trimLeft = module.exports.trimLeft= function(text, charlist) {
  if (charlist === undefined)
    charlist = "\s"

  return text.replace(new RegExp("^[" + charlist + "]+"), "")
}

let trimRight = module.exports.trimRight = function(text, charlist) {
  if (charlist === undefined)
    charlist = "\s"

  return text.replace(new RegExp("[" + charlist + "]+$"), "")
}


module.exports.trim = function(text, charlist){
  return trimRight(trimLeft(text, charlist), charlist)
}


