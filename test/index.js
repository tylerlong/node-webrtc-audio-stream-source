import { nonstandard } from 'wrtc'
import fs from 'fs'

import NodeWebRtcAudioStreamSource from '../src'

const rtcAudioStreamSource = new NodeWebRtcAudioStreamSource()

const track = rtcAudioStreamSource.createTrack()
const sink = new nonstandard.RTCAudioSink(track)

const audioFilePath = 'temp.tiff'
if (fs.existsSync(audioFilePath)) {
  fs.unlinkSync(audioFilePath)
}
const writeStream = fs.createWriteStream(audioFilePath, { flags: 'a' })
sink.ondata = data => {
  writeStream.write(Buffer.from(data.samples.buffer))
}

const readStream = fs.createReadStream('test.tiff')
rtcAudioStreamSource.addStream(readStream)

setTimeout(() => {
  readStream.close()
  track.stop()
  sink.stop()
  console.log('done')
}, 1000)
