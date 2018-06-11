import MBC from "./mbc";

export default class RTC {
  lastTime: number;
  latchedLDays: any;
  latchedHours: any;
  latchedMinutes: any;
  latchedSeconds: any;
  latchedHDays: number;
  RTCDayOverFlow: boolean;
  RTCDays: number;
  RTCHours: any;
  RTCMinutes: number;
  RTCSeconds: number;
  RTCHalt: boolean;
  RTCisLatched: boolean;
  mbc: MBC;

  constructor(mbc: MBC) {
    this.mbc = mbc;
  }

  // TODO: rename RTC vars

  writeSeconds(data) {
    if (data < 60) {
      this.RTCSeconds = data;
    } else {
      console.log(
        "(Bank #" +
        this.mbc.currentMBCRAMBank +
        ") RTC write out of range: " +
        data
      );
    }
  }

  writeMinutes(data) {
    if (data < 60) {
      this.RTCMinutes = data;
    } else {
      console.log(
        "(Bank #" +
        this.mbc.currentMBCRAMBank +
        ") RTC write out of range: " +
        data
      );
    }
  }

  writeDaysLow(data) {
    this.RTCDays = data & 0xff | this.RTCDays & 0x100;
  }

  writeDaysHigh(data) {
    this.RTCDayOverFlow = data > 0x7f;
    this.RTCHalt = (data & 0x40) === 0x40;
    this.RTCDays = (data & 0x1) << 8 | this.RTCDays & 0xff;
  }

  writeHours(data) {
    if (data < 24) {
      this.RTCHours = data;
    } else {
      console.log(
        "(Bank #" +
        this.mbc.currentMBCRAMBank +
        ") RTC write out of range: " +
        data
      );
    }
  }

  readSeconds() {
    return this.latchedSeconds;
  }

  readMinutes() {
    return this.latchedMinutes;
  }

  readHours() {
    return this.latchedHours;
  }

  readDaysLow() {
    return this.latchedLDays;
  }

  readDaysHigh() {
    return (this.RTCDayOverFlow ? 0x80 : 0) +
      (this.RTCHalt ? 0x40 : 0) +
      this.latchedHDays;
  }

  writeLatch(address, data) {
    if (data === 0) {
      this.RTCisLatched = false;
    } else if (!this.RTCisLatched) {
      // Copy over the current RTC time for reading.
      this.RTCisLatched = true;
      this.latchedSeconds = this.RTCSeconds | 0;
      this.latchedMinutes = this.RTCMinutes;
      this.latchedHours = this.RTCHours;
      this.latchedLDays = this.RTCDays & 0xff;
      this.latchedHDays = this.RTCDays >> 8;
    }
  }

  get() {
    const lastTimeSeconds = Math.round(this.lastTime / 1000);
    const lastTimeLow = lastTimeSeconds >> 0 & 0xffff;
    const lastTimeHigh = lastTimeSeconds >> 16 & 0xffff;

    const data = new Uint32Array([
      this.RTCSeconds,
      this.RTCMinutes,
      this.RTCHours,
      this.RTCDays,
      this.RTCDayOverFlow,
      this.latchedSeconds,
      this.latchedMinutes,
      this.latchedHours,
      this.latchedLDays,
      this.latchedHDays,
      lastTimeLow,
      lastTimeHigh
    ]);

    return data;
  }

  load(array) {
    const options = this.extract(array);

    this.RTCSeconds = options.seconds;
    this.RTCMinutes = options.minutes;
    this.RTCHours = options.hours;
    this.RTCDays = options.daysLow;
    this.RTCDayOverFlow = options.daysHigh;

    this.latchedSeconds = options.latchedSeconds;
    this.latchedMinutes = options.latchedMinutes;
    this.latchedHours = options.latchedHours;
    this.latchedLDays = options.latchedDaysLow;
    this.latchedHDays = options.latchedDaysHigh;

    this.lastTime = options.lastTime;
  }

  cutBatteryFileArray(data: ArrayBuffer) {
    return new Uint32Array(data.slice(this.mbc.ramSize, this.mbc.ramSize + 4 * 12));
  }

  extract(array) {
    const seconds = array[0];
    const minutes = array[1];
    const hours = array[2];
    const daysLow = array[3];
    const daysHigh = array[4];
    const latchedSeconds = array[5];
    const latchedMinutes = array[6];
    const latchedHours = array[7];
    const latchedDaysLow = array[8];
    const latchedDaysHigh = array[9];
    const lastTimeLow = array[10];
    const lastTimeHigh = array[11];

    let lastTimeSeconds = lastTimeLow;
    if (lastTimeLow && lastTimeHigh) {
      lastTimeSeconds = lastTimeHigh << 16 | lastTimeLow;
    }

    return {
      seconds,
      minutes,
      hours,
      daysLow,
      daysHigh,
      latchedSeconds,
      latchedMinutes,
      latchedHours,
      latchedDaysLow,
      latchedDaysHigh,
      lastTime: lastTimeSeconds * 1000
    };
  }

  saveState() {
    // TODO: remove after state refactor
    // return the MBC RAM for backup...
    return [
      this.lastTime,
      this.RTCisLatched,
      this.latchedSeconds,
      this.latchedMinutes,
      this.latchedHours,
      this.latchedLDays,
      this.latchedHDays,
      this.RTCSeconds,
      this.RTCMinutes,
      this.RTCHours,
      this.RTCDays,
      this.RTCDayOverFlow,
      this.RTCHalt
    ];
  }

  loadState(data) {
    let index = 0;
    this.lastTime = data[index++];
    this.RTCisLatched = data[index++];
    this.latchedSeconds = data[index++];
    this.latchedMinutes = data[index++];
    this.latchedHours = data[index++];
    this.latchedLDays = data[index++];
    this.latchedHDays = data[index++];
    this.RTCSeconds = data[index++];
    this.RTCMinutes = data[index++];
    this.RTCHours = data[index++];
    this.RTCDays = data[index++];
    this.RTCDayOverFlow = data[index++];
    this.RTCHalt = data[index];
  }

  updateClock() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    if (!this.RTCHalt) {
      //Update the MBC3 RTC:
      this.RTCSeconds += elapsedTime / 1000;
      while (this.RTCSeconds >= 60) {
        // System can stutter, so the seconds difference can get large, thus the "while".
        this.RTCSeconds -= 60;
        ++this.RTCMinutes;
        if (this.RTCMinutes >= 60) {
          this.RTCMinutes -= 60;
          ++this.RTCHours;
          if (this.RTCHours >= 24) {
            this.RTCHours -= 24;
            ++this.RTCDays;
            if (this.RTCDays >= 512) {
              this.RTCDays -= 512;
              this.RTCDayOverFlow = true;
            }
          }
        }
      }
    }
  }
}
