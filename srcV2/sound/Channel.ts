export default class Channel {
  generator: OscillatorNode;
  volume: GainNode;

  playing: boolean = false;
  frequency: number = 0;
  soundLength: number = 0;
  soundLengthUnit: number = 0x4000; // 1 / 256 second of instructions

  lengthCheck: boolean = false;
  lengthTicks: number = 0;

  envelopeTicks: number;
  envelopeCheck: boolean;
  envelopeVolume: number;
  envelopeSign: number;
  envelopeStep: number;
  envelopeStepLength: number;

  sweepTicks: number;
  sweepShifts: number;
  sweepSign: number;
  sweepCount: number;
  sweepTime: number;
  sweepStepLength: number;

  constructor(
    private channelNumber: number,
    private audioContext: AudioContext
  ) {
    this.volume = audioContext.createGain();
    this.volume.gain.value = 0;

    this.generator = audioContext.createOscillator();
    this.generator.type = "square";
    this.generator.frequency.value = 1000;
    this.generator.connect(this.volume);
    this.generator.start();
  }

  play() {
    if (this.playing) return;
    this.playing = true;
    // this.apu.setSoundFlag(this.channelNumber, 1);
    this.volume.connect(this.audioContext.destination);
    this.lengthTicks = 0;
    this.envelopeTicks = 0;
    this.sweepTicks = 0;
    if (this.sweepShifts > 0) this.checkFrequencySweep();
  }

  stop() {
    this.playing = false;
    // this.apu.setSoundFlag(this.channelNumber, 0);
    this.volume.disconnect();
  }

  checkFrequencySweep() {
    const oldFrequency = this.frequency;
    let newFrequency = oldFrequency + this.sweepSign * (oldFrequency >> this.sweepShifts);
    if (newFrequency > 0x7FF) {
      newFrequency = 0;
      this.stop();
    }

    return newFrequency;
  }

  tick(ticks: number) {
    this.envelopeTicks += ticks;
    this.sweepTicks += ticks;

    if ((this.sweepCount || this.sweepTime) && this.sweepTicks > (this.sweepStepLength * this.sweepTime)) {
      this.sweepTicks -= (this.sweepStepLength * this.sweepTime);
      this.sweepCount--;

      const newFrequency = this.checkFrequencySweep(); // process and check new freq

      // this.apu.memory[0xFF13] = newFrequency & 0xFF;
      // this.apu.memory[0xFF14] &= 0xF8;
      // this.apu.memory[0xFF14] |= (newFrequency & 0x700) >> 8;
      this.setFrequency(newFrequency);

      this.checkFrequencySweep(); // check again with new value
    }

    if (this.envelopeCheck && this.envelopeTicks > this.envelopeStepLength) {
      this.envelopeTicks -= this.envelopeStepLength;
      this.envelopeStep--;
      this.setEnvelopeVolume(this.envelopeVolume + this.envelopeSign);

      if (this.envelopeStep <= 0) {
        this.envelopeCheck = false;
      }
    }

    if (this.lengthCheck) {
      this.lengthTicks += ticks;
      if (this.lengthTicks > this.soundLengthUnit) {
        this.soundLength--;
        this.lengthTicks -= this.soundLengthUnit;
        if (this.soundLength == 0) {
          this.setLength(0);
          this.stop();
        }
      }
    }
  }

  setFrequency(value: number) {
    this.frequency = value;
    this.generator.frequency.value = 131072 / (2048 - value);
  }

  setLength(value: number) {
    this.soundLength = 64 - value;
    console.log(`channel ${this.channelNumber} sound length ${this.soundLength}`);
  }

  setEnvelopeVolume(volume: number) {
    this.envelopeCheck = 0 < volume && volume < 16 ? true : false;
    this.envelopeVolume = volume;
    this.volume.gain.value = this.envelopeVolume / 100;
  }

  disable() {
    this.generator.disconnect();
  }

  enable() {
    this.generator.connect(this.volume);
  }
}