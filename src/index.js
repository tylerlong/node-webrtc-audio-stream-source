import { nonstandard } from 'wrtc'

const { RTCAudioSource } = nonstandard

class NodeWebRtcAudioStreamSource extends RTCAudioSource {
  addStream (readable, bitsPerSample, sampleRate, channelCount) {
    let cache = Buffer.alloc(0)
    let streamEnd = false
    readable.on('data', buffer => {
      cache = Buffer.concat([cache, buffer])
    })

    readable.on('end', () => {
      streamEnd = true
    })

    const processData = () => {
      if (cache.length >= 960) {
        const buffer = cache.slice(0, 960)
        cache = cache.slice(960)
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
      if (!streamEnd || cache.length >= 960) {
        setTimeout(() => processData(), 10)
      }
    }
    processData()
  }
}

export default NodeWebRtcAudioStreamSource
