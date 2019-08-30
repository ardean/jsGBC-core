import Range from "./Range";
import * as util from "../util";
import * as addresses from "./addresses";
import dutyLookup from "../sound/dutyLookup";

export default class SoundRange extends Range {
  soundOn: boolean = false;

  channel1SweepTicks: number;
  channel1SweepTime: number;
  channel1SweepSign: number;
  channel1SweepShifts: number;
  channel1SweepCount: number;

  channel1Duty: boolean[] = dutyLookup[2];
  channel1Length: number = 0;
  onChannel1LengthChange: (length: number) => void;
  channel1EnvelopeSign: number = 1;
  channel1EnvelopeVolume: number = 0;
  channel1EnvelopeStep: number = 0;
  onChannel1EnvelopeChange: (sign: number, volume: number, step: number) => void;
  channel1Frequency: number = 0;
  onChannel1FrequencyChange: (frequency: number, lengthCheck?: boolean, restart?: boolean) => void;

  channel2Duty: boolean[] = dutyLookup[2];
  channel2Length: number = 0;
  onChannel2LengthChange: (length: number) => void;
  channel2EnvelopeSign: number = 1;
  channel2EnvelopeVolume: number = 0;
  channel2EnvelopeStep: number = 0;
  onChannel2EnvelopeChange: (sign: number, volume: number, step: number) => void;
  channel2Frequency: number = 0;
  onChannel2FrequencyChange: (frequency: number, lengthCheck?: boolean, restart?: boolean) => void;

  vinLeftVolume: number = 0;
  vinRightVolume: number = 0;
  rightChannel1: boolean = false;
  rightChannel2: boolean = false;
  rightChannel3: boolean = false;
  rightChannel4: boolean = false;
  leftChannel1: boolean = false;
  leftChannel2: boolean = false;
  leftChannel3: boolean = false;
  leftChannel4: boolean = false;

  write(address: number, value: number) {
    const absoluteAddress = this.start + address;

    if (absoluteAddress === addresses.CHANNEL1_SWEEP) {
      this.writeChannel1Sweep(value);
    } else if (absoluteAddress === addresses.CHANNEL1_DUTY_LENGTH) {
      this.writeChannel1DutyLength(address, value);
    } else if (absoluteAddress === addresses.CHANNEL1_ENVELOPE) {
      this.writeChannel1Envelope(address, value);
    } else if (absoluteAddress === addresses.CHANNEL1_FREQUENCY_LOW) {
      this.writeChannel1FrequencyLow(value);
    } else if (absoluteAddress === addresses.CHANNEL1_FREQUENCY_HIGH) {
      this.writeChannel1FrequencyHigh(value);
    } else if (absoluteAddress === addresses.CHANNEL2_DUTY_LENGTH) {
      this.writeChannel2DutyLength(address, value);
    } else if (absoluteAddress === addresses.CHANNEL2_ENVELOPE) {
      this.writeChannel2Envelope(address, value);
    } else if (absoluteAddress === addresses.CHANNEL2_FREQUENCY_LOW) {
      this.writeChannel2FrequencyLow(value);
    } else if (absoluteAddress === addresses.CHANNEL2_FREQUENCY_HIGH) {
      this.writeChannel2FrequencyHigh(value);
    } else if (absoluteAddress === addresses.VIN_VOLUME) {
      this.writeVinVolume(address, value);
    } else if (absoluteAddress === addresses.OUTPUT_CHANNELS) {
      this.writeOutputChannels(address, value);
    } else if (absoluteAddress === addresses.SOUND_ENABLE) {
      this.writeSoundEnable(address, value);
    } else console.log(`write to sound register ${util.formatHex(value)} => ${util.formatHex(absoluteAddress)}`);

    super.write(address, value);
  }

  writeChannel1Sweep(value: number) {
    if (this.soundOn) {
      this.channel1SweepTicks = 0;
      this.channel1SweepTime = ((value & 0x70) >> 4);
      this.channel1SweepSign = ((value >> 3) & 1) === 1 ? -1 : 1;
      this.channel1SweepShifts = value & 0b111;
      this.channel1SweepCount = this.channel1SweepShifts;

      console.log(`sweep ${this.channel1SweepTicks} ${this.channel1SweepTime} ${this.channel1SweepSign} ${this.channel1SweepShifts}`);
    }
  }

  writeChannel1DutyLength(address: number, value: number) {
    if (this.soundOn) {
      this.channel1Duty = dutyLookup[(value >> 6) & 0b11]; // TODO: use
      this.channel1Length = value & 0b111111;

      super.write(address, value);

      if (this.onChannel1LengthChange) this.onChannel1LengthChange(this.channel1Length);
    }
  }

