const axios = require('axios')
const fs = require('fs-extra')
const extract = require('extract-zip')
const path = require('path')

const { Octokit } = require("@octokit/rest")

let octo = null

const GITHUB_ORG = process.env.GITHUB_ORG || 'thindexed'
const GITHUB_REPO = process.env.GITHUB_REPO || 'shapes'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || null

if(GITHUB_TOKEN === null) {
  console.log('Upload of Shapes to the Repo is not possible due of missing GITHUB_TOKEN environment variable.')
}
else {
  octo = new Octokit({
    auth: GITHUB_TOKEN,
  })
}
module.exports = {

  getLatestShapeRelease: function (res) {
    let url = `https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/releases/latest`
    let params =  { params:{}, headers: { } }
    if(GITHUB_TOKEN !== null){
      params.headers = {'Authorization': GITHUB_TOKEN}
    }
    axios.get(url,params)
      .then( (response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(response.data)
      })
      .catch( (error) => {
        console.log(error)
        res.status(error.response.status).send('Something broke!')
      })
  },

  upgradeTo: async function(shapeAppDir, packageUrl, res){
    let params =  { params:{}, headers: { } }
    if(GITHUB_TOKEN !== null){
      params.headers = {'Authorization': GITHUB_TOKEN}
    }
    const io = require('./comm/websocket').io

    const file = 'test.zip'
    const writer = fs.createWriteStream(file)
    const response = await axios({
      url: packageUrl,
      method: 'GET',
      responseType: 'stream'
    },params)
    response.data.pipe(writer)
    writer.on('finish', async () => {
      fs.removeSync(shapeAppDir)
      fs.mkdirSync(shapeAppDir)
      await extract(source, { dir: shapeAppDir })
      // fs.createReadStream(file).pipe(unzip.Extract({path: shapeAppDir}))
      io.sockets.emit("shape:updated", {})
    })
    writer.on('error', () => {
      console.log("Error during shape file updates")
    })
  },

  
  commitShape: function(localPath, githubPath, commitMessage){
    if(GITHUB_TOKEN === null) {
      console.log('Upload of Shapes to the Repo is not possible due of missing GITHUB_TOKEN environment variable.')
      return
    }

    commitMessage = commitMessage || "-empty-"

    let formattedText =  Buffer.from(fs.readFileSync(localPath, 'utf8'), 'utf8').toString('base64')
    let repoData ={
      owner:GITHUB_ORG,
      repo:GITHUB_REPO,
      path: path.join('shapes',githubPath)
    }


    octo.repos.getContents(repoData)
      .then( (res) => {
        octo.repos.createOrUpdateFile(Object.assign(repoData, {
          sha: res.data.sha,
          message: commitMessage,
          content: formattedText
        }))
      })
      .catch( (error) => {
        console.log(error)
        octo.repos.createOrUpdateFile(Object.assign(repoData, {
          message: commitMessage,
          content: formattedText
        }))
      })
  }
}
