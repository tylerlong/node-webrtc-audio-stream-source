import { nonstandard } from 'wrtc'
import fs from 'fs'
import assert from 'assert'

import NodeWebRtcAudioStreamSource from '../src'

const rtcAudioStreamSource = new NodeWebRtcAudioStreamSource(fs.createReadStream('test.tiff'))

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

// const readStream = fs.createReadStream('test.tiff')
// rtcAudioStreamSource.addStream(readStream, 16, 48000, 1)

setTimeout(() => {
  // readStream.close()
  track.stop()
  sink.stop()
  writeStream.close()

  const testBuffer = fs.readFileSync('test.tiff')
  const tempBuffer = fs.readFileSync('temp.tiff')
  assert.ok(testBuffer.slice(0, tempBuffer.length).equals(tempBuffer))
}, 2000)
