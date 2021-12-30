import CPU from "../CPU";
import * as util from "../../util";
import settings from "../../settings";
import dutyLookup from "../duty-lookup";
import AudioDevice from "./AudioDevice";
import GameBoyCore from "../GameBoyCore";

export default class AudioController {
  channel3envelopeVolume: number;
  channel1FrequencyTracker: number;
  channel1DutyTracker: number;
  channel1CachedDuty: boolean[];
  channel1totalLength: number;
  channel1envelopeVolume: number;
  channel1envelopeType: boolean;
  channel1envelopeSweeps: number;
  channel1envelopeSweepsLast: number;
  channel1consecutive: boolean;
  channel1frequency: number;
  channel1SweepFault: boolean;
  channel1ShadowFrequency: number;
  channel1timeSweep: number;
  channel1lastTimeSweep: number;
  channel1Swept: boolean;
  channel1frequencySweepDivider: number;
  channel1decreaseSweep: boolean;
  channel2FrequencyTracker: number;
  channel2DutyTracker: number;
  channel2CachedDuty: boolean[];
  channel2totalLength: number;
  channel2envelopeVolume: number;
  channel2envelopeType: boolean;
  channel2envelopeSweeps: number;
  channel2envelopeSweepsLast: number;
  channel2consecutive: boolean;
  channel2frequency: number;
  channel3totalLength: number;
  channel3patternType: number;
  channel3frequency: number;
  channel3consecutive: boolean;
  channel3Counter: number;
  channel4FrequencyPeriod: number;
  channel4totalLength: number;
  channel4envelopeVolume: number;
  channel4currentVolume: number;
  channel4envelopeType: boolean;
  channel4envelopeSweeps: number;
  channel4envelopeSweepsLast: number;
  channel4consecutive: boolean;
  channel4BitRange: number;
  channel4VolumeShifter: number;
  channel1FrequencyCounter: number;
  channel2FrequencyCounter: number;
  channel3FrequencyPeriod: number;
  channel3lastSampleLookup: number;
  channel4lastSampleLookup: number;
  VinLeftChannelMasterVolume: number;
  VinRightChannelMasterVolume: number;
  mixerOutputCache: number;
  sequencerClocks: number;
  sequencePosition: number;
  channel4Counter: number;
  cachedChannel3Sample: number;
  cachedChannel4Sample: number;
  channel1Enabled: boolean;
  channel2Enabled: boolean;
  channel3Enabled: boolean;
  channel4Enabled: boolean;
  channel1CanPlay: boolean;
  channel2CanPlay: boolean;
  channel3CanPlay: boolean;
  channel4CanPlay: boolean;
  audioClocksUntilNextEvent: number;
  audioClocksUntilNextEventCounter: number;
  resamplerFirstPassFactor: number;
  channel1currentSampleLeft: any;
  leftChannel1: boolean;
  channel1currentSampleRight: any;
  rightChannel1: boolean;
  channel1currentSampleLeftSecondary: any;
  channel1currentSampleRightSecondary: any;
  channel1currentSampleLeftTrimary: any;
  channel1currentSampleRightTrimary: any;
  channel2currentSampleLeft: any;
  leftChannel2: boolean;
  channel2currentSampleRight: any;
  rightChannel2: boolean;
  channel2currentSampleLeftSecondary: any;
  channel2currentSampleRightSecondary: any;
  channel2currentSampleLeftTrimary: any;
  channel2currentSampleRightTrimary: any;
  channel3currentSampleLeft: any;
  leftChannel3: boolean;
  channel3currentSampleRight: any;
  rightChannel3: boolean;
  channel3currentSampleLeftSecondary: any;
  channel3currentSampleRightSecondary: any;
  channel4currentSampleLeft: any;
  leftChannel4: boolean;
  channel4currentSampleRight: any;
  rightChannel4: boolean;
  channel4currentSampleLeftSecondary: any;
  channel4currentSampleRightSecondary: any;
  downSampleInputDivider: number;
  device: AudioDevice;
  channel3PCM: Int8Array;
  memory: util.TypedArray;
  gameboy: GameBoyCore;
  cpu: CPU;
  LSFR15Table = null;
  LSFR7Table = null;
  noiseSampleTable = null;
  bufferLength = 0; // Length of the sound buffers
  audioTicks = 0; // Used to sample the audio system every x CPU instructions
  audioIndex = 0; // Used to keep alignment on audio generation
  bufferContainAmount = 0; // Buffer maintenance metric
  bufferPosition = 0; // Used to keep alignment on audio generation
  downsampleInput = 0;
  buffer: Float32Array;
  enabled: boolean = true;

  constructor({ cpu, gameboy }: { cpu: CPU; gameboy: GameBoyCore; }) {
    this.cpu = cpu;
    this.gameboy = gameboy;
    this.generateWhiteNoise();
    this.initStartState();
  }

  setMemory(memory: util.TypedArray) {
    this.memory = memory;
  }

  initMemory() {
    this.channel3PCM = new Int8Array(0x20);
  }

