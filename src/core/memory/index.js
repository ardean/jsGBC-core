import MemoryWriter from "./writer.js";
import MemoryReader from "./reader.js";
import * as util from "../util";

export default class Memory {
  data = util.getTypedArray(0x10000, 0, "uint8");

  constructor(gameboy) {
    this.gameboy = gameboy;
    this.writer = new MemoryWriter({
      gameboy,
      data: this.data
    });
    this.reader = new MemoryReader({
      gameboy,
      data: this.data
    });
  }

  write(address, data) {
    return this.writer.write(address, data);
  }

  read(address) {
    return this.reader.read(address);
  }
}
