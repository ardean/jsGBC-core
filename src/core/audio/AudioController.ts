import CPU from "../CPU";
import * as util from "../../util";
import settings from "../../settings";
import AudioDevice from "./AudioDevice";
import GameBoyCore from "../GameBoyCore";
import * as MemoryLayout from "../memory/Layout";
import SquareAudioChannel from "./SquareAudioChannel";

export default class AudioController {
  cartridgeLeftChannelInputVolume: number;
  cartridgeRightChannelInputVolume: number;
  mixerOutputCache: number;
  sequencerClocks: number;
  sequencePosition: number;

  audioClocksUntilNextEvent: number;
  audioClocksUntilNextEventCounter: number;
  resamplerFirstPassFactor: number;

  leftChannel3: boolean;
  rightChannel3: boolean;
  channel3Enabled: boolean;
  channel3CanPlay: boolean;
  cachedChannel3Sample: number;
  channel3CurrentSampleLeft: number;
  channel3CurrentSampleRight: number;
  channel3CurrentSampleLeftSecondary: number;
  channel3CurrentSampleRightSecondary: number;
  channel3envelopeVolume: number;
  channel3TotalLength: number;
  channel3PatternType: number;
  channel3frequency: number;
  channel3Consecutive: boolean;
  channel3Counter: number;
  channel3FrequencyPeriod: number;
  channel3LastSampleLookup: number;
  channel3PcmData: Int8Array;

  leftChannel4: boolean;
  rightChannel4: boolean;
  channel4Enabled: boolean;
  channel4CanPlay: boolean;
  cachedChannel4Sample: number;
  channel4Counter: number;
  channel4CurrentSampleLeft: number;
  channel4CurrentSampleRight: number;
  channel4CurrentSampleLeftSecondary: number;
  channel4CurrentSampleRightSecondary: number;
  channel4FrequencyPeriod: number;
  channel4TotalLength: number;
  channel4EnvelopeVolume: number;
  channel4CurrentVolume: number;
  channel4EnvelopeType: boolean;
  channel4EnvelopeSweeps: number;
  channel4EnvelopeSweepsLast: number;
  channel4Consecutive: boolean;
  channel4BitRange: number;
  channel4VolumeShifter: number;
  channel4LastSampleLookup: number;

  downSampleInputDivider: number;
  device: AudioDevice;
  memory: util.TypedArray;
  gameboy: GameBoyCore;
  cpu: CPU;
  LSFR15Table: Int8Array;
  LSFR7Table: Int8Array;
  noiseSampleTable: Int8Array;
  bufferLength = 0; // Length of the sound buffers
  audioTicks = 0; // Used to sample the audio system every x CPU instructions
  audioIndex = 0; // Used to keep alignment on audio generation
  bufferContainAmount = 0; // Buffer maintenance metric
  bufferPosition = 0; // Used to keep alignment on audio generation
  downsampleInput = 0;
  buffer: Float32Array;
  enabled: boolean = true;

  channel1: SquareAudioChannel;
  channel2: SquareAudioChannel;

  constructor({ cpu, gameboy }: { cpu: CPU; gameboy: GameBoyCore; }) {
    this.cpu = cpu;
    this.gameboy = gameboy;

    this.channel1 = new SquareAudioChannel(this.gameboy, { sweepEnabled: true });
    this.channel2 = new SquareAudioChannel(this.gameboy);

    this.generateWhiteNoise();
    this.setInitialState();
  }

  setMemory(memory: util.TypedArray) {
    this.memory = memory;
  }

  initMemory() {
    this.channel3PcmData = new Int8Array(0x20);
  }

  init() {
    this.channel1.init();
    this.channel2.init();

    this.leftChannel3 = false;
    this.rightChannel3 = false;

    this.leftChannel4 = false;
    this.rightChannel4 = false;
    this.channel4Consecutive = false;

    this.cartridgeLeftChannelInputVolume = 8;
    this.cartridgeRightChannelInputVolume = 8;
  }

