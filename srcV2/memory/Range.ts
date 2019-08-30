import MemoryManagementUnit from "./MemoryManagementUnit";

export default class Range {
  buffer: Uint8Array;
  mmu: MemoryManagementUnit;

  constructor(
    public start: number,
    public end: number
  ) {
    this.buffer = new Uint8Array(end - start + 1);
  }

  setMMU(mmu: MemoryManagementUnit) {
    this.mmu = mmu;
  }

  read(address: number): number {
    return this.buffer[address];
  }

  write(address: number, value: number): void {
    this.buffer[address] = value;
  }
}