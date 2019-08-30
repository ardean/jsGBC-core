import Range from "./Range";
import * as util from "../util";
import * as addresses from "./addresses";

export default class TimerDividerRange extends Range {
  write(address: number, value: number) {
    const absoluteAddress = this.start + address;

    switch (absoluteAddress) {
      case addresses.DIVIDER:
        console.log(`write to DIVIDER ${util.formatHex(value)}`);
        break;
      case addresses.TIMER_COUNTER:
        console.log(`write to TIMER_COUNTER ${util.formatHex(value)}`);
        break;
      case addresses.TIMER_MODULO:
        console.log(`write to TIMER_MODULO ${util.formatHex(value)}`);
        break;
      case addresses.TIMER_CONTROL:
        console.log(`write to TIMER_CONTROL ${util.formatHex(value)}`);
        break;
    }

    super.write(address, value);
  }
}