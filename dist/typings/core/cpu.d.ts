export default class CPU {
    speed: number;
    ticks: number;
    cyclesTotal: number;
    cyclesTotalBase: number;
    cyclesTotalCurrent: number;
    cyclesTotalRoundoff: number;
    baseCyclesPerIteration: number;
    totalLinesPassed: number;
    clocksPerSecond: number;
    constructor();
    calculateTimings(): void;
    setSpeed(speed: any): void;
}
