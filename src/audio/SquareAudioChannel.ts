import GameBoy from "../GameBoy";
import settings from "../settings";
import dutyLookup from "../dutyLookup";
import AudioChannel from "./AudioChannel";

export default class SquareAudioChannel extends AudioChannel {
  currentSampleLeft: number;
  currentSampleRight: number;
  currentSampleLeftSecondary: number;
  currentSampleRightSecondary: number;
  currentSampleLeftTrimary: number;
  currentSampleRightTrimary: number;
  frequencyCounter: number;
  frequencyTracker: number;
  dutyTracker: number;
  cachedDuty: boolean[];
  totalLength: number;
  envelopeVolume: number;
  envelopeType: boolean;
  consecutive: boolean;
  frequency: number;
  shadowFrequency: number;
  envelopeSweeps: number;
  envelopeSweepsLast: number;

  sweepEnabled: boolean = false;
  sweepFault: boolean;
  timeSweep: number;
  lastTimeSweep: number;
  swept: boolean;
  decreaseSweep: boolean;
  frequencySweepDivider: number;

  constructor(
    protected gameboy: GameBoy,
    options: { sweepEnabled?: boolean; } = {}
  ) {
    super(gameboy);
    this.sweepEnabled = !!options.sweepEnabled;
  }

  init() {
    this.leftChannelEnabled = false;
    this.rightChannelEnabled = false;
    this.frequency = 0;
    this.consecutive = false;
  }

  setInitialState() {
    this.enabled = false;
    this.canPlay = false;
    this.frequencyCounter = 0x2000;
    this.frequencyTracker = 0x2000;
    this.dutyTracker = 0;
    this.cachedDuty = dutyLookup[2];
    this.totalLength = 0;
    this.envelopeVolume = 0;
    this.envelopeType = false;
    this.consecutive = true;
    this.frequency = 0;
    this.shadowFrequency = 0;
    this.envelopeSweeps = 0;
    this.envelopeSweepsLast = 0;

    if (this.sweepEnabled) {
      this.sweepFault = false;
      this.timeSweep = 1;
      this.lastTimeSweep = 0;
      this.swept = false;
      this.frequencySweepDivider = 0;
      this.decreaseSweep = false;
    }
  }

  setSkippedBootRomState() {
    this.leftChannelEnabled = true;
    this.rightChannelEnabled = true;
    this.frequencyCounter = 0x200;
    this.frequencyTracker = 0x2000;
    this.dutyTracker = 0;
    this.cachedDuty = dutyLookup[2];
    this.totalLength = 0;
    this.envelopeVolume = 0;
    this.envelopeType = false;
    this.consecutive = true;
    this.frequency = 1985;
    this.shadowFrequency = 1985;
    this.envelopeSweeps = 0;
    this.envelopeSweepsLast = 0;

    if (this.sweepEnabled) {
      this.swept = false;
      this.sweepFault = true;
      this.decreaseSweep = false;
      this.frequencySweepDivider = 0;
      this.timeSweep = 1;
      this.lastTimeSweep = 0;
    }
  }

  envelope() {
    if (this.envelopeSweepsLast > -1) {
      if (this.envelopeSweeps > 0) {
        --this.envelopeSweeps;
      } else {
        if (!this.envelopeType) {
          if (this.envelopeVolume > 0) {
            --this.envelopeVolume;
            this.envelopeSweeps = this.envelopeSweepsLast;
            this.setFirstStageSamples();
            this.setSecondStageSamples();
            this.setThirdStageSamples();
            this.gameboy.audioController.cacheMixerOutputLevel();
          } else {
            this.envelopeSweepsLast = -1;
          }
        } else if (this.envelopeVolume < 0xf) {
          ++this.envelopeVolume;
          this.envelopeSweeps = this.envelopeSweepsLast;
          this.setFirstStageSamples();
          this.setSecondStageSamples();
          this.setThirdStageSamples();
          this.gameboy.audioController.cacheMixerOutputLevel();
        } else {
          this.envelopeSweepsLast = -1;
        }
      }
    }
  }

  setSweep(data: number) {
    if (this.decreaseSweep && (data & 0x08) === 0) {
      if (this.swept) {
        this.sweepFault = true;
      }
    }
    this.lastTimeSweep = (data & 0x70) >> 4;
    this.frequencySweepDivider = data & 0x07;
    this.decreaseSweep = (data & 0x08) === 0x08;
  }

  setDuty(data: number) {
    this.cachedDuty = dutyLookup[data >> 6];
  }

  setLength(data: number) {
    this.totalLength = 0x40 - (data & 0x3f);
  }