  init() {
    this.leftChannel1 = false;
    this.leftChannel2 = false;
    this.leftChannel3 = false;
    this.leftChannel4 = false;
    this.rightChannel1 = false;
    this.rightChannel2 = false;
    this.rightChannel3 = false;
    this.rightChannel4 = false;
    this.channel2frequency = this.channel1frequency = 0;
    this.channel4consecutive = this.channel2consecutive = this.channel1consecutive = false;
    this.VinLeftChannelMasterVolume = 8;
    this.VinRightChannelMasterVolume = 8;
  }

  initStartState() {
    this.channel1FrequencyTracker = 0x2000;
    this.channel1DutyTracker = 0;
    this.channel1CachedDuty = dutyLookup[2];
    this.channel1totalLength = 0;
    this.channel1envelopeVolume = 0;
    this.channel1envelopeType = false;
    this.channel1envelopeSweeps = 0;
    this.channel1envelopeSweepsLast = 0;
    this.channel1consecutive = true;
    this.channel1frequency = 0;
    this.channel1SweepFault = false;
    this.channel1ShadowFrequency = 0;
    this.channel1timeSweep = 1;
    this.channel1lastTimeSweep = 0;
    this.channel1Swept = false;
    this.channel1frequencySweepDivider = 0;
    this.channel1decreaseSweep = false;
    this.channel2FrequencyTracker = 0x2000;
    this.channel2DutyTracker = 0;
    this.channel2CachedDuty = dutyLookup[2];
    this.channel2totalLength = 0;
    this.channel2envelopeVolume = 0;
    this.channel2envelopeType = false;
    this.channel2envelopeSweeps = 0;
    this.channel2envelopeSweepsLast = 0;
    this.channel2consecutive = true;
    this.channel2frequency = 0;
    this.channel3totalLength = 0;
    this.channel3patternType = 4;
    this.channel3frequency = 0;
    this.channel3consecutive = true;
    this.channel3Counter = 0x800;
    this.channel4FrequencyPeriod = 8;
    this.channel4totalLength = 0;
    this.channel4envelopeVolume = 0;
    this.channel4currentVolume = 0;
    this.channel4envelopeType = false;
    this.channel4envelopeSweeps = 0;
    this.channel4envelopeSweepsLast = 0;
    this.channel4consecutive = true;
    this.channel4BitRange = 0x7fff;
    this.channel4VolumeShifter = 15;
    this.channel1FrequencyCounter = 0x2000;
    this.channel2FrequencyCounter = 0x2000;
    this.channel3Counter = 0x800;
    this.channel3FrequencyPeriod = 0x800;
    this.channel3lastSampleLookup = 0;
    this.channel4lastSampleLookup = 0;
    this.VinLeftChannelMasterVolume = 8;
    this.VinRightChannelMasterVolume = 8;
    this.mixerOutputCache = 0;
    this.sequencerClocks = 0x2000;
    this.sequencePosition = 0;
    this.channel4FrequencyPeriod = 8;
    this.channel4Counter = 8;
    this.cachedChannel3Sample = 0;
    this.cachedChannel4Sample = 0;
    this.channel1Enabled = false;
    this.channel2Enabled = false;
    this.channel3Enabled = false;
    this.channel4Enabled = false;
    this.channel1CanPlay = false;
    this.channel2CanPlay = false;
    this.channel3CanPlay = false;
    this.channel4CanPlay = false;
    this.audioClocksUntilNextEvent = 1;
    this.audioClocksUntilNextEventCounter = 1;
    this.cacheChannel1OutputLevel();
    this.cacheChannel2OutputLevel();
    this.cacheChannel3OutputLevel();
    this.cacheChannel4OutputLevel();
    this.noiseSampleTable = this.LSFR15Table;
  }

  setSkippedBootRomState() {
    this.channel1FrequencyTracker = 0x2000;
    this.channel1DutyTracker = 0;
    this.channel1CachedDuty = dutyLookup[2];
    this.channel1totalLength = 0;
    this.channel1envelopeVolume = 0;
    this.channel1envelopeType = false;
    this.channel1envelopeSweeps = 0;
    this.channel1envelopeSweepsLast = 0;
    this.channel1consecutive = true;
    this.channel1frequency = 1985;
    this.channel1SweepFault = true;
    this.channel1ShadowFrequency = 1985;
    this.channel1timeSweep = 1;
    this.channel1lastTimeSweep = 0;
    this.channel1Swept = false;
    this.channel1frequencySweepDivider = 0;
    this.channel1decreaseSweep = false;
    this.channel2FrequencyTracker = 0x2000;
    this.channel2DutyTracker = 0;
    this.channel2CachedDuty = dutyLookup[2];
    this.channel2totalLength = 0;
    this.channel2envelopeVolume = 0;
    this.channel2envelopeType = false;
    this.channel2envelopeSweeps = 0;
    this.channel2envelopeSweepsLast = 0;
    this.channel2consecutive = true;
    this.channel2frequency = 0;
    this.channel3CanPlay = false;
    this.channel3totalLength = 0;
    this.channel3patternType = 4;
    this.channel3frequency = 0;
    this.channel3consecutive = true;
    this.channel3Counter = 0x418;
    this.channel4FrequencyPeriod = 8;
    this.channel4totalLength = 0;
    this.channel4envelopeVolume = 0;
    this.channel4currentVolume = 0;
    this.channel4envelopeType = false;
    this.channel4envelopeSweeps = 0;
    this.channel4envelopeSweepsLast = 0;
    this.channel4consecutive = true;
    this.channel4BitRange = 0x7fff;
    this.channel4VolumeShifter = 15;
    this.channel1FrequencyCounter = 0x200;
    this.channel2FrequencyCounter = 0x200;
    this.channel3Counter = 0x800;
    this.channel3FrequencyPeriod = 0x800;
    this.channel3lastSampleLookup = 0;
    this.channel4lastSampleLookup = 0;
    this.VinLeftChannelMasterVolume = 8;
    this.VinRightChannelMasterVolume = 8;
    this.leftChannel1 = true;
    this.leftChannel2 = true;
    this.leftChannel3 = true;
    this.leftChannel4 = true;
    this.rightChannel1 = true;
    this.rightChannel2 = true;
    this.rightChannel3 = false;
    this.rightChannel4 = false;
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
    this.initStartState();
  }

