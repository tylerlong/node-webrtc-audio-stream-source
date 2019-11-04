# node-webrtc-audio-stream-source

[node-webrtc](https://github.com/node-webrtc/node-webrtc) started supporting programmatic audio since version [0.3.6](https://github.com/node-webrtc/node-webrtc/releases/tag/v0.3.6). But it doesn't cover how to get audio stream from microphone.

This library gives you a [RTCAudioSource](https://github.com/node-webrtc/node-webrtc/blob/864bc136e8376c2e47ad5b206aa8c8568256a6b3/docs/nonstandard-apis.md#rtcaudiosource) object which streams audio data from microphone.


## Test to speech

### macOS

```
say -o test.wav --data-format=LEI16@48000  hello world
```


## Install

```
yarn add node-webrtc-audio-stream-source wrtc
```


## Usage

```js
import { nonstandard } from 'wrtc'
import RTCAudioSource from 'node-webrtc-audio-stream-source'

const { RTCAudioSink } = nonstandard

const rtcAudioSource  = new RTCAudioSource()
const track = rtcAudioSource.createTrack()
const rtcAudioSink = new RTCAudioSink(track)

rtcAudioSink.ondata = data => {
  // Do something with the received audio samples.
}
rtcAudioSource.start()
setTimeout(() => rtcAudioSource.stop(), 10000) // stop after 10 seconds
```
u
