import ROM from "./ROM";
import Range from "./Range";
import * as util from "../util";

export default class ROMRange extends Range {
  constructor(start: number, end: number, private rom: ROM) {
    super(start, end);
  }

  read(address: number) {
    return this.rom.readByte(address);
  }

  write(address: number, value: number) {
    throw new Error(`rom_write - ${util.formatHex(value)} => ${util.formatHex(address)}`);
  }
}