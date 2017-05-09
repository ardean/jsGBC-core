export default class MemoryWriter {
  constructor({ data, gameboy }) {
    this.data = data;
    this.gameboy = gameboy;
  }

  write(address, data) {
    return this.gameboy.memoryWriter[address].apply(this.gameboy, [address, data]);
  }
}
