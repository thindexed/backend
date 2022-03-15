const DEBUGGING = false

const puppeteer = require('puppeteer')
const path = require("path")
const fs = require("fs")
const thisDir = path.normalize(__dirname)
const isPi = require('detect-rpi')
const http = require('http');


var running = false
var browser = null
var page = null;

module.exports = {

  connect: async function (socketio) {
    let html = fs.readFileSync(thisDir + "/camera.html", 'utf8');
    var httpServer = http.createServer((req, res) =>{
      res.statusCode = 200;
      res.write(html);
      return res.end();
    });
    httpServer.listen(7401);

    async function capture(){
      try {
        data =  await page.evaluate(() => { return image})
          socketio.sockets.emit("camera:capture", {data: data});
          if (running) {
            setTimeout(capture, 50)
          }
      }
      catch(e){
        // ignore silently
      }
    }

    socketio.on('connection', socket => {
      socket.on('camera:start', async () => {

        if(browser ==null) {
          if (isPi())
            browser = await puppeteer.launch(
              DEBUGGING ?
                {
                  args: ['--use-fake-ui-for-media-stream', '--no-sandbox'],
                  executablePath: 'chromium-browser',
                  headless: false,
                  devtools: true,
                  slowMo: 250
                }:
                {
                  args: ['--use-fake-ui-for-media-stream', '--no-sandbox'],
                  executablePath: 'chromium-browser'
                })
          else
            browser = await puppeteer.launch(
              DEBUGGING ?
                {
                  args: ['--use-fake-ui-for-media-stream'],
                  headless: false,
                  devtools: true,
                  slowMo: 250
                } :
                {
                  args: ['--use-fake-ui-for-media-stream']
                })

          page = await browser.newPage()
          await page.goto('http:localhost:7401')
        }
        await page.evaluate(() => { start()})
        running = true
        capture()
      })


      socket.on('camera:stop', async msg => {
        await page.evaluate(() => { stop()})
        running = false
      })
    })


    return this;
  }
}