  setInitialState() {
    this.channel1.setInitialState();
    this.channel2.setInitialState();

    this.channel3TotalLength = 0;
    this.channel3PatternType = 4;
    this.channel3frequency = 0;
    this.channel3Consecutive = true;
    this.channel3Counter = 0x800;
    this.channel3FrequencyPeriod = 0x800;
    this.channel3LastSampleLookup = 0;
    this.cachedChannel3Sample = 0;
    this.channel3Enabled = false;
    this.channel3CanPlay = false;

    this.channel4FrequencyPeriod = 8;
    this.channel4TotalLength = 0;
    this.channel4EnvelopeVolume = 0;
    this.channel4CurrentVolume = 0;
    this.channel4EnvelopeType = false;
    this.channel4EnvelopeSweeps = 0;
    this.channel4EnvelopeSweepsLast = 0;
    this.channel4Consecutive = true;
    this.channel4BitRange = 0x7fff;
    this.channel4VolumeShifter = 15;
    this.channel4LastSampleLookup = 0;
    this.channel4FrequencyPeriod = 8;
    this.channel4Counter = 8;
    this.cachedChannel4Sample = 0;
    this.channel4Enabled = false;
    this.channel4CanPlay = false;

    this.cartridgeLeftChannelInputVolume = 8;
    this.cartridgeRightChannelInputVolume = 8;
    this.mixerOutputCache = 0;
    this.sequencerClocks = 0x2000;
    this.sequencePosition = 0;
    this.audioClocksUntilNextEvent = 1;
    this.audioClocksUntilNextEventCounter = 1;

    this.channel1.setFirstStageSamples();
    this.channel1.setSecondStageSamples();
    this.channel1.setThirdStageSamples();
    this.cacheMixerOutputLevel();

    this.channel2.setFirstStageSamples();
    this.channel2.setSecondStageSamples();
    this.channel2.setThirdStageSamples();
    this.cacheMixerOutputLevel();

    this.cacheChannel3OutputLevel();
    this.cacheChannel4OutputLevel();

    this.noiseSampleTable = this.LSFR15Table;
  }

  setSkippedBootRomState() {
    this.channel1.setSkippedBootRomState();
    this.channel2.setSkippedBootRomState();

    this.leftChannel3 = true;
    this.rightChannel3 = false;
    this.channel3CanPlay = false;
    this.channel3TotalLength = 0;
    this.channel3PatternType = 4;
    this.channel3frequency = 0;
    this.channel3Consecutive = true;
    this.channel3Counter = 0x800;
    this.channel3FrequencyPeriod = 0x800;
    this.channel3LastSampleLookup = 0;

    this.leftChannel4 = true;
    this.rightChannel4 = false;
    this.channel4FrequencyPeriod = 8;
    this.channel4TotalLength = 0;
    this.channel4EnvelopeVolume = 0;
    this.channel4CurrentVolume = 0;
    this.channel4EnvelopeType = false;
    this.channel4EnvelopeSweeps = 0;
    this.channel4EnvelopeSweepsLast = 0;
    this.channel4Consecutive = true;
    this.channel4BitRange = 0x7fff;
    this.channel4VolumeShifter = 15;
    this.channel4LastSampleLookup = 0;

    this.cartridgeLeftChannelInputVolume = 8;
    this.cartridgeRightChannelInputVolume = 8;
  }

  // Below are the audio generation functions timed against the CPU:
  generate(sampleCount: number) {
    if (
      this.gameboy.audioController.enabled &&
      !this.gameboy.cpu.stopped
    ) {
      for (let clockUpTo = 0; sampleCount > 0;) {
        clockUpTo = Math.min(this.audioClocksUntilNextEventCounter, this.sequencerClocks, sampleCount);
        this.audioClocksUntilNextEventCounter -= clockUpTo;
        this.sequencerClocks -= clockUpTo;
        sampleCount -= clockUpTo;
        while (clockUpTo > 0) {
          const multiplier = Math.min(clockUpTo, this.resamplerFirstPassFactor - this.audioIndex);
          clockUpTo -= multiplier;
          this.audioIndex += multiplier;
          this.downsampleInput += this.mixerOutputCache * multiplier;
          if (this.audioIndex === this.resamplerFirstPassFactor) {
            this.audioIndex = 0;
            this.outputAudio();
          }
        }
        if (this.sequencerClocks === 0) {
          this.audioComputeSequencer();
          this.sequencerClocks = 0x2000;
        }
        if (this.audioClocksUntilNextEventCounter === 0) {
          this.computeChannels();
        }
      }
    } else {
      // SILENT OUTPUT
      while (sampleCount > 0) {
        const multiplier = Math.min(sampleCount, this.resamplerFirstPassFactor - this.audioIndex);
        sampleCount -= multiplier;
        this.audioIndex += multiplier;
        if (this.audioIndex === this.resamplerFirstPassFactor) {
          this.audioIndex = 0;
          this.outputAudio();
        }
      }
    }
  }

  enable() {
    this.memory[0xff26] = 0x80;
    this.enabled = true;
    this.setInitialState();
  }

  disable() {
    this.memory[0xff26] = 0;
    this.enabled = false;

    for (let address = 0xff10; address < 0xff26; address++) {
      this.gameboy.memoryWrite(address, 0);
    }
  }

