import wrtc from 'wrtc';
import {Readable} from 'stream';

class NodeWebRtcAudioStreamSource extends wrtc.nonstandard.RTCAudioSource {
  addStream(
    readable: Readable,
    bitsPerSample = 16,
    sampleRate = 48000,
    channelCount = 1
  ) {
    let cache = Buffer.alloc(0);
    let streamEnd = false;
    readable.on('data', buffer => {
      cache = Buffer.concat([cache, buffer]);
    });

    readable.on('end', () => {
      streamEnd = true;
    });

    const processData = () => {
      const byteLength =
        ((sampleRate * bitsPerSample) / 8 / 100) * channelCount; // node-webrtc audio by default every 10ms, it is 1/100 second
      if (cache.length >= byteLength || streamEnd) {
        const buffer = cache.slice(0, byteLength);
        cache = cache.slice(byteLength);
        const samples = new Int16Array(new Uint8Array(buffer).buffer);
        this.onData({
          bitsPerSample,
          sampleRate,
          channelCount,
          numberOfFrames: samples.length,
          type: 'data',
          samples,
        });
      }
      if (!streamEnd || cache.length >= byteLength) {
        setTimeout(() => processData(), 10); // every 10 ms, required by node-webrtc audio
      }
    };
    processData();
  }
}

export default NodeWebRtcAudioStreamSource;
