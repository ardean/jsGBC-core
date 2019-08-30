import Range from "./Range";

export default class VideoRAM extends Range {
  tiles = this.createTiles(32 * 32);
  backgroundMaps: number[][] = [new Array(0x400).fill(0), new Array(0x400).fill(0)];

  write(address: number, value: number) {
    const absoluteAddress = this.start + address;
    if (absoluteAddress >= 0x8000 && absoluteAddress <= 0x97FF) {
      const res = this.sumBytes(super.read(address), value);

      this.tiles[address >> 4][address >> 1 & 7] = res;
    } else if (absoluteAddress >= 0x9800 && absoluteAddress <= 0x9FFF) {
      this.backgroundMaps[absoluteAddress >> 10 & 1][absoluteAddress & 0x3FF] = value;
    }

    return super.write(address, value);
  }

  sumBytes(x: number, y: number) {
    const line = [];
    for (let b = 7; b > -1; b--) {
      const val = (x >> b & 1) | (y >> b & 1) << 1;
      line[7 - b] = val;
    }

    return line;
  }

  createTiles(length: number) {
    const tiles: number[][][] = [];
    for (let index = 0; index < length; index++) {
      tiles.push([
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]);
    }

    return tiles;
  }
}