  run() {
    this.generate(this.audioTicks);
    this.audioTicks = 0;
  }

  clockAudioEnvelope() {
    this.channel1.envelope();
    this.channel2.envelope();

    // Channel 4:
    if (this.channel4EnvelopeSweepsLast > -1) {
      if (this.channel4EnvelopeSweeps > 0) {
        --this.channel4EnvelopeSweeps;
      } else {
        if (!this.channel4EnvelopeType) {
          if (this.channel4EnvelopeVolume > 0) {
            this.channel4CurrentVolume = --this.channel4EnvelopeVolume << this.channel4VolumeShifter;
            this.channel4EnvelopeSweeps = this.channel4EnvelopeSweepsLast;
            this.cacheChannel4Update();
          } else {
            this.channel4EnvelopeSweepsLast = -1;
          }
        } else if (this.channel4EnvelopeVolume < 0xf) {
          this.channel4CurrentVolume = ++this.channel4EnvelopeVolume << this.channel4VolumeShifter;
          this.channel4EnvelopeSweeps = this.channel4EnvelopeSweepsLast;
          this.cacheChannel4Update();
        } else {
          this.channel4EnvelopeSweepsLast = -1;
        }
      }
    }
  }

  performChannel1AudioSweepDummy() {
    // Channel 1:
    if (this.channel1.frequencySweepDivider > 0) {
      if (!this.channel1.decreaseSweep) {
        const channel1ShadowFrequency = this.channel1.shadowFrequency + (this.channel1.shadowFrequency >> this.channel1.frequencySweepDivider);
        if (channel1ShadowFrequency <= 0x7ff) {
          // Run overflow check twice:
          if (channel1ShadowFrequency + (channel1ShadowFrequency >> this.channel1.frequencySweepDivider) > 0x7ff) {
            this.channel1.sweepFault = true;
            this.channel1.checkEnabled();
            this.memory[0xff26] &= 0xfe; // Channel #1 On Flag Off
          }
        } else {
          this.channel1.sweepFault = true;
          this.channel1.checkEnabled();
          this.memory[0xff26] &= 0xfe; // Channel #1 On Flag Off
        }
      }
    }
  }

  audioComputeSequencer() {
    switch (this.sequencePosition++) {
      case 0:
        this.clockAudioLength();
        break;
      case 2:
        this.clockAudioLength();
        this.clockAudioSweep();
        break;
      case 4:
        this.clockAudioLength();
        break;
      case 6:
        this.clockAudioLength();
        this.clockAudioSweep();
        break;
      case 7:
        this.clockAudioEnvelope();
        this.sequencePosition = 0;
    }
  }

  clockAudioLength() {
    this.channel1.length(0xfe);
    this.channel2.length(0xfd);

    // Channel 3:
    if (this.channel3TotalLength > 1) {
      --this.channel3TotalLength;
    } else if (this.channel3TotalLength === 1) {
      this.channel3TotalLength = 0;
      this.checkChannel3Enable();
      this.memory[0xff26] &= 0xfb; // Channel #3 On Flag Off
    }

    // Channel 4:
    if (this.channel4TotalLength > 1) {
      --this.channel4TotalLength;
    } else if (this.channel4TotalLength === 1) {
      this.channel4TotalLength = 0;
      this.checkChannel4Enable();
      this.memory[0xff26] &= 0xf7; // Channel #4 On Flag Off
    }
  }

  clockAudioSweep() {
    // Channel 1:
    this.channel1.sweep();
  }

  computeChannels() {
    // Clock down the four audio channels to the next closest audio event:
    this.channel1.frequencyCounter -= this.audioClocksUntilNextEvent;
    this.channel2.frequencyCounter -= this.audioClocksUntilNextEvent;
    this.channel3Counter -= this.audioClocksUntilNextEvent;
    this.channel4Counter -= this.audioClocksUntilNextEvent;

    // Channel 1 counter:
    if (this.channel1.frequencyCounter === 0) {
      this.channel1.frequencyCounter = this.channel1.frequencyTracker;
      this.channel1.dutyTracker = this.channel1.dutyTracker + 1 & 0x7;
      this.channel1.setThirdStageSamples();
      this.cacheMixerOutputLevel();
    }

    // Channel 2 counter:
    if (this.channel2.frequencyCounter === 0) {
      this.channel2.frequencyCounter = this.channel2.frequencyTracker;
      this.channel2.dutyTracker = this.channel2.dutyTracker + 1 & 0x7;
      this.channel2.setThirdStageSamples();
      this.cacheMixerOutputLevel();
    }

    // Channel 3 counter:
    if (this.channel3Counter === 0) {
      if (this.channel3CanPlay) {
        this.channel3LastSampleLookup = this.channel3LastSampleLookup + 1 & 0x1f;
      }
      this.channel3Counter = this.channel3FrequencyPeriod;
      this.cacheChannel3Update();
    }

    // Channel 4 counter:
    if (this.channel4Counter === 0) {
      this.channel4LastSampleLookup = this.channel4LastSampleLookup + 1 & this.channel4BitRange;
      this.channel4Counter = this.channel4FrequencyPeriod;
      this.cacheChannel4Update();
    }

    // Find the number of clocks to next closest counter event:
    this.audioClocksUntilNextEventCounter = this.audioClocksUntilNextEvent = Math.min(
      this.channel1.frequencyCounter,
      this.channel2.frequencyCounter,
      this.channel3Counter,
      this.channel4Counter
    );
  }

