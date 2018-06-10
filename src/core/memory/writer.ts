import GameBoyCore from "../GameBoyCore";

export default class MemoryWriter {
  data: any;
  gameboy: GameBoyCore;

  constructor({ data, gameboy }) {
    this.data = data;
    this.gameboy = gameboy;
  }

  write(address, data) {
    return this.gameboy.memoryWriter[address].apply(this.gameboy, [address, data]);
  }
}
