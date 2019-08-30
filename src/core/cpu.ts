import settings from "../settings";

// Sharp LR35902
// 4.194304 MHz (0x400000)
// 8.388608 MHz (0x800000)
export default class CPU {
  speed: number = 1;
  ticks: number = 0; // Times for how many instructions to execute before ending the loop.
  cyclesTotal: number = 0; // Relative CPU clocking to speed set, rounded appropriately.
  cyclesTotalBase: number = 0; // Relative CPU clocking to speed set base.
  cyclesTotalCurrent: number = 0; // Relative CPU clocking to speed set, the directly used value.
  cyclesTotalRoundoff: number = 0; // Clocking per iteration rounding catch.
  baseCyclesPerIteration: number = 0; // CPU clocks per iteration at 1x speed.
  totalLinesPassed: number = 0;
  clocksPerSecond: number = 0;

  constructor() {
    this.calculateTimings();
  }

  setSpeed(speed: number) {
    this.speed = speed;
    this.calculateTimings();
  }

  calculateTimings() {
    this.clocksPerSecond = this.speed * 0x400000;
    this.baseCyclesPerIteration = this.clocksPerSecond / 1000 * settings.runInterval;
    this.cyclesTotalRoundoff = this.baseCyclesPerIteration % 4;
    this.cyclesTotalBase = this.cyclesTotal = this.baseCyclesPerIteration - this.cyclesTotalRoundoff | 0;
    this.cyclesTotalCurrent = 0;
  }
}