  cacheChannel3Update() {
    this.cachedChannel3Sample = this.channel3PcmData[this.channel3LastSampleLookup] >> this.channel3PatternType;
    this.cacheChannel3OutputLevel();
  }

  checkChannel3Enable() {
    this.channel3Enabled = this.channel3Consecutive || this.channel3TotalLength > 0;
    this.channel3OutputLevelSecondaryCache();
  }

  cacheChannel3OutputLevel() {
    this.channel3CurrentSampleLeft = this.leftChannel3 ? this.cachedChannel3Sample : 0;
    this.channel3CurrentSampleRight = this.rightChannel3 ? this.cachedChannel3Sample : 0;
    this.channel3OutputLevelSecondaryCache();
  }

  channel3OutputLevelSecondaryCache() {
    if (
      this.channel3Enabled &&
      settings.enabledAudioChannels[2]
    ) {
      this.channel3CurrentSampleLeftSecondary = this.channel3CurrentSampleLeft;
      this.channel3CurrentSampleRightSecondary = this.channel3CurrentSampleRight;
    } else {
      this.channel3CurrentSampleLeftSecondary = 0;
      this.channel3CurrentSampleRightSecondary = 0;
    }
    this.cacheMixerOutputLevel();
  }

  checkChannel4Enable() {
    this.channel4Enabled = (this.channel4Consecutive || this.channel4TotalLength > 0) && this.channel4CanPlay;
    this.cacheChannel4OutputLevelSecondary();
  }

  cacheChannel4Update() {
    this.cachedChannel4Sample = this.noiseSampleTable[this.channel4CurrentVolume | this.channel4LastSampleLookup];
    this.cacheChannel4OutputLevel();
  }

  cacheChannel4OutputLevel() {
    this.channel4CurrentSampleLeft = this.leftChannel4 ? this.cachedChannel4Sample : 0;
    this.channel4CurrentSampleRight = this.rightChannel4 ? this.cachedChannel4Sample : 0;
    this.cacheChannel4OutputLevelSecondary();
  }

  checkChannel4VolumeEnable() {
    this.channel4CanPlay = this.memory[0xff21] > 7;
    this.checkChannel4Enable();
    this.cacheChannel4OutputLevelSecondary();
  }

  cacheChannel4OutputLevelSecondary() {
    if (
      this.channel4Enabled &&
      settings.enabledAudioChannels[3]
    ) {
      this.channel4CurrentSampleLeftSecondary = this.channel4CurrentSampleLeft;
      this.channel4CurrentSampleRightSecondary = this.channel4CurrentSampleRight;
    } else {
      this.channel4CurrentSampleLeftSecondary = 0;
      this.channel4CurrentSampleRightSecondary = 0;
    }
    this.cacheMixerOutputLevel();
  }

  cacheMixerOutputLevel() {
    const currentLeftSample = (
      this.channel1.currentSampleLeftTrimary +
      this.channel2.currentSampleLeftTrimary +
      this.channel3CurrentSampleLeftSecondary +
      this.channel4CurrentSampleLeftSecondary
    );
    const currentRightSample = (
      this.channel1.currentSampleRightTrimary +
      this.channel2.currentSampleRightTrimary +
      this.channel3CurrentSampleRightSecondary +
      this.channel4CurrentSampleRightSecondary
    );
    this.mixerOutputCache = (
      currentLeftSample * this.cartridgeLeftChannelInputVolume << 16 |
      currentRightSample * this.cartridgeRightChannelInputVolume
    );
  }

