# node-webrtc-audio-stream-source

This library gives you a [RTCAudioSource](https://github.com/node-webrtc/node-webrtc/blob/864bc136e8376c2e47ad5b206aa8c8568256a6b3/docs/nonstandard-apis.md#rtcaudiosource) object which gets audio data from a readable stream.


## Install

```
yarn add node-webrtc-audio-stream-source wrtc
```


## How to create sample audio file for testing

### macOS

```
say -o test.wav --data-format=LEI16@48000 hello world
```


### audio file to readable stream

```js
import fs from 'fs'

const readable = fs.createReadStream('test.wav')
```


## Stream requirements

The stream must be valid PCM audio meeting the following criteria:

- Bits per sample: 16
- **Little** endian
- encoding: signed integer


## Usage

```js
import RTCAudioSource from 'node-webrtc-audio-stream-source'

const rtcAudioSource  = new RTCAudioSource()
rtcAudioSource.addStream(fs.createReadStream('test.wav', 16, 48000, 1))
```
