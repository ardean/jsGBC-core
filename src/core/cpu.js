import settings from "../settings.js";

export default class CPU {
  speedMultiplier = 1;
  ticks = 0; // Times for how many instructions to execute before ending the loop.
  cyclesTotal = 0; // Relative CPU clocking to speed set, rounded appropriately.
  cyclesTotalBase = 0; // Relative CPU clocking to speed set base.
  cyclesTotalCurrent = 0; // Relative CPU clocking to speed set, the directly used value.
  cyclesTotalRoundoff = 0; // Clocking per iteration rounding catch.
  baseCyclesPerIteration = 0; // CPU clocks per iteration at 1x speed.
  totalLinesPassed = 0;

  constructor() {
    this.calculateTimings();
  }

  calculateTimings() {
    this.clocksPerSecond = this.speedMultiplier * 0x400000;
    this.baseCyclesPerIteration = this.clocksPerSecond / 1000 * settings.runInterval;
    this.cyclesTotalRoundoff = this.baseCyclesPerIteration % 4;
    this.cyclesTotalBase = this.cyclesTotal = this.baseCyclesPerIteration - this.cyclesTotalRoundoff | 0;
    this.cyclesTotalCurrent = 0;
  }

  setSpeedMultiplier(value) {
    this.speedMultiplier = value;
    this.calculateTimings();
  }
}