  setEnvelopeVolume(address: number, data: number) {
    if (
      this.enabled &&
      this.envelopeSweeps === 0
    ) {
      // Zombie Volume PAPU Bug:
      if (((this.gameboy.memory[address] ^ data) & 0x8) === 0x8) {
        if ((this.gameboy.memory[address] & 0x8) === 0) {
          if ((this.gameboy.memory[address] & 0x7) === 0x7) {
            this.envelopeVolume += 2;
          } else {
            ++this.envelopeVolume;
          }
        }
        this.envelopeVolume = 16 - this.envelopeVolume & 0xf;
      } else if ((this.gameboy.memory[address] & 0xf) === 0x8) {
        this.envelopeVolume = 1 + this.envelopeVolume & 0xf;
      }

      this.setFirstStageSamples();
      this.setSecondStageSamples();
      this.setThirdStageSamples();
      this.gameboy.audioController.cacheMixerOutputLevel();
    }
  }

  setEnvelopeType(data: number) {
    this.envelopeType = (data & 0x08) === 0x08;
  }

  setFrequency(data: number) {
    this.frequency = this.frequency & 0x700 | data;
    this.frequencyTracker = 0x800 - this.frequency << 2;
  }

  setHighFrequency(data: number) {
    this.frequency = (data & 0x7) << 8 | this.frequency & 0xff;
    this.frequencyTracker = 0x800 - this.frequency << 2;
  }

  checkEnabled() {
    this.enabled = (
      (
        this.consecutive ||
        this.totalLength > 0
      ) &&
      !this.sweepFault &&
      this.canPlay
    );
    this.setSecondStageSamples();
    this.setThirdStageSamples();
    this.gameboy.audioController.cacheMixerOutputLevel();
  }

  checkVolumeEnabled() {
    this.canPlay = this.gameboy.memory[0xff12] > 7;
    this.checkEnabled();
    this.setSecondStageSamples();
    this.setThirdStageSamples();
    this.gameboy.audioController.cacheMixerOutputLevel();
  }

  length(value: number) {
    if (this.totalLength > 1) {
      --this.totalLength;
    } else if (this.totalLength === 1) {
      this.totalLength = 0;
      this.checkEnabled();
      this.gameboy.memory[0xff26] &= value; // set Channel On Flag Off
    }
  }

  sweep() {
    if (!this.sweepFault && this.timeSweep > 0) {
      if (--this.timeSweep === 0) {
        if (this.lastTimeSweep > 0) {
          if (this.frequencySweepDivider > 0) {
            this.swept = true;
            if (this.decreaseSweep) {
              this.shadowFrequency -= this.shadowFrequency >> this.frequencySweepDivider;
              this.frequency = this.shadowFrequency & 0x7ff;
              this.frequencyTracker = 0x800 - this.frequency << 2;
            } else {
              this.shadowFrequency += this.shadowFrequency >> this.frequencySweepDivider;
              this.frequency = this.shadowFrequency;
              if (this.shadowFrequency <= 0x7ff) {
                this.frequencyTracker = 0x800 - this.frequency << 2;
                //Run overflow check twice:
                if (this.shadowFrequency + (this.shadowFrequency >> this.frequencySweepDivider) > 0x7ff) {
                  this.sweepFault = true;
                  this.checkEnabled();
                  this.gameboy.memory[0xff26] &= 0xfe; // Channel #1 On Flag Off
                }
              } else {
                this.frequency &= 0x7ff;
                this.sweepFault = true;
                this.checkEnabled();
                this.gameboy.memory[0xff26] &= 0xfe; // Channel #1 On Flag Off
              }
            }
            this.timeSweep = this.lastTimeSweep;
          } else {
            // Channel has sweep disabled and timer becomes a length counter:
            this.sweepFault = true;
            this.checkEnabled();
          }
        }
      }
    }
  }

  setFirstStageSamples() {
    this.currentSampleLeft = this.leftChannelEnabled ?
      this.envelopeVolume :
      0;
    this.currentSampleRight = this.rightChannelEnabled ?
      this.envelopeVolume :
      0;
  }

  setSecondStageSamples() {
    if (this.enabled) {
      this.currentSampleLeftSecondary = this.currentSampleLeft;
      this.currentSampleRightSecondary = this.currentSampleRight;
    } else {
      this.currentSampleLeftSecondary = 0;
      this.currentSampleRightSecondary = 0;
    }
  }

  setThirdStageSamples() {
    if (
      this.cachedDuty[this.dutyTracker] &&
      settings.enabledAudioChannels[0]
    ) {
      this.currentSampleLeftTrimary = this.currentSampleLeftSecondary;
      this.currentSampleRightTrimary = this.currentSampleRightSecondary;
    } else {
      this.currentSampleLeftTrimary = 0;
      this.currentSampleRightTrimary = 0;
    }
  }
}