import ROM from "./ROM";
import * as util from "../util";
import ROMRange from "./ROMRange";

export default class ROMBank extends ROMRange {
  baseAddress: number;

  constructor(start: number, end: number, rom: ROM, private index: number = 0) {
    super(start, end, rom);
    this.baseAddress = 0x4000 * this.index;
  }

  read(address: number) {
    const romAddress = this.baseAddress + address;
    // console.log(`reading rom address: ${util.formatHex(romAddress)}`);

    return super.read(romAddress);
  }

  write(address: number, value: number) {
    const romAddress = this.baseAddress + address;
    if (romAddress >= 0x2000 && romAddress <= 0x3FFF) {
      console.log(`ROM BANK SELECT: ${util.formatHex(value)} => ${util.formatHex(romAddress)}`);
      throw new Error("WOOT");
      return;
    }
    return super.write(address, value);
  }
}