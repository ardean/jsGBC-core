import MemoryWriter from "./writer";
import MemoryReader from "./reader";
import * as util from "../../util";
import GameBoyCore from "../GameBoyCore";

export default class Memory {
  gameboy: GameBoyCore;
  writer: MemoryWriter;
  reader: MemoryReader;
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
