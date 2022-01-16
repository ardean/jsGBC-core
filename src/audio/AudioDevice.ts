import Resampler from "./Resampler";
import { WorkerUrl } from "worker-url";

const AudioContextClass = typeof window !== "undefined" ?
  (typeof AudioContext !== "undefined" ? AudioContext : (window as any).webkitAudioContext) :
  null;

export default class AudioDevice {
  inputBuffer: Float32Array;
  inputBufferSize: number;

  resampler: Resampler;

  outputBuffer: Float32Array;
  outputBufferSize: number;
  outputBufferStart: number;
  outputBufferEnd: number;

  volume: number = 1;
  context: AudioContext;
  audioWorkletSupport: boolean;
  samplesPerCallback: number = 2048; // Has to be between 2048 and 4096 (If over, then samples are ignored, if under then silence is added).
  channelsAllocated: number;
  sampleRate: number;
  bufferSize: number;
  minBufferSize: number;
  maxBufferSize: number;

  gainNode: GainNode;
  audioNode: AudioNode;

  constructor({ context, channels, minBufferSize }: any) {
    this.context = context;
    this.channelsAllocated = Math.max(channels, 1);
    this.bufferSize = this.samplesPerCallback * this.channelsAllocated;
    this.minBufferSize = minBufferSize || this.bufferSize;
  }

  setSampleRate(sampleRate: number) {
    this.sampleRate = sampleRate;
  }

  setMaxBufferSize(maxBufferSize: number) {
    this.maxBufferSize = Math.floor(maxBufferSize) > this.minBufferSize + this.channelsAllocated ? maxBufferSize & -this.channelsAllocated : this.minBufferSize * this.channelsAllocated;
  }

  writeAudio(buffer: Float32Array) {
    let bufferIndex = 0;
    while (bufferIndex < buffer.length && this.inputBufferSize < this.maxBufferSize) {
      this.inputBuffer[this.inputBufferSize++] = buffer[bufferIndex++];
    }
  }

  remainingBuffer() {
    return (
      Math.floor(
        this.resampledSamplesLeft() *
        this.resampler?.ratioWeight /
        this.channelsAllocated
      ) *
      this.channelsAllocated
    ) + this.inputBufferSize;
  }

  async init() {
    if (!this.context) this.context = new AudioContextClass();

    if (!this.audioNode) {
      this.gainNode = this.context.createGain();

      if (!this.context?.audioWorklet) {
        const workletUrl = new WorkerUrl(
          new URL("./noise.worklet.ts", import.meta.url),
          {
            name: "worklet"
          }
        );
        await this.context.audioWorklet.addModule(workletUrl);

        this.audioNode = new AudioWorkletNode(this.context, "noise-generator");
      } else {
        const scriptProcessorNode = this.audioNode = this.context.createScriptProcessor(this.samplesPerCallback, 0, this.channelsAllocated);
        scriptProcessorNode.onaudioprocess = e => this.processAudio(e);
      }

      this.audioNode.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);
      this.resetAudioBuffer(this.context.sampleRate);
    }
  }

  processAudio(e: AudioProcessingEvent) {
    const channels: Float32Array[] = [];
    let channel = 0;

    while (channel < this.channelsAllocated) {
      channels[channel] = e.outputBuffer.getChannelData(channel);
      ++channel;
    }

    this.refillResampledBuffer();

    let index = 0;
    while (
      index < this.samplesPerCallback &&
      this.outputBufferStart !== this.outputBufferEnd
    ) {
      channel = 0;
      while (channel < this.channelsAllocated) {
        channels[channel][index] = this.outputBuffer[this.outputBufferStart++];

        ++channel;
      }

      if (this.outputBufferStart === this.outputBufferSize) {
        this.outputBufferStart = 0;
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

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.gainNode.gain.setTargetAtTime(this.volume, this.context.currentTime, 0);
  }

  resetAudioBuffer(targetSampleRate: number) {
    this.inputBufferSize = this.outputBufferEnd = this.outputBufferStart = 0;
    this.initializeResampler(targetSampleRate);
    this.outputBuffer = new Float32Array(this.outputBufferSize);
  }

  refillResampledBuffer() {
    if (this.inputBufferSize > 0) {
      const resampleLength = this.resampler.resample(this.getBufferSamples());
      const resampledResult = this.resampler.outputBuffer;

      for (let i = 0; i < resampleLength;) {
        this.outputBuffer[this.outputBufferEnd++] = resampledResult[i++];

        if (this.outputBufferEnd === this.outputBufferSize) {
          this.outputBufferEnd = 0;
        }

        if (this.outputBufferStart === this.outputBufferEnd) {
          this.outputBufferStart += this.channelsAllocated;

          if (this.outputBufferStart === this.outputBufferSize) {
            this.outputBufferStart = 0;
          }
        }
      }
      this.inputBufferSize = 0;
    }
  }

  initializeResampler(targetSampleRate: number) {
    this.inputBuffer = new Float32Array(this.maxBufferSize);
    this.outputBufferSize = Math.max(
      this.maxBufferSize * Math.ceil(targetSampleRate / this.sampleRate) + this.channelsAllocated,
      this.bufferSize
    );

    this.resampler = new Resampler(
      this.sampleRate,
      targetSampleRate,
      this.channelsAllocated,
      this.outputBufferSize
    );
  }

  resampledSamplesLeft() {
    return (
      this.outputBufferStart <= this.outputBufferEnd ?
        0 :
        this.outputBufferSize
    ) + this.outputBufferEnd - this.outputBufferStart;
  }

  getBufferSamples() {
    return this.inputBuffer.subarray(0, this.inputBufferSize);
  }
}