  connectDevice(device: AudioDevice) {
    this.resamplerFirstPassFactor = Math.max(
      Math.min(
        Math.floor(this.cpu.clocksPerSecond / 44100),
        Math.floor(0xffff / 0x1e0)
      ),
      1
    );
    this.downSampleInputDivider = 1 / (
      this.resamplerFirstPassFactor * 0xf0
    );

    const sampleRate = this.cpu.clocksPerSecond / this.resamplerFirstPassFactor;
    const maxBufferSize = Math.max(
      (
        this.cpu.baseCyclesPerIteration *
        settings.maxAudioBufferSpanAmountOverXInterpreterIterations /
        this.resamplerFirstPassFactor
      ),
      8192
    ) << 1;
    device.setSampleRate(sampleRate);
    device.setMaxBufferSize(maxBufferSize);
    device.init();

    this.device = device;

    this.audioIndex = 0;
    this.bufferPosition = 0;
    this.downsampleInput = 0;
    this.bufferContainAmount = Math.max(this.cpu.baseCyclesPerIteration * settings.minAudioBufferSpanAmountOverXInterpreterIterations / this.resamplerFirstPassFactor, 4096) << 1;
    this.bufferLength = this.cpu.baseCyclesPerIteration / this.resamplerFirstPassFactor << 1;
    this.buffer = new Float32Array(this.bufferLength);
  }

  setVolume(volume: number) {
    this.device?.setVolume(volume);
  }

