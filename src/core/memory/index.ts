import * as util from "../../util";
import GameBoyCore from "../GameBoyCore";
import * as MemoryLayout from "./Layout";

export type WriterFunction = (address: number, value: number) => void;
export type ReaderFunction = (address: number) => number;

export default class Memory {
  gameboy: GameBoyCore;
  readers: ReaderFunction[] = [];
  writers: WriterFunction[] = [];
  data = util.getTypedArray(0x10000, 0, "uint8");

  constructor(gameboy: GameBoyCore, data) {
    this.gameboy = gameboy;
    this.data;
  }

  write(address: number, value: number) {
    return this.writers[address](address, value);
  }

  read(address: number) {
    return this.readers[address](address);
  }

  jumpCompile() {
    this.gameboy.memoryReadJumpCompile(); // TODO: remove
    this.gameboy.memoryWriteJumpCompile(); // TODO: remove

    this.setReaders(MemoryLayout.INTERRUPT_VECTORS_START, MemoryLayout.CART_ROM_BANK0_END, (address: number) => this.data[address]);
    this.setReaders(MemoryLayout.CART_ROM_SWITCH_BANK_START, MemoryLayout.CART_ROM_SWITCH_BANK_END, (address: number) => this.gameboy.cartridge.rom.getByte(this.gameboy.cartridge.mbc.currentROMBank + address));
    this.setReaders(MemoryLayout.TILE_SET_0_START, MemoryLayout.TILE_SET_1_END, this.gameboy.cartridge.useGBCMode ? this.gameboy.VRAMDATAReadCGBCPU : this.gameboy.VRAMDATAReadDMGCPU);
    this.setReaders(MemoryLayout.CART_RAM_START, MemoryLayout.CART_RAM_END, this.gameboy.cartridge.useGBCMode ? this.gameboy.VRAMCHRReadCGBCPU : this.gameboy.VRAMCHRReadDMGCPU);

    if (this.gameboy.cartridge.mbc && this.gameboy.cartridge.mbc.ramSize === 0) {
      this.setReaders(MemoryLayout.CART_RAM_START, MemoryLayout.CART_RAM_END, this.gameboy.badMemoryRead);
    } else if (this.gameboy.cartridge.hasMBC7) {
      this.setReaders(MemoryLayout.CART_RAM_START, MemoryLayout.CART_RAM_END, this.gameboy.memoryReadMBC7);
    } else if (this.gameboy.cartridge.hasMBC3) {
      this.setReaders(MemoryLayout.CART_RAM_START, MemoryLayout.CART_RAM_END, this.gameboy.memoryReadMBC3);
    } else {
      this.setReaders(MemoryLayout.CART_RAM_START, MemoryLayout.CART_RAM_END, this.gameboy.memoryReadMBC);
    }

    this.setReaders(MemoryLayout.INTERNAL_RAM_BANK0_START, MemoryLayout.INTERNAL_RAM_BANK0_END, this.gameboy.memoryReadNormal);
    if (this.gameboy.cartridge.useGBCMode) {
      this.setReaders(MemoryLayout.INTERNAL_RAM_SWITCH_BANK_START, MemoryLayout.INTERNAL_RAM_SWITCH_BANK_END, this.gameboy.memoryReadGBCMemory);
    } else {
      this.setReaders(MemoryLayout.INTERNAL_RAM_SWITCH_BANK_START, MemoryLayout.INTERNAL_RAM_SWITCH_BANK_END, this.gameboy.memoryReadNormal);
    }
  }

  setReaders(from: number, to: number, reader: ReaderFunction) {
    for (let index = from; index < to; index++) {
      this.setReader(index, reader);
    }
  }

  setReader(address: number, reader: ReaderFunction) {
    this.readers[address] = reader;
  }

  setWriters(from: number, to: number, writer: WriterFunction) {
    for (let index = from; index < to; index++) {
      this.setWriter(index, writer);
    }
  }

  setWriter(address: number, writer: WriterFunction) {
    this.writers[address] = writer;
  }
}
