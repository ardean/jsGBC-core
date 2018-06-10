import Resampler from "./resampler";
// import NoiseGeneratorWorklet from "worklet-loader!./noise.worklet";
// import NoiseGeneratorNode from "./NoiseGeneratorNode";



const AudioContextClass = typeof window !== "undefined" ? (typeof AudioContext !== "undefined" ? AudioContext : (window as any).webkitAudioContext) : null;

export default class AudioDevice {
  audioContextSampleBuffer: Float32Array;
  resampleControl: Resampler;
  resampleBufferSize: any;
  resampledBuffer: Float32Array;
  resampleBufferStart: number;
  resampleBufferEnd: number;
  volume: number;
  audioBufferSize: number;
  audioNode: any;
  context: AudioContext;
  audioWorkletSupport: boolean;
  samplesPerCallback: number = 2048; // Has to be between 2048 and 4096 (If over, then samples are ignored, if under then silence is added).
  channelsAllocated: number;
  bufferSize: number;
  minBufferSize: number;
  sampleRate: number;
  maxBufferSize: number;

  constructor({ context, channels, minBufferSize, volume }: any) {
    this.context = context || new AudioContextClass();
    this.audioWorkletSupport = !!this.context.audioWorklet;
    this.channelsAllocated = Math.max(channels, 1);
    this.bufferSize = this.samplesPerCallback * this.channelsAllocated;
    this.minBufferSize = minBufferSize || this.bufferSize;
    this.setVolume(volume);
  }

  setSampleRate(sampleRate) {
    this.sampleRate = Math.abs(sampleRate);
  }

  setMaxBufferSize(maxBufferSize) {
    this.maxBufferSize = Math.floor(maxBufferSize) > this.minBufferSize + this.channelsAllocated ? maxBufferSize & -this.channelsAllocated : this.minBufferSize * this.channelsAllocated;
  }

  writeAudio(buffer) {
    let bufferCounter = 0;
    while (bufferCounter < buffer.length && this.audioBufferSize < this.maxBufferSize) {
      this.audioContextSampleBuffer[this.audioBufferSize++] = buffer[bufferCounter++];
    }
  }

  remainingBuffer() {
    return Math.floor(this.resampledSamplesLeft() * this.resampleControl.ratioWeight / this.channelsAllocated) * this.channelsAllocated + this.audioBufferSize;
  }

  async initializeAudio() {
    if (!this.audioNode) {
      // if (this.audioWorkletSupport) {
      //   this.resetAudioBuffer(this.context.sampleRate);
      //   await this.context.audioWorklet.addModule(NoiseGeneratorWorklet);

      //   let modulator = this.context.createOscillator();
      //   let modGain = this.context.createGain();
      //   let noiseGenerator = new NoiseGeneratorNode(this.context);
      //   noiseGenerator.connect(this.context.destination);

      //   modulator.connect(modGain).connect(noiseGenerator);
      //   modulator.start();
      // } else {
      this.audioNode = this.context.createScriptProcessor(this.samplesPerCallback, 0, this.channelsAllocated);

      this.audioNode.onaudioprocess = e => this.processAudio(e);
      this.audioNode.connect(this.context.destination);
      this.resetAudioBuffer(this.context.sampleRate);
      // }
    }
  }

  processAudio(e) {
    const channels = [];
    let channel = 0;

    while (channel < this.channelsAllocated) {
      channels[channel] = e.outputBuffer.getChannelData(channel);
      ++channel;
    }

    this.refillResampledBuffer();

    let index = 0;
    while (
      index < this.samplesPerCallback &&
      this.resampleBufferStart !== this.resampleBufferEnd
    ) {
      channel = 0;
      while (channel < this.channelsAllocated) {
        channels[channel][index] = this.resampledBuffer[this.resampleBufferStart++] * this.volume;

        ++channel;
      }

      if (this.resampleBufferStart === this.resampleBufferSize) {
        this.resampleBufferStart = 0;
      }

      ++index;
    }

    while (index < this.samplesPerCallback) {
      for (channel = 0; channel < this.channelsAllocated; ++channel) {
        channels[channel][index] = 0;
      }
      ++index;
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  resetAudioBuffer(sampleRate) {
    this.audioBufferSize = this.resampleBufferEnd = this.resampleBufferStart = 0;
    this.initializeResampler(sampleRate);
    this.resampledBuffer = new Float32Array(this.resampleBufferSize);
  }

  refillResampledBuffer() {
    if (this.audioBufferSize > 0) {
      const resampleLength = this.resampleControl.resampler(this.getBufferSamples());
      const resampledResult = this.resampleControl.outputBuffer;

      for (let i = 0; i < resampleLength;) {
        this.resampledBuffer[this.resampleBufferEnd++] = resampledResult[i++];

        if (this.resampleBufferEnd === this.resampleBufferSize) {
          this.resampleBufferEnd = 0;
        }

        if (this.resampleBufferStart === this.resampleBufferEnd) {
          this.resampleBufferStart += this.channelsAllocated;

          if (this.resampleBufferStart === this.resampleBufferSize) {
            this.resampleBufferStart = 0;
          }
        }
      }
      this.audioBufferSize = 0;
    }
  }

  initializeResampler(sampleRate) {
    this.audioContextSampleBuffer = new Float32Array(this.maxBufferSize);
    this.resampleBufferSize = Math.max(
      this.maxBufferSize * Math.ceil(sampleRate / this.sampleRate) + this.channelsAllocated,
      this.bufferSize
    );

    this.resampleControl = new Resampler(
      this.sampleRate,
      sampleRate,
      this.channelsAllocated,
      this.resampleBufferSize,
      true
    );
  }

  resampledSamplesLeft() {
    return (this.resampleBufferStart <= this.resampleBufferEnd ? 0 : this.resampleBufferSize) +
      this.resampleBufferEnd -
      this.resampleBufferStart;
  }

  getBufferSamples() {
    return this.audioContextSampleBuffer.subarray(0, this.audioBufferSize);
  }
}
