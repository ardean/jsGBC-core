import * as util from "../util.js";
import settings from "../../settings.js";

export default class AudioController {
  LSFR15Table = null;
  LSFR7Table = null;
  noiseSampleTable = null;
  bufferLength = 0; // Length of the sound buffers
  audioTicks = 0; // Used to sample the audio system every x CPU instructions
  audioIndex = 0; // Used to keep alignment on audio generation
  bufferContainAmount = 0; // Buffer maintenance metric
  bufferPosition = 0; // Used to keep alignment on audio generation
  downsampleInput = 0;

  constructor({ cpu }) {
    this.cpu = cpu;
    this.generateWhiteNoise();
  }

  connectDevice(device) {
    this.resamplerFirstPassFactor = Math.max(Math.min(Math.floor(this.cpu.clocksPerSecond / 44100), Math.floor(0xffff / 0x1e0)), 1);
    this.downSampleInputDivider = 1 / (this.resamplerFirstPassFactor * 0xf0);

    const sampleRate = this.cpu.clocksPerSecond / this.resamplerFirstPassFactor;
    const maxBufferSize = Math.max(this.cpu.baseCyclesPerIteration * settings.maxAudioBufferSpanAmountOverXInterpreterIterations / this.resamplerFirstPassFactor, 8192) << 1;
    device.setSampleRate(sampleRate);
    device.setMaxBufferSize(maxBufferSize);
    device.initializeAudio();

    this.device = device;
  }

  setVolume(volume) {
    this.device && this.device.setVolume(volume);
  }

  adjustUnderrun() {
    if (!settings.soundOn) return;
    let underrunAmount = this.device.remainingBuffer();
    if (typeof underrunAmount === "number") {
      underrunAmount = this.bufferContainAmount - Math.max(underrunAmount, 0);
      if (underrunAmount > 0) {
        this.recalculateIterationClockLimitForAudio((underrunAmount >> 1) * this.resamplerFirstPassFactor);
      }
    }
  }

  recalculateIterationClockLimitForAudio(audioClocking) {
    this.cpu.cyclesTotal += Math.min(audioClocking >> 2 << 2, this.cpu.cyclesTotalBase << 1);
  }

  outputAudio() {
    this.fillBuffer();
    if (this.bufferPosition === this.bufferLength) {
      this.device.writeAudio(this.buffer);
      this.bufferPosition = 0;
    }
    this.downsampleInput = 0;
  }

  fillBuffer() {
    this.buffer[this.bufferPosition++] = (this.downsampleInput >>> 16) * this.downSampleInputDivider - 1;
    this.buffer[this.bufferPosition++] = (this.downsampleInput & 0xffff) * this.downSampleInputDivider - 1;
  }

  initBuffer() {
    this.audioIndex = 0;
    this.bufferPosition = 0;
    this.downsampleInput = 0;
    this.bufferContainAmount = Math.max(this.cpu.baseCyclesPerIteration * settings.minAudioBufferSpanAmountOverXInterpreterIterations / this.resamplerFirstPassFactor, 4096) << 1;
    this.bufferLength = this.cpu.baseCyclesPerIteration / this.resamplerFirstPassFactor << 1;
    this.buffer = util.getTypedArray(this.bufferLength, 0, "float32");
  }

  generateWhiteNoise() {
    // Noise Sample Tables
    this.LSFR7Table = this.generateLSFR7Table();
    this.LSFR15Table = this.generateLSFR15Table();

    // Set the default noise table
    this.noiseSampleTable = this.LSFR15Table;
  }

  generateLSFR7Table() {
    // 7-bit LSFR Cache Generation:
    const LSFR7Table = util.getTypedArray(0x800, 0, "int8");
    let LSFR = 0x7f; // Seed value has all its bits set.
    for (let index = 0; index < 0x80; ++index) {
      // Normalize the last LSFR value for usage:
      const randomFactor = 1 - (LSFR & 1); // Docs say it's the inverse.
      // Cache the different volume level results:
      LSFR7Table[0x080 | index] = randomFactor;
      LSFR7Table[0x100 | index] = randomFactor * 0x2;
      LSFR7Table[0x180 | index] = randomFactor * 0x3;
      LSFR7Table[0x200 | index] = randomFactor * 0x4;
      LSFR7Table[0x280 | index] = randomFactor * 0x5;
      LSFR7Table[0x300 | index] = randomFactor * 0x6;
      LSFR7Table[0x380 | index] = randomFactor * 0x7;
      LSFR7Table[0x400 | index] = randomFactor * 0x8;
      LSFR7Table[0x480 | index] = randomFactor * 0x9;
      LSFR7Table[0x500 | index] = randomFactor * 0xa;
      LSFR7Table[0x580 | index] = randomFactor * 0xb;
      LSFR7Table[0x600 | index] = randomFactor * 0xc;
      LSFR7Table[0x680 | index] = randomFactor * 0xd;
      LSFR7Table[0x700 | index] = randomFactor * 0xe;
      LSFR7Table[0x780 | index] = randomFactor * 0xf;
      // Recompute the LSFR algorithm:
      const LSFRShifted = LSFR >> 1;
      LSFR = LSFRShifted | ((LSFRShifted ^ LSFR) & 0x1) << 6;
    }

    return LSFR7Table;
  }

  generateLSFR15Table() {
    // 15-bit LSFR Cache Generation:
    const LSFR15Table = util.getTypedArray(0x80000, 0, "int8");
    let LSFR = 0x7fff; // Seed value has all its bits set.
    for (let index = 0; index < 0x8000; ++index) {
      // Normalize the last LSFR value for usage:
      const randomFactor = 1 - (LSFR & 1); // Docs say it's the inverse.
      // Cache the different volume level results:
      LSFR15Table[0x08000 | index] = randomFactor;
      LSFR15Table[0x10000 | index] = randomFactor * 0x2;
      LSFR15Table[0x18000 | index] = randomFactor * 0x3;
      LSFR15Table[0x20000 | index] = randomFactor * 0x4;
      LSFR15Table[0x28000 | index] = randomFactor * 0x5;
      LSFR15Table[0x30000 | index] = randomFactor * 0x6;
      LSFR15Table[0x38000 | index] = randomFactor * 0x7;
      LSFR15Table[0x40000 | index] = randomFactor * 0x8;
      LSFR15Table[0x48000 | index] = randomFactor * 0x9;
      LSFR15Table[0x50000 | index] = randomFactor * 0xa;
      LSFR15Table[0x58000 | index] = randomFactor * 0xb;
      LSFR15Table[0x60000 | index] = randomFactor * 0xc;
      LSFR15Table[0x68000 | index] = randomFactor * 0xd;
      LSFR15Table[0x70000 | index] = randomFactor * 0xe;
      LSFR15Table[0x78000 | index] = randomFactor * 0xf;
      // Recompute the LSFR algorithm:
      const LSFRShifted = LSFR >> 1;
      LSFR = LSFRShifted | ((LSFRShifted ^ LSFR) & 0x1) << 14;
    }

    return LSFR15Table;
  }
}
