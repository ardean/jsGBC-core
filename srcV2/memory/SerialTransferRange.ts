import Range from "./Range";
import * as util from "../util";
import * as addresses from "./addresses";
import CPU from "../cpu/CPU";

export default class SerialTransferRange extends Range {
  cpu: CPU;

  write(address: number, value: number) {
    const absoluteAddress = this.start + address;

    switch (absoluteAddress) {
      case addresses.SERIAL_TRANSFER_DATA:
        console.log(`write to SERIAL_TRANSFER_DATA ${util.formatHex(value)}`);
        break;
      case addresses.SERIAL_TRANSFER_CONTROL:
        console.log(`write to SERIAL_TRANSFER_CONTROL ${util.formatHex(value)}`);

        this.cpu.enableDebug();
        // setTimeout(() => {
        //   this.cpu.disableDebug();
        // }, 500);
        break;
    }

    super.write(address, value);
  }
}