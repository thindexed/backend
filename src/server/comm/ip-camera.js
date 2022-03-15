const MJPEGDecoder = require('mjpeg-decoder')

// active started encoders connect with with an IP-Camera
let decoders = []

module.exports = {

  connect: async (socketio) => {

    socketio.on('connection', client => {
      let clientId = client.id

      console.log("Client connected", clientId)

      client.on('disconnect', async () => {
        console.log('Client disconnect!', clientId)

        decoders = decoders.filter( decoderEntry => {
          if (decoderEntry.clientId===clientId){
            decoderEntry.decoder.stop()
            //console.log("stop decoder due of disconnect fromclient")
            return false
          }
          return true
        });
      })

      client.on('camera:start', async (data) => {

        if(!data.ipAddress){
          return // silently ignore
        }

        let decoderEntry = decoders.find( decoderEntry => (decoderEntry.ipAddress===data.ipAddress && decoderEntry.clientId===clientId))

        if(decoderEntry){
          // console.log("decoder found")
          // already started....just return silently
          return
        }

        // 'http://192.168.178.63:8080/?action=stream'
        console.log("No Decoder found. Create new one", clientId)
        decoderEntry = {
          ipAddress: data.ipAddress,
          clientId: clientId,
          decoder: new MJPEGDecoder(data.ipAddress, {interval: 100})
        }

        decoders.push(decoderEntry)
        decoderEntry.decoder.on('frame', (image, seq) => {
          try {
            image = "data:image/jpeg;base64,"+ Buffer.from(image).toString('base64')
            client.emit("camera:capture", {data: image, ipAddress: decoderEntry.ipAddress})
          }
          catch (exc){
            console.log(exc)
          }
        });

        decoderEntry.decoder.start();
      })


      client.on('camera:stop', async msg => {
        if(!msg.ipAddress){
          // console.log("no ip address")
          return // silently ignore
        }

        decoders = decoders.filter( decoderEntry => {
          if (decoderEntry.ipAddress===msg.ipAddress && decoderEntry.clientId===clientId){
            decoderEntry.decoder.stop()
            // console.log("stop decoder", clientId)
            return false
          }
          return true
        });
      })
    })

    return this;
  }
}

