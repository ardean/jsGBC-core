import Range from "./Range";
import * as util from "../util";

export default class InterruptEnable extends Range {
  interruptEnabled: number = 0;

  read(address: number) {
    console.info(`read interrupt enable ${util.formatHex(this.interruptEnabled)}`);

    return this.interruptEnabled;
  }

  write(address: number, value: number) {
    this.interruptEnabled = value;

    console.info(`write interrupt enable ${util.formatHex(this.interruptEnabled)}`);

    super.write(address, value);
  }
}