  writeChannel1Envelope(address: number, value: number) {
    if (this.soundOn) {
      this.channel1EnvelopeSign = ((value >> 3) & 1) === 1 ? 1 : -1;
      this.channel1EnvelopeVolume = (value >> 4) & 0b1111;
      this.channel1EnvelopeStep = value & 0b111;

      super.write(address, value);

      if (this.onChannel1EnvelopeChange) this.onChannel1EnvelopeChange(
        this.channel1EnvelopeSign,
        this.channel1EnvelopeVolume,
        this.channel1EnvelopeStep
      );
    }
  }

  writeChannel1FrequencyLow(value: number) {
    if (this.soundOn) {
      this.channel1Frequency = (this.channel1Frequency & 0b11100000000) | (value & 0xFF);
      if (this.onChannel1FrequencyChange) this.onChannel1FrequencyChange(this.channel1Frequency);
    }
  }

  writeChannel1FrequencyHigh(value: number) {
    if (this.soundOn) {
      this.channel1Frequency = (value & 0b11100000000) | (this.channel1Frequency & 0xFF);
      const lengthCheck = ((value >> 2) & 1) === 1;
      const restart = ((value >> 7) & 1) === 1;
      if (this.onChannel1FrequencyChange) this.onChannel1FrequencyChange(this.channel1Frequency, lengthCheck, restart);
    }
  }

  writeChannel2DutyLength(address: number, value: number) {
    if (this.soundOn) {
      this.channel2Duty = dutyLookup[value >> 6];
      this.channel2Length = 0x40 - (value & 0x3f);

      super.write(address, value);

      if (this.onChannel2LengthChange) this.onChannel2LengthChange(this.channel2Length);
    }
  }

  writeChannel2Envelope(address: number, value: number) {
    if (this.soundOn) {
      this.channel2EnvelopeSign = (value & 0x08) ? 1 : -1;

      super.write(address, value);

      if (this.onChannel2EnvelopeChange) this.onChannel2EnvelopeChange(
        this.channel2EnvelopeSign,
        this.channel2EnvelopeVolume,
        this.channel2EnvelopeStep
      );
    }
  }

  writeChannel2FrequencyLow(value: number) {
    if (this.soundOn) {
      this.channel2Frequency = (this.channel2Frequency & 0b11100000000) | (value & 0xFF);
      const lengthCheck = ((value >> 2) & 1) === 1;
      const restart = ((value >> 7) & 1) === 1;
      if (this.onChannel2FrequencyChange) this.onChannel2FrequencyChange(this.channel2Frequency, lengthCheck, restart);
    }
  }

  writeChannel2FrequencyHigh(value: number) {
    if (this.soundOn) {
      this.channel2Frequency = (value & 0b11100000000) | (this.channel2Frequency & 0xFF);
      if (this.onChannel2FrequencyChange) this.onChannel2FrequencyChange(this.channel2Frequency);
    }
  }

  writeVinVolume(address: number, value: number) {
    if (this.soundOn && super.read(address) !== value) {
      this.vinLeftVolume = ((value >> 4) & 0x07) + 1;
      this.vinRightVolume = ((value >> 0) & 0x07) + 1;

      super.write(address, value);
    }
  }

  writeOutputChannels(address: number, value: number) {
    if (this.soundOn && super.read(address) !== value) {
      this.rightChannel1 = ((value >> 0) & 1) === 1;
      this.rightChannel2 = ((value >> 1) & 1) === 1;
      this.rightChannel3 = ((value >> 2) & 1) === 1;
      this.rightChannel4 = ((value >> 3) & 1) === 1;

      this.leftChannel1 = ((value >> 4) & 1) === 1;
      this.leftChannel2 = ((value >> 5) & 1) === 1;
      this.leftChannel3 = ((value >> 6) & 1) === 1;
      this.leftChannel4 = ((value >> 7) & 1) === 1;

      super.write(address, value);
    }
  }

  writeSoundEnable(address: number, value: number) {
    const soundOn = value > 0x7f;
    if (this.soundOn !== soundOn) {
      if (soundOn) {
        super.write(address, 0x80);
      } else {
        super.write(address, 0x00);
        for (let registerAddress = 0x10; registerAddress <= 0x25; registerAddress++) {
          this.write(registerAddress, 0);
        }
      }

      this.soundOn = soundOn;
    } else console.log(`write to sound control register! ${util.formatHex(value)}`);
  }
}