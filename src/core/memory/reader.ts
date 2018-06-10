import GameBoyCore from "../GameBoyCore";

export default class MemoryReader {
  data: any;
  gameboy: GameBoyCore;

  constructor({ data, gameboy }) {
    this.data = data;
    this.gameboy = gameboy;
  }

  read(address) {
    return this.gameboy.memoryReader[address].apply(this.gameboy, [address]);
  }
}