  adjustUnderrun() {
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

  generateWhiteNoise() {
    // Noise Sample Tables
    this.LSFR7Table = this.generateLSFR7Table();
    this.LSFR15Table = this.generateLSFR15Table();

    // Set the default noise table
    this.noiseSampleTable = this.LSFR15Table;
  }

  generateLSFR7Table() {
    // 7-bit LSFR Cache Generation:
    const LSFR7Table = new Int8Array(0x800);
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
    const LSFR15Table = new Int8Array(0x80000);
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

  registerMemoryWriters() {
    //NR10:
    this.gameboy.highMemoryWriter[0x10] = this.gameboy.memoryWriter[0xff10] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();

        this.channel1.setSweep(data);

        this.memory[0xff10] = data;
        this.channel1.checkEnabled();
      }
    };
    //NR11:
    this.gameboy.highMemoryWriter[0x11] = this.gameboy.memoryWriter[0xff11] = (address: number, data: number) => {
      if (this.enabled || !this.gameboy.cartridge.useGbcMode) {
        if (this.enabled) {
          this.run();
        } else {
          data &= 0x3f;
        }

        this.channel1.setDuty(data);
        this.channel1.setLength(data);

        this.memory[0xff11] = data;
        this.channel1.checkEnabled();
      }
    };
    //NR12:
    this.gameboy.highMemoryWriter[0x12] = this.gameboy.memoryWriter[0xff12] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        this.channel1.setEnvelopeVolume(0xff12, data);
        this.channel1.setEnvelopeType(data);
        this.memory[0xff12] = data;
        this.channel1.checkVolumeEnabled();
      }
    };
    //NR13:
    this.gameboy.highMemoryWriter[0x13] = this.gameboy.memoryWriter[0xff13] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        this.channel1.setFrequency(data);
      }
    };
    //NR14:
    this.gameboy.highMemoryWriter[0x14] = this.gameboy.memoryWriter[0xff14] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        this.channel1.consecutive = (data & 0x40) === 0x0;
        this.channel1.setHighFrequency(data);
        if (data > 0x7f) {
          //Reload 0xFF10:
          this.channel1.timeSweep = this.channel1.lastTimeSweep;
          this.channel1.swept = false;
          //Reload 0xFF12:
          var nr12 = this.memory[0xff12];
          this.channel1.envelopeVolume = nr12 >> 4;

          this.channel1.setFirstStageSamples();
          this.channel1.setSecondStageSamples();
          this.channel1.setThirdStageSamples();
          this.cacheMixerOutputLevel();

          this.channel1.envelopeSweepsLast = (nr12 & 0x7) - 1;
          if (this.channel1.totalLength === 0) {
            this.channel1.totalLength = 0x40;
          }
          if (
            this.channel1.lastTimeSweep > 0 ||
            this.channel1.frequencySweepDivider > 0
          ) {
            this.memory[0xff26] |= 0x1;
          } else {
            this.memory[0xff26] &= 0xfe;
          }
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x1;
          }
          this.channel1.shadowFrequency = this.channel1.frequency;
          //Reset frequency overflow check + frequency sweep type check:
          this.channel1.sweepFault = false;
          //Supposed to run immediately:
          this.performChannel1AudioSweepDummy();
        }
        this.channel1.checkEnabled();
        this.memory[0xff14] = data;
      }
    };
    //NR20 (Unused I/O):
    this.gameboy.highMemoryWriter[0x15] = this.gameboy.memoryWriter[0xff15] = this.gameboy.memoryNew.writeIllegal;
    //NR21:
    this.gameboy.highMemoryWriter[0x16] = this.gameboy.memoryWriter[0xff16] = (address: number, data: number) => {
      if (this.enabled || !this.gameboy.cartridge.useGbcMode) {
        if (this.enabled) {
          this.run();
        } else {
          data &= 0x3f;
        }
        this.channel2.setDuty(data);
        this.channel2.setLength(data);
        this.memory[0xff16] = data;
        this.channel2.checkEnabled();
      }
    };
    //NR22:
    this.gameboy.highMemoryWriter[0x17] = this.gameboy.memoryWriter[0xff17] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        this.channel2.setEnvelopeVolume(0xff17, data);
        this.channel2.setEnvelopeType(data);
        this.memory[0xff17] = data;
        this.channel2.checkVolumeEnabled();
      }
    };
    //NR23:
    this.gameboy.highMemoryWriter[0x18] = this.gameboy.memoryWriter[0xff18] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        this.channel2.setFrequency(data);
      }
    };
    //NR24:
    this.gameboy.highMemoryWriter[0x19] = this.gameboy.memoryWriter[0xff19] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        if (data > 0x7f) {
          //Reload 0xFF17:
          const nr22 = this.memory[0xff17];
          this.channel2.envelopeVolume = nr22 >> 4;

          this.channel2.setFirstStageSamples();
          this.channel2.setSecondStageSamples();
          this.channel2.setThirdStageSamples();
          this.cacheMixerOutputLevel();

          this.channel2.envelopeSweepsLast = (nr22 & 0x7) - 1;
          if (this.channel2.totalLength === 0) {
            this.channel2.totalLength = 0x40;
          }
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x2;
          }
        }
        this.channel2.consecutive = (data & 0x40) === 0x0;
        this.channel2.setHighFrequency(data);
        this.memory[0xff19] = data;
        this.channel2.checkEnabled();
      }
    };
    //NR30:
    this.gameboy.highMemoryWriter[0x1a] = this.gameboy.memoryWriter[0xff1a] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        if (!this.channel3CanPlay && data >= 0x80) {
          this.channel3LastSampleLookup = 0;
          this.cacheChannel3Update();
        }
        this.channel3CanPlay = data > 0x7f;
        if (
          this.channel3CanPlay &&
          this.memory[0xff1a] > 0x7f &&
          !this.channel3Consecutive
        ) {
          this.memory[0xff26] |= 0x4;
        }
        this.memory[0xff1a] = data;
        //this.checkChannel3Enable();
      }
    };
    //NR31:
    this.gameboy.highMemoryWriter[0x1b] = this.gameboy.memoryWriter[0xff1b] = (address: number, data: number) => {
      if (this.enabled || !this.gameboy.cartridge.useGbcMode) {
        if (this.enabled) {
          this.run();
        }
        this.channel3TotalLength = 0x100 - data;
        this.checkChannel3Enable();
      }
    };
    //NR32:
    this.gameboy.highMemoryWriter[0x1c] = this.gameboy.memoryWriter[0xff1c] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        data &= 0x60;
        this.memory[0xff1c] = data;
        this.channel3PatternType = data === 0 ? 4 : (data >> 5) - 1;
      }
    };
    //NR33:
    this.gameboy.highMemoryWriter[0x1d] = this.gameboy.memoryWriter[0xff1d] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        this.channel3frequency = this.channel3frequency & 0x700 | data;
        this.channel3FrequencyPeriod = 0x800 - this.channel3frequency << 1;
      }
    };
    //NR34:
    this.gameboy.highMemoryWriter[0x1e] = this.gameboy.memoryWriter[0xff1e] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        if (data > 0x7f) {
          if (this.channel3TotalLength === 0) {
            this.channel3TotalLength = 0x100;
          }
          this.channel3LastSampleLookup = 0;
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x4;
          }
        }
        this.channel3Consecutive = (data & 0x40) === 0x0;
        this.channel3frequency = (data & 0x7) << 8 | this.channel3frequency & 0xff;
        this.channel3FrequencyPeriod = 0x800 - this.channel3frequency << 1;
        this.memory[0xff1e] = data;
        this.checkChannel3Enable();
      }
    };

    //NR40 (Unused I/O):
    this.gameboy.highMemoryWriter[0x1f] = this.gameboy.memoryWriter[0xff1f] = this.gameboy.memoryNew.writeIllegal;
    //NR41:
    this.gameboy.highMemoryWriter[0x20] = this.gameboy.memoryWriter[0xff20] = (address: number, data: number) => {
      if (this.enabled || !this.gameboy.cartridge.useGbcMode) {
        if (this.enabled) {
          this.run();
        }
        this.channel4TotalLength = 0x40 - (data & 0x3f);
        this.checkChannel4Enable();
      }
    };
    //NR42:
    this.gameboy.highMemoryWriter[0x21] = this.gameboy.memoryWriter[0xff21] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        if (this.channel4Enabled && this.channel4EnvelopeSweeps === 0) {
          //Zombie Volume PAPU Bug:
          if (((this.memory[0xff21] ^ data) & 0x8) === 0x8) {
            if ((this.memory[0xff21] & 0x8) === 0) {
              if ((this.memory[0xff21] & 0x7) === 0x7) {
                this.channel4EnvelopeVolume += 2;
              } else {
                ++this.channel4EnvelopeVolume;
              }
            }
            this.channel4EnvelopeVolume = 16 - this.channel4EnvelopeVolume & 0xf;
          } else if ((this.memory[0xff21] & 0xf) === 0x8) {
            this.channel4EnvelopeVolume = 1 + this.channel4EnvelopeVolume & 0xf;
          }
          this.channel4CurrentVolume = this.channel4EnvelopeVolume << this.channel4VolumeShifter;
        }
        this.channel4EnvelopeType = (data & 0x08) === 0x08;
        this.memory[0xff21] = data;
        this.cacheChannel4Update();
        this.checkChannel4VolumeEnable();
      }
    };
    //NR43:
    this.gameboy.highMemoryWriter[0x22] = this.gameboy.memoryWriter[0xff22] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        this.channel4FrequencyPeriod = Math.max((data & 0x7) << 4, 8) << (data >> 4);
        var bitWidth = data & 0x8;
        if (bitWidth === 0x8 && this.channel4BitRange === 0x7fff || bitWidth === 0 && this.channel4BitRange === 0x7f) {
          this.channel4LastSampleLookup = 0;
          this.channel4BitRange = bitWidth === 0x8 ? 0x7f : 0x7fff;
          this.channel4VolumeShifter = bitWidth === 0x8 ? 7 : 15;
          this.channel4CurrentVolume = this.channel4EnvelopeVolume << this.channel4VolumeShifter;
          this.noiseSampleTable = bitWidth === 0x8 ? this.LSFR7Table : this.LSFR15Table;
        }
        this.memory[0xff22] = data;
        this.cacheChannel4Update();
      }
    };
    //NR44:
    this.gameboy.highMemoryWriter[0x23] = this.gameboy.memoryWriter[0xff23] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        this.memory[0xff23] = data;
        this.channel4Consecutive = (data & 0x40) === 0x0;
        if (data > 0x7f) {
          var nr42 = this.memory[0xff21];
          this.channel4EnvelopeVolume = nr42 >> 4;
          this.channel4CurrentVolume = this.channel4EnvelopeVolume << this.channel4VolumeShifter;
          this.channel4EnvelopeSweepsLast = (nr42 & 0x7) - 1;
          if (this.channel4TotalLength === 0) {
            this.channel4TotalLength = 0x40;
          }
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x8;
          }
        }
        this.checkChannel4Enable();
      }
    };

    this.gameboy.memoryNew.setWriter(MemoryLayout.soundChannelVolumeControlAddress, this.channelVolumeControlWriter);
    this.gameboy.memoryNew.setHighWriter(MemoryLayout.soundChannelVolumeControlAddress, this.channelVolumeControlWriter);

    //NR51:
    this.gameboy.highMemoryWriter[0x25] = this.gameboy.memoryWriter[0xff25] = (address: number, data: number) => {
      if (
        this.enabled &&
        this.memory[0xff25] !== data
      ) {
        this.run();
        this.memory[0xff25] = data;
        this.channel1.rightChannelEnabled = (data & 0x01) === 0x01;
        this.channel2.rightChannelEnabled = (data & 0x02) === 0x02;
        this.rightChannel3 = (data & 0x04) === 0x04;
        this.rightChannel4 = (data & 0x08) === 0x08;
        this.channel1.leftChannelEnabled = (data & 0x10) === 0x10;
        this.channel2.leftChannelEnabled = (data & 0x20) === 0x20;
        this.leftChannel3 = (data & 0x40) === 0x40;
        this.leftChannel4 = data > 0x7f;

        this.channel1.setFirstStageSamples();
        this.channel1.setSecondStageSamples();
        this.channel1.setThirdStageSamples();
        this.cacheMixerOutputLevel();

        this.channel2.setFirstStageSamples();
        this.channel2.setSecondStageSamples();
        this.channel2.setThirdStageSamples();
        this.cacheMixerOutputLevel();

        this.cacheChannel3OutputLevel();
        this.cacheChannel4OutputLevel();
      }
    };
    //NR52:
    this.gameboy.highMemoryWriter[0x26] = this.gameboy.memoryWriter[0xff26] = (address: number, data: number) => {
      this.run();

      const action = data > 0x7f ?
        "Enable" :
        "Disable";

      if (!this.enabled && action === "Enable") {
        this.enable();
      } else if (this.enabled && action === "Disable") {
        this.disable();
      }
    };
  }

  registerWaveformMemoryWriters() {
    // WAVE PCM RAM:
    this.gameboy.highMemoryWriter[0x30] = this.gameboy.memoryWriter[0xff30] = (address: number, data: number) => {
      this.writeWaveformRam(0, data);
    };
    this.gameboy.highMemoryWriter[0x31] = this.gameboy.memoryWriter[0xff31] = (address: number, data: number) => {
      this.writeWaveformRam(0x1, data);
    };
    this.gameboy.highMemoryWriter[0x32] = this.gameboy.memoryWriter[0xff32] = (address: number, data: number) => {
      this.writeWaveformRam(0x2, data);
    };
    this.gameboy.highMemoryWriter[0x33] = this.gameboy.memoryWriter[0xff33] = (address: number, data: number) => {
      this.writeWaveformRam(0x3, data);
    };
    this.gameboy.highMemoryWriter[0x34] = this.gameboy.memoryWriter[0xff34] = (address: number, data: number) => {
      this.writeWaveformRam(0x4, data);
    };
    this.gameboy.highMemoryWriter[0x35] = this.gameboy.memoryWriter[0xff35] = (address: number, data: number) => {
      this.writeWaveformRam(0x5, data);
    };
    this.gameboy.highMemoryWriter[0x36] = this.gameboy.memoryWriter[0xff36] = (address: number, data: number) => {
      this.writeWaveformRam(0x6, data);
    };
    this.gameboy.highMemoryWriter[0x37] = this.gameboy.memoryWriter[0xff37] = (address: number, data: number) => {
      this.writeWaveformRam(0x7, data);
    };
    this.gameboy.highMemoryWriter[0x38] = this.gameboy.memoryWriter[0xff38] = (address: number, data: number) => {
      this.writeWaveformRam(0x8, data);
    };
    this.gameboy.highMemoryWriter[0x39] = this.gameboy.memoryWriter[0xff39] = (address: number, data: number) => {
      this.writeWaveformRam(0x9, data);
    };
    this.gameboy.highMemoryWriter[0x3a] = this.gameboy.memoryWriter[0xff3a] = (address: number, data: number) => {
      this.writeWaveformRam(0xa, data);
    };
    this.gameboy.highMemoryWriter[0x3b] = this.gameboy.memoryWriter[0xff3b] = (address: number, data: number) => {
      this.writeWaveformRam(0xb, data);
    };
    this.gameboy.highMemoryWriter[0x3c] = this.gameboy.memoryWriter[0xff3c] = (address: number, data: number) => {
      this.writeWaveformRam(0xc, data);
    };
    this.gameboy.highMemoryWriter[0x3d] = this.gameboy.memoryWriter[0xff3d] = (address: number, data: number) => {
      this.writeWaveformRam(0xd, data);
    };
    this.gameboy.highMemoryWriter[0x3e] = this.gameboy.memoryWriter[0xff3e] = (address: number, data: number) => {
      this.writeWaveformRam(0xe, data);
    };
    this.gameboy.highMemoryWriter[0x3f] = this.gameboy.memoryWriter[0xff3f] = (address: number, data: number) => {
      this.writeWaveformRam(0xf, data);
    };
  }

  writeWaveformRam(address: number, data: number) {
    if (this.channel3CanPlay) {
      this.run();
    }
    this.memory[0xff30 | address] = data;
    address <<= 1;
    this.channel3PcmData[address] = data >> 4;
    this.channel3PcmData[address | 1] = data & 0xf;
  }

  channelVolumeControlWriter = (address: number, data: number) => {
    if (
      !this.enabled ||
      this.memory[MemoryLayout.soundChannelVolumeControlAddress] === data
    ) return;

    this.run();
    this.memory[MemoryLayout.soundChannelVolumeControlAddress] = data;
    this.cartridgeLeftChannelInputVolume = (data >> 4 & 0x07) + 1;
    this.cartridgeRightChannelInputVolume = (data & 0x07) + 1;

    this.cacheMixerOutputLevel();
  };
}