  disable() {
    this.memory[0xff26] = 0;
    this.enabled = false;

    for (let index = 0xff10; index < 0xff26; index++) {
      this.gameboy.memoryWriter[index].apply(this, [index, 0]);
    }
  }

  run() {
    this.generate(this.audioTicks);
    this.audioTicks = 0;
  }

  clockAudioEnvelope() {
    // Channel 1:
    if (this.channel1envelopeSweepsLast > -1) {
      if (this.channel1envelopeSweeps > 0) {
        --this.channel1envelopeSweeps;
      } else {
        if (!this.channel1envelopeType) {
          if (this.channel1envelopeVolume > 0) {
            --this.channel1envelopeVolume;
            this.channel1envelopeSweeps = this.channel1envelopeSweepsLast;
            this.cacheChannel1OutputLevel();
          } else {
            this.channel1envelopeSweepsLast = -1;
          }
        } else if (this.channel1envelopeVolume < 0xf) {
          ++this.channel1envelopeVolume;
          this.channel1envelopeSweeps = this.channel1envelopeSweepsLast;
          this.cacheChannel1OutputLevel();
        } else {
          this.channel1envelopeSweepsLast = -1;
        }
      }
    }
    // Channel 2:
    if (this.channel2envelopeSweepsLast > -1) {
      if (this.channel2envelopeSweeps > 0) {
        --this.channel2envelopeSweeps;
      } else {
        if (!this.channel2envelopeType) {
          if (this.channel2envelopeVolume > 0) {
            --this.channel2envelopeVolume;
            this.channel2envelopeSweeps = this.channel2envelopeSweepsLast;
            this.cacheChannel2OutputLevel();
          } else {
            this.channel2envelopeSweepsLast = -1;
          }
        } else if (this.channel2envelopeVolume < 0xf) {
          ++this.channel2envelopeVolume;
          this.channel2envelopeSweeps = this.channel2envelopeSweepsLast;
          this.cacheChannel2OutputLevel();
        } else {
          this.channel2envelopeSweepsLast = -1;
        }
      }
    }
    // Channel 4:
    if (this.channel4envelopeSweepsLast > -1) {
      if (this.channel4envelopeSweeps > 0) {
        --this.channel4envelopeSweeps;
      } else {
        if (!this.channel4envelopeType) {
          if (this.channel4envelopeVolume > 0) {
            this.channel4currentVolume = --this.channel4envelopeVolume << this.channel4VolumeShifter;
            this.channel4envelopeSweeps = this.channel4envelopeSweepsLast;
            this.cacheChannel4Update();
          } else {
            this.channel4envelopeSweepsLast = -1;
          }
        } else if (this.channel4envelopeVolume < 0xf) {
          this.channel4currentVolume = ++this.channel4envelopeVolume << this.channel4VolumeShifter;
          this.channel4envelopeSweeps = this.channel4envelopeSweepsLast;
          this.cacheChannel4Update();
        } else {
          this.channel4envelopeSweepsLast = -1;
        }
      }
    }
  }

