import settings from "../settings";

export default class CPU {
  speed = 1;
  ticks = 0; // Times for how many instructions to execute before ending the loop.
  cyclesTotal = 0; // Relative CPU clocking to speed set, rounded appropriately.
  cyclesTotalBase = 0; // Relative CPU clocking to speed set base.
  cyclesTotalCurrent = 0; // Relative CPU clocking to speed set, the directly used value.
  cyclesTotalRoundoff = 0; // Clocking per iteration rounding catch.
  baseCyclesPerIteration = 0; // CPU clocks per iteration at 1x speed.
  totalLinesPassed = 0;
  clocksPerSecond: number;

  constructor() {
    this.calculateTimings();
  }

  calculateTimings() {
    this.clocksPerSecond = this.speed * 0x400000;
    this.baseCyclesPerIteration = this.clocksPerSecond / 1000 * settings.runInterval;
    this.cyclesTotalRoundoff = this.baseCyclesPerIteration % 4;
    this.cyclesTotalBase = this.cyclesTotal = this.baseCyclesPerIteration - this.cyclesTotalRoundoff | 0;
    this.cyclesTotalCurrent = 0;
  }

  setSpeed(speed) {
    this.speed = speed;
    this.calculateTimings();
  }
}
