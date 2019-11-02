import { nonstandard } from 'wrtc'

const { RTCAudioSource } = nonstandard

class NodeWebRtcAudioStreamSource extends RTCAudioSource {
  addStream (readable, bitsPerSample, sampleRate, channelCount) {
    let streamEnd = false
    readable.on('data', buffer => {
      this.cache = Buffer.concat([this.cache, buffer])
    })

    readable.on('end', () => {
      streamEnd = true
    })

    const processData = () => {
      if (this.cache.length > 960) {
        const buffer = this.cache.slice(0, 960)
        this.cache = this.cache.slice(960)
        const samples = new Int16Array(new Uint8Array(buffer).buffer)
        this.onData({
          bitsPerSample: 16,
          sampleRate: 48000,
          channelCount: 1,
          numberOfFrames: samples.length,
          type: 'data',
          samples
        })
      }
      if (!streamEnd || this.cache.length > 0) {
        setTimeout(() => processData(), 10)
      }
    }
    processData()
  }
}

export default NodeWebRtcAudioStreamSource
