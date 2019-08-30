import GPU from "./GPU";
import LCDRange, { Mode } from "../memory/LCDRange";
import InterruptRequest from "../memory/InterruptRequest";

export default class LCD {
  lcdRange: LCDRange;
  interruptRequest: InterruptRequest;
  gpu: GPU;
  ticks: number = 0;

  constructor(lcdRange: LCDRange, interruptRequest: InterruptRequest, gpu: GPU) {
    this.lcdRange = lcdRange;
    this.interruptRequest = interruptRequest;
    this.gpu = gpu;
  }

  tick(ticks: number) {
    this.ticks += ticks;

    switch (this.lcdRange.mode) {
      case 2:
        if (this.ticks >= 80) {
          this.ticks -= 80;
          this.changeMode(3);
        }
        break;

      case 3:
        if (this.ticks >= 172) {
          this.ticks -= 172;
          this.changeMode(0);
          this.gpu.drawLine(this.lcdRange.yLine);
        }
        break;

      case 0:
        if (this.ticks >= 204) {
          this.ticks -= 204;
          this.lcdRange.yLine++;
          this.compareYLine();

          if (this.lcdRange.yLine === 144) {
            this.changeMode(1);
            this.interruptRequest.requestVBlank();
            this.gpu.render();
          } else this.changeMode(2);
        }
        break;
      case 1:
        if (this.ticks >= 456) {
          this.ticks -= 456;
          this.lcdRange.yLine++;

          if (this.lcdRange.yLine > 153) {
            this.lcdRange.yLine = 0;
            this.changeMode(2);
          }
          this.compareYLine();
        }
        break;
    }
  }

  changeMode(mode: Mode) {
    switch (mode) {
      case 0:
        if (this.lcdRange.interruptMode00) this.interruptRequest.requestLCDStatus();
        break;
      case 1:
        if (this.lcdRange.interruptMode01) this.interruptRequest.requestLCDStatus();
        break;
      case 2:
        if (this.lcdRange.interruptMode10) this.interruptRequest.requestLCDStatus();
        break;
    }

    this.lcdRange.mode = mode;
  }

  compareYLine() {
    if (this.lcdRange.yLineCompare == this.lcdRange.yLine) {
      this.lcdRange.coincidence = true;
      if (this.lcdRange.mode === 0) this.interruptRequest.requestLCDStatus();
    } else this.lcdRange.coincidence = false;
  }
}