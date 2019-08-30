import Range from "./Range";
import * as util from "../util";
import { VBLANK_INTERRUPT, LCD_STATUS_INTERRUPT } from "../interruptFlags";

export default class InterruptRequest extends Range {
  interruptMasterEnabled: boolean = false;
  interruptRequested: number = 0;

  read(address: number) {
    console.log(`read interrupt request`);
    return this.interruptRequested;
  }

  write(address: number, value: number) {
    this.interruptRequested = value;
    console.info(`write interrupt request ${util.formatHex(value)}`);
  }

  requestVBlank() {
    this.interruptRequested |= VBLANK_INTERRUPT;
  }

  requestLCDStatus() {
    this.interruptRequested |= LCD_STATUS_INTERRUPT;
    console.log("LCD status request");
  }
}