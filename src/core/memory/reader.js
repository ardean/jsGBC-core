export default class MemoryReader {
  constructor({ data, gameboy }) {
    this.data = data;
    this.gameboy = gameboy;
  }

  read(address) {
    return this.gameboy.memoryReader[address].apply(this.gameboy, [address]);
  }
}
