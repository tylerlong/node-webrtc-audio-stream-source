import { nonstandard } from 'wrtc'
import fs from 'fs'
import assert from 'assert'

import NodeWebRtcAudioStreamSource from '../src'

const rtcAudioStreamSource = new NodeWebRtcAudioStreamSource()

const track = rtcAudioStreamSource.createTrack()
const sink = new nonstandard.RTCAudioSink(track)

const audioFilePath = 'temp.wav'
if (fs.existsSync(audioFilePath)) {
  fs.unlinkSync(audioFilePath)
}
const writeStream = fs.createWriteStream(audioFilePath, { flags: 'a' })
sink.ondata = data => {
  writeStream.write(Buffer.from(data.samples.buffer))
}

const readStream = fs.createReadStream('test.wav')
rtcAudioStreamSource.addStream(readStream, 16, 48000, 1)

setTimeout(() => {
  readStream.close()
  track.stop()
  sink.stop()
  writeStream.close()

  const testBuffer = fs.readFileSync('test.wav')
  const tempBuffer = fs.readFileSync('temp.wav')
  assert.ok(testBuffer.slice(0, tempBuffer.length).equals(tempBuffer))
}, 2000)