  performChannel1AudioSweepDummy() {
    // Channel 1:
    if (this.channel1frequencySweepDivider > 0) {
      if (!this.channel1decreaseSweep) {
        const channel1ShadowFrequency = this.channel1ShadowFrequency + (this.channel1ShadowFrequency >> this.channel1frequencySweepDivider);
        if (channel1ShadowFrequency <= 0x7ff) {
          // Run overflow check twice:
          if (channel1ShadowFrequency + (channel1ShadowFrequency >> this.channel1frequencySweepDivider) > 0x7ff) {
            this.channel1SweepFault = true;
            this.checkChannel1Enable();
            this.memory[0xff26] &= 0xfe; // Channel #1 On Flag Off
          }
        } else {
          this.channel1SweepFault = true;
          this.checkChannel1Enable();
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
    // Channel 1:
    if (this.channel1totalLength > 1) {
      --this.channel1totalLength;
    } else if (this.channel1totalLength === 1) {
      this.channel1totalLength = 0;
      this.checkChannel1Enable();
      this.memory[0xff26] &= 0xfe; // Channel #1 On Flag Off
    }
    // Channel 2:
    if (this.channel2totalLength > 1) {
      --this.channel2totalLength;
    } else if (this.channel2totalLength === 1) {
      this.channel2totalLength = 0;
      this.checkChannel2Enable();
      this.memory[0xff26] &= 0xfd; // Channel #2 On Flag Off
    }
    // Channel 3:
    if (this.channel3totalLength > 1) {
      --this.channel3totalLength;
    } else if (this.channel3totalLength === 1) {
      this.channel3totalLength = 0;
      this.checkChannel3Enable();
      this.memory[0xff26] &= 0xfb; // Channel #3 On Flag Off
    }
    // Channel 4:
    if (this.channel4totalLength > 1) {
      --this.channel4totalLength;
    } else if (this.channel4totalLength === 1) {
      this.channel4totalLength = 0;
      this.checkChannel4Enable();
      this.memory[0xff26] &= 0xf7; // Channel #4 On Flag Off
    }
  }

  clockAudioSweep() {
    // Channel 1:
    if (!this.channel1SweepFault && this.channel1timeSweep > 0) {
      if (--this.channel1timeSweep === 0) {
        this.runAudioSweep();
      }
    }
  }

  runAudioSweep() {
    // Channel 1:
    if (this.channel1lastTimeSweep > 0) {
      if (this.channel1frequencySweepDivider > 0) {
        this.channel1Swept = true;
        if (this.channel1decreaseSweep) {
          this.channel1ShadowFrequency -= this.channel1ShadowFrequency >> this.channel1frequencySweepDivider;
          this.channel1frequency = this.channel1ShadowFrequency & 0x7ff;
          this.channel1FrequencyTracker = 0x800 - this.channel1frequency << 2;
        } else {
          this.channel1ShadowFrequency += this.channel1ShadowFrequency >> this.channel1frequencySweepDivider;
          this.channel1frequency = this.channel1ShadowFrequency;
          if (this.channel1ShadowFrequency <= 0x7ff) {
            this.channel1FrequencyTracker = 0x800 - this.channel1frequency << 2;
            //Run overflow check twice:
            if (this.channel1ShadowFrequency + (this.channel1ShadowFrequency >> this.channel1frequencySweepDivider) > 0x7ff) {
              this.channel1SweepFault = true;
              this.checkChannel1Enable();
              this.memory[0xff26] &= 0xfe; // Channel #1 On Flag Off
            }
          } else {
            this.channel1frequency &= 0x7ff;
            this.channel1SweepFault = true;
            this.checkChannel1Enable();
            this.memory[0xff26] &= 0xfe; // Channel #1 On Flag Off
          }
        }
        this.channel1timeSweep = this.channel1lastTimeSweep;
      } else {
        // Channel has sweep disabled and timer becomes a length counter:
        this.channel1SweepFault = true;
        this.checkChannel1Enable();
      }
    }
  }

  computeChannels() {
    // Clock down the four audio channels to the next closest audio event:
    this.channel1FrequencyCounter -= this.audioClocksUntilNextEvent;
    this.channel2FrequencyCounter -= this.audioClocksUntilNextEvent;
    this.channel3Counter -= this.audioClocksUntilNextEvent;
    this.channel4Counter -= this.audioClocksUntilNextEvent;
    // Channel 1 counter:
    if (this.channel1FrequencyCounter === 0) {
      this.channel1FrequencyCounter = this.channel1FrequencyTracker;
      this.channel1DutyTracker = this.channel1DutyTracker + 1 & 0x7;
      this.cacheChannel1OutputLevelTrimary();
    }
    // Channel 2 counter:
    if (this.channel2FrequencyCounter === 0) {
      this.channel2FrequencyCounter = this.channel2FrequencyTracker;
      this.channel2DutyTracker = this.channel2DutyTracker + 1 & 0x7;
      this.cacheChannel2OutputLevelTrimary();
    }
    // Channel 3 counter:
    if (this.channel3Counter === 0) {
      if (this.channel3CanPlay) {
        this.channel3lastSampleLookup = this.channel3lastSampleLookup + 1 & 0x1f;
      }
      this.channel3Counter = this.channel3FrequencyPeriod;
      this.cacheChannel3Update();
    }
    // Channel 4 counter:
    if (this.channel4Counter === 0) {
      this.channel4lastSampleLookup = this.channel4lastSampleLookup + 1 & this.channel4BitRange;
      this.channel4Counter = this.channel4FrequencyPeriod;
      this.cacheChannel4Update();
    }
    // Find the number of clocks to next closest counter event:
    this.audioClocksUntilNextEventCounter = this.audioClocksUntilNextEvent = Math.min(this.channel1FrequencyCounter, this.channel2FrequencyCounter, this.channel3Counter, this.channel4Counter);
  }

  checkChannel1Enable() {
    this.channel1Enabled = (this.channel1consecutive || this.channel1totalLength > 0) && !this.channel1SweepFault && this.channel1CanPlay;
    this.cacheChannel1OutputLevelSecondary();
  }

  cacheChannel1OutputLevel() {
    this.channel1currentSampleLeft = this.leftChannel1 ? this.channel1envelopeVolume : 0;
    this.channel1currentSampleRight = this.rightChannel1 ? this.channel1envelopeVolume : 0;
    this.cacheChannel1OutputLevelSecondary();
  }

  checkChannel1VolumeEnable() {
    this.channel1CanPlay = this.memory[0xff12] > 7;
    this.checkChannel1Enable();
    this.cacheChannel1OutputLevelSecondary();
  }

  cacheChannel1OutputLevelSecondary() {
    if (this.channel1Enabled) {
      this.channel1currentSampleLeftSecondary = this.channel1currentSampleLeft;
      this.channel1currentSampleRightSecondary = this.channel1currentSampleRight;
    } else {
      this.channel1currentSampleLeftSecondary = 0;
      this.channel1currentSampleRightSecondary = 0;
    }
    this.cacheChannel1OutputLevelTrimary();
  }

  cacheChannel1OutputLevelTrimary() {
    if (
      this.channel1CachedDuty[this.channel1DutyTracker] &&
      settings.enabledAudioChannels[0]
    ) {
      this.channel1currentSampleLeftTrimary = this.channel1currentSampleLeftSecondary;
      this.channel1currentSampleRightTrimary = this.channel1currentSampleRightSecondary;
    } else {
      this.channel1currentSampleLeftTrimary = 0;
      this.channel1currentSampleRightTrimary = 0;
    }
    this.cacheMixerOutputLevel();
  }

  checkChannel2Enable() {
    this.channel2Enabled = (this.channel2consecutive || this.channel2totalLength > 0) && this.channel2CanPlay;
    this.cacheChannel2OutputLevelSecondary();
  }

  cacheChannel2OutputLevel() {
    this.channel2currentSampleLeft = this.leftChannel2 ? this.channel2envelopeVolume : 0;
    this.channel2currentSampleRight = this.rightChannel2 ? this.channel2envelopeVolume : 0;
    this.cacheChannel2OutputLevelSecondary();
  }

  checkChannel2VolumeEnable() {
    this.channel2CanPlay = this.memory[0xff17] > 7;
    this.checkChannel2Enable();
    this.cacheChannel2OutputLevelSecondary();
  }

  cacheChannel2OutputLevelSecondary() {
    if (this.channel2Enabled) {
      this.channel2currentSampleLeftSecondary = this.channel2currentSampleLeft;
      this.channel2currentSampleRightSecondary = this.channel2currentSampleRight;
    } else {
      this.channel2currentSampleLeftSecondary = 0;
      this.channel2currentSampleRightSecondary = 0;
    }
    this.cacheChannel2OutputLevelTrimary();
  }

  cacheChannel2OutputLevelTrimary() {
    if (
      this.channel2CachedDuty[this.channel2DutyTracker] &&
      settings.enabledAudioChannels[1]
    ) {
      this.channel2currentSampleLeftTrimary = this.channel2currentSampleLeftSecondary;
      this.channel2currentSampleRightTrimary = this.channel2currentSampleRightSecondary;
    } else {
      this.channel2currentSampleLeftTrimary = 0;
      this.channel2currentSampleRightTrimary = 0;
    }
    this.cacheMixerOutputLevel();
  }

  cacheChannel3Update() {
    this.cachedChannel3Sample = this.channel3PCM[this.channel3lastSampleLookup] >> this.channel3patternType;
    this.cacheChannel3OutputLevel();
  }

  checkChannel3Enable() {
    this.channel3Enabled /*this.channel3canPlay && */ = this.channel3consecutive || this.channel3totalLength > 0;
    this.channel3OutputLevelSecondaryCache();
  }

  cacheChannel3OutputLevel() {
    this.channel3currentSampleLeft = this.leftChannel3 ? this.cachedChannel3Sample : 0;
    this.channel3currentSampleRight = this.rightChannel3 ? this.cachedChannel3Sample : 0;
    this.channel3OutputLevelSecondaryCache();
  }

  channel3OutputLevelSecondaryCache() {
    if (
      this.channel3Enabled &&
      settings.enabledAudioChannels[2]
    ) {
      this.channel3currentSampleLeftSecondary = this.channel3currentSampleLeft;
      this.channel3currentSampleRightSecondary = this.channel3currentSampleRight;
    } else {
      this.channel3currentSampleLeftSecondary = 0;
      this.channel3currentSampleRightSecondary = 0;
    }
    this.cacheMixerOutputLevel();
  }

  checkChannel4Enable() {
    this.channel4Enabled = (this.channel4consecutive || this.channel4totalLength > 0) && this.channel4CanPlay;
    this.cacheChannel4OutputLevelSecondary();
  }

  cacheChannel4Update() {
    this.cachedChannel4Sample = this.noiseSampleTable[this.channel4currentVolume | this.channel4lastSampleLookup];
    this.cacheChannel4OutputLevel();
  }

  cacheChannel4OutputLevel() {
    this.channel4currentSampleLeft = this.leftChannel4 ? this.cachedChannel4Sample : 0;
    this.channel4currentSampleRight = this.rightChannel4 ? this.cachedChannel4Sample : 0;
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
      this.channel4currentSampleLeftSecondary = this.channel4currentSampleLeft;
      this.channel4currentSampleRightSecondary = this.channel4currentSampleRight;
    } else {
      this.channel4currentSampleLeftSecondary = 0;
      this.channel4currentSampleRightSecondary = 0;
    }
    this.cacheMixerOutputLevel();
  }

  cacheMixerOutputLevel() {
    const currentLeftSample = this.channel1currentSampleLeftTrimary + this.channel2currentSampleLeftTrimary + this.channel3currentSampleLeftSecondary + this.channel4currentSampleLeftSecondary;
    const currentRightSample = this.channel1currentSampleRightTrimary + this.channel2currentSampleRightTrimary + this.channel3currentSampleRightSecondary + this.channel4currentSampleRightSecondary;
    this.mixerOutputCache = currentLeftSample * this.VinLeftChannelMasterVolume << 16 | currentRightSample * this.VinRightChannelMasterVolume;
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

  registerMemoryWriters() {
    //NR10:
    this.gameboy.highMemoryWriter[0x10] = this.gameboy.memoryWriter[0xff10] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        if (this.channel1decreaseSweep && (data & 0x08) === 0) {
          if (this.channel1Swept) {
            this.channel1SweepFault = true;
          }
        }
        this.channel1lastTimeSweep = (data & 0x70) >> 4;
        this.channel1frequencySweepDivider = data & 0x07;
        this.channel1decreaseSweep = (data & 0x08) === 0x08;
        this.memory[0xff10] = data;
        this.checkChannel1Enable();
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
        this.channel1CachedDuty = dutyLookup[data >> 6];
        this.channel1totalLength = 0x40 - (data & 0x3f);
        this.memory[0xff11] = data;
        this.checkChannel1Enable();
      }
    };
    //NR12:
    this.gameboy.highMemoryWriter[0x12] = this.gameboy.memoryWriter[0xff12] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        if (this.channel1Enabled && this.channel1envelopeSweeps === 0) {
          //Zombie Volume PAPU Bug:
          if (((this.memory[0xff12] ^ data) & 0x8) === 0x8) {
            if ((this.memory[0xff12] & 0x8) === 0) {
              if ((this.memory[0xff12] & 0x7) === 0x7) {
                this.channel1envelopeVolume += 2;
              } else {
                ++this.channel1envelopeVolume;
              }
            }
            this.channel1envelopeVolume = 16 - this.channel1envelopeVolume & 0xf;
          } else if ((this.memory[0xff12] & 0xf) === 0x8) {
            this.channel1envelopeVolume = 1 + this.channel1envelopeVolume & 0xf;
          }
          this.cacheChannel1OutputLevel();
        }
        this.channel1envelopeType = (data & 0x08) === 0x08;
        this.memory[0xff12] = data;
        this.checkChannel1VolumeEnable();
      }
    };
    //NR13:
    this.gameboy.highMemoryWriter[0x13] = this.gameboy.memoryWriter[0xff13] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        this.channel1frequency = this.channel1frequency & 0x700 | data;
        this.channel1FrequencyTracker = 0x800 - this.channel1frequency << 2;
      }
    };
    //NR14:
    this.gameboy.highMemoryWriter[0x14] = this.gameboy.memoryWriter[0xff14] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        this.channel1consecutive = (data & 0x40) === 0x0;
        this.channel1frequency = (data & 0x7) << 8 | this.channel1frequency & 0xff;
        this.channel1FrequencyTracker = 0x800 - this.channel1frequency << 2;
        if (data > 0x7f) {
          //Reload 0xFF10:
          this.channel1timeSweep = this.channel1lastTimeSweep;
          this.channel1Swept = false;
          //Reload 0xFF12:
          var nr12 = this.memory[0xff12];
          this.channel1envelopeVolume = nr12 >> 4;
          this.cacheChannel1OutputLevel();
          this.channel1envelopeSweepsLast = (nr12 & 0x7) - 1;
          if (this.channel1totalLength === 0) {
            this.channel1totalLength = 0x40;
          }
          if (
            this.channel1lastTimeSweep > 0 ||
            this.channel1frequencySweepDivider > 0
          ) {
            this.memory[0xff26] |= 0x1;
          } else {
            this.memory[0xff26] &= 0xfe;
          }
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x1;
          }
          this.channel1ShadowFrequency = this.channel1frequency;
          //Reset frequency overflow check + frequency sweep type check:
          this.channel1SweepFault = false;
          //Supposed to run immediately:
          this.performChannel1AudioSweepDummy();
        }
        this.checkChannel1Enable();
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
        this.channel2CachedDuty = dutyLookup[data >> 6];
        this.channel2totalLength = 0x40 - (data & 0x3f);
        this.memory[0xff16] = data;
        this.checkChannel2Enable();
      }
    };
    //NR22:
    this.gameboy.highMemoryWriter[0x17] = this.gameboy.memoryWriter[0xff17] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        if (this.channel2Enabled && this.channel2envelopeSweeps === 0) {
          //Zombie Volume PAPU Bug:
          if (((this.memory[0xff17] ^ data) & 0x8) === 0x8) {
            if ((this.memory[0xff17] & 0x8) === 0) {
              if ((this.memory[0xff17] & 0x7) === 0x7) {
                this.channel2envelopeVolume += 2;
              } else {
                ++this.channel2envelopeVolume;
              }
            }
            this.channel2envelopeVolume = 16 - this.channel2envelopeVolume & 0xf;
          } else if ((this.memory[0xff17] & 0xf) === 0x8) {
            this.channel2envelopeVolume = 1 + this.channel2envelopeVolume & 0xf;
          }
          this.cacheChannel2OutputLevel();
        }
        this.channel2envelopeType = (data & 0x08) === 0x08;
        this.memory[0xff17] = data;
        this.checkChannel2VolumeEnable();
      }
    };
    //NR23:
    this.gameboy.highMemoryWriter[0x18] = this.gameboy.memoryWriter[0xff18] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        this.channel2frequency = this.channel2frequency & 0x700 | data;
        this.channel2FrequencyTracker = 0x800 - this.channel2frequency << 2;
      }
    };
    //NR24:
    this.gameboy.highMemoryWriter[0x19] = this.gameboy.memoryWriter[0xff19] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        if (data > 0x7f) {
          //Reload 0xFF17:
          var nr22 = this.memory[0xff17];
          this.channel2envelopeVolume = nr22 >> 4;
          this.cacheChannel2OutputLevel();
          this.channel2envelopeSweepsLast = (nr22 & 0x7) - 1;
          if (this.channel2totalLength === 0) {
            this.channel2totalLength = 0x40;
          }
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x2;
          }
        }
        this.channel2consecutive = (data & 0x40) === 0x0;
        this.channel2frequency = (data & 0x7) << 8 | this.channel2frequency & 0xff;
        this.channel2FrequencyTracker = 0x800 - this.channel2frequency << 2;
        this.memory[0xff19] = data;
        this.checkChannel2Enable();
      }
    };
    //NR30:
    this.gameboy.highMemoryWriter[0x1a] = this.gameboy.memoryWriter[0xff1a] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        if (!this.channel3CanPlay && data >= 0x80) {
          this.channel3lastSampleLookup = 0;
          this.cacheChannel3Update();
        }
        this.channel3CanPlay = data > 0x7f;
        if (this.channel3CanPlay && this.memory[0xff1a] > 0x7f && !this.channel3consecutive) {
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
        this.channel3totalLength = 0x100 - data;
        this.checkChannel3Enable();
      }
    };
    //NR32:
    this.gameboy.highMemoryWriter[0x1c] = this.gameboy.memoryWriter[0xff1c] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        data &= 0x60;
        this.memory[0xff1c] = data;
        this.channel3patternType = data === 0 ? 4 : (data >> 5) - 1;
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
          if (this.channel3totalLength === 0) {
            this.channel3totalLength = 0x100;
          }
          this.channel3lastSampleLookup = 0;
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x4;
          }
        }
        this.channel3consecutive = (data & 0x40) === 0x0;
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
        this.channel4totalLength = 0x40 - (data & 0x3f);
        this.checkChannel4Enable();
      }
    };
    //NR42:
    this.gameboy.highMemoryWriter[0x21] = this.gameboy.memoryWriter[0xff21] = (address: number, data: number) => {
      if (this.enabled) {
        this.run();
        if (this.channel4Enabled && this.channel4envelopeSweeps === 0) {
          //Zombie Volume PAPU Bug:
          if (((this.memory[0xff21] ^ data) & 0x8) === 0x8) {
            if ((this.memory[0xff21] & 0x8) === 0) {
              if ((this.memory[0xff21] & 0x7) === 0x7) {
                this.channel4envelopeVolume += 2;
              } else {
                ++this.channel4envelopeVolume;
              }
            }
            this.channel4envelopeVolume = 16 - this.channel4envelopeVolume & 0xf;
          } else if ((this.memory[0xff21] & 0xf) === 0x8) {
            this.channel4envelopeVolume = 1 + this.channel4envelopeVolume & 0xf;
          }
          this.channel4currentVolume = this.channel4envelopeVolume << this.channel4VolumeShifter;
        }
        this.channel4envelopeType = (data & 0x08) === 0x08;
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
          this.channel4lastSampleLookup = 0;
          this.channel4BitRange = bitWidth === 0x8 ? 0x7f : 0x7fff;
          this.channel4VolumeShifter = bitWidth === 0x8 ? 7 : 15;
          this.channel4currentVolume = this.channel4envelopeVolume << this.channel4VolumeShifter;
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
        this.channel4consecutive = (data & 0x40) === 0x0;
        if (data > 0x7f) {
          var nr42 = this.memory[0xff21];
          this.channel4envelopeVolume = nr42 >> 4;
          this.channel4currentVolume = this.channel4envelopeVolume << this.channel4VolumeShifter;
          this.channel4envelopeSweepsLast = (nr42 & 0x7) - 1;
          if (this.channel4totalLength === 0) {
            this.channel4totalLength = 0x40;
          }
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x8;
          }
        }
        this.checkChannel4Enable();
      }
    };
    //NR50:
    this.gameboy.highMemoryWriter[0x24] = this.gameboy.memoryWriter[0xff24] = (address: number, data: number) => {
      if (this.enabled && this.memory[0xff24] != data) {
        this.run();
        this.memory[0xff24] = data;
        this.VinLeftChannelMasterVolume = (data >> 4 & 0x07) + 1;
        this.VinRightChannelMasterVolume = (data & 0x07) + 1;
        this.cacheMixerOutputLevel();
      }
    };
    //NR51:
    this.gameboy.highMemoryWriter[0x25] = this.gameboy.memoryWriter[0xff25] = (address: number, data: number) => {
      if (this.enabled && this.memory[0xff25] != data) {
        this.run();
        this.memory[0xff25] = data;
        this.rightChannel1 = (data & 0x01) === 0x01;
        this.rightChannel2 = (data & 0x02) === 0x02;
        this.rightChannel3 = (data & 0x04) === 0x04;
        this.rightChannel4 = (data & 0x08) === 0x08;
        this.leftChannel1 = (data & 0x10) === 0x10;
        this.leftChannel2 = (data & 0x20) === 0x20;
        this.leftChannel3 = (data & 0x40) === 0x40;
        this.leftChannel4 = data > 0x7f;
        this.cacheChannel1OutputLevel();
        this.cacheChannel2OutputLevel();
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
    //WAVE PCM RAM:
    this.gameboy.highMemoryWriter[0x30] = this.gameboy.memoryWriter[0xff30] = (address: number, data: number) => {
      this.writeWaveformRAM(0, data);
    };
    this.gameboy.highMemoryWriter[0x31] = this.gameboy.memoryWriter[0xff31] = (address: number, data: number) => {
      this.writeWaveformRAM(0x1, data);
    };
    this.gameboy.highMemoryWriter[0x32] = this.gameboy.memoryWriter[0xff32] = (address: number, data: number) => {
      this.writeWaveformRAM(0x2, data);
    };
    this.gameboy.highMemoryWriter[0x33] = this.gameboy.memoryWriter[0xff33] = (address: number, data: number) => {
      this.writeWaveformRAM(0x3, data);
    };
    this.gameboy.highMemoryWriter[0x34] = this.gameboy.memoryWriter[0xff34] = (address: number, data: number) => {
      this.writeWaveformRAM(0x4, data);
    };
    this.gameboy.highMemoryWriter[0x35] = this.gameboy.memoryWriter[0xff35] = (address: number, data: number) => {
      this.writeWaveformRAM(0x5, data);
    };
    this.gameboy.highMemoryWriter[0x36] = this.gameboy.memoryWriter[0xff36] = (address: number, data: number) => {
      this.writeWaveformRAM(0x6, data);
    };
    this.gameboy.highMemoryWriter[0x37] = this.gameboy.memoryWriter[0xff37] = (address: number, data: number) => {
      this.writeWaveformRAM(0x7, data);
    };
    this.gameboy.highMemoryWriter[0x38] = this.gameboy.memoryWriter[0xff38] = (address: number, data: number) => {
      this.writeWaveformRAM(0x8, data);
    };
    this.gameboy.highMemoryWriter[0x39] = this.gameboy.memoryWriter[0xff39] = (address: number, data: number) => {
      this.writeWaveformRAM(0x9, data);
    };
    this.gameboy.highMemoryWriter[0x3a] = this.gameboy.memoryWriter[0xff3a] = (address: number, data: number) => {
      this.writeWaveformRAM(0xa, data);
    };
    this.gameboy.highMemoryWriter[0x3b] = this.gameboy.memoryWriter[0xff3b] = (address: number, data: number) => {
      this.writeWaveformRAM(0xb, data);
    };
    this.gameboy.highMemoryWriter[0x3c] = this.gameboy.memoryWriter[0xff3c] = (address: number, data: number) => {
      this.writeWaveformRAM(0xc, data);
    };
    this.gameboy.highMemoryWriter[0x3d] = this.gameboy.memoryWriter[0xff3d] = (address: number, data: number) => {
      this.writeWaveformRAM(0xd, data);
    };
    this.gameboy.highMemoryWriter[0x3e] = this.gameboy.memoryWriter[0xff3e] = (address: number, data: number) => {
      this.writeWaveformRAM(0xe, data);
    };
    this.gameboy.highMemoryWriter[0x3f] = this.gameboy.memoryWriter[0xff3f] = (address: number, data: number) => {
      this.writeWaveformRAM(0xf, data);
    };
  }

  writeWaveformRAM(address: number, data: number) {
    if (this.channel3CanPlay) {
      this.run();
    }
    this.memory[0xff30 | address] = data;
    address <<= 1;
    this.channel3PCM[address] = data >> 4;
    this.channel3PCM[address | 1] = data & 0xf;
  }
}
