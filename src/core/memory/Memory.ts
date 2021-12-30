import GameBoyCore from "../GameBoyCore";
import * as MemoryLayout from "./Layout";

export type WriterFunction = (address: number, value: number) => void;
export type ReaderFunction = (address: number) => number;

export default class Memory {
  readers: ReaderFunction[] = [];
  highReaders: ReaderFunction[] = [];
  writers: WriterFunction[] = [];
  highWriters: WriterFunction[] = [];

  constructor(
    private gameboy: GameBoyCore,
    private data: Uint8Array = new Uint8Array(0x10000)
  ) { }

  read(address: number) {
    const reader = this.readers[address];
    if (!reader) throw new Error("no_reader");

    return reader(address);
  }

  readHigh(address: number) {
    address &= 0xFF;
    const reader = this.highReaders[address];
    if (!reader) throw new Error("no_high_reader");

    return reader(address);
  }

  hasReader(address: number): boolean {
    return !!this.readers[address];
  }

  hasHighReader(address: number): boolean {
    address &= 0xFF;
    return !!this.highReaders[address];
  }

  setReaders(from: number, to: number, reader: ReaderFunction) {
    for (let address = from; address <= to; address++) {
      this.setReader(address, reader);
    }
  }

  setReader(address: number, reader: ReaderFunction) {
    this.readers[address] = reader;
  }

  setHighReaders(from: number, to: number, reader: ReaderFunction) {
    for (let address = from; address <= to; address++) {
      this.setHighReader(address, reader);
    }
  }

  setHighReader(address: number, reader: ReaderFunction) {
    address &= 0xFF;
    this.highReaders[address] = reader;
  }

  write(address: number, value: number) {
    const writer = this.writers[address];
    if (!writer) throw new Error("no_writer");

    return writer(address, value);
  }

  writeHigh(address: number, data: number) {
    address &= 0xFF;
    const writer = this.highWriters[address];
    if (!writer) throw new Error("no_high_writer");

    return writer(address, data);
  }

  hasWriter(address: number): boolean {
    return !!this.writers[address];
  }

  hasHighWriter(address: number): boolean {
    address &= 0xFF;
    return !!this.highWriters[address];
  }

  setWriters(from: number, to: number, writer: WriterFunction) {
    for (let address = from; address <= to; address++) {
      this.setWriter(address, writer);
    }
  }

  setWriter(address: number, writer: WriterFunction) {
    this.writers[address] = writer;
  }

  setHighWriter(address: number, writer: WriterFunction) {
    address &= 0xFF;
    this.highWriters[address] = writer;
  }

  init() {
    this.setReaders(MemoryLayout.INTERRUPT_VECTORS_START, MemoryLayout.CART_ROM_BANK0_END, (address: number) => this.data[address]);
    this.setReaders(MemoryLayout.CART_ROM_SWITCH_BANK_START, MemoryLayout.CART_ROM_SWITCH_BANK_END, (address: number) => this.gameboy.cartridge.rom.getByte(this.gameboy.cartridge.mbc.currentROMBank + address));
    this.setReaders(MemoryLayout.TILE_SET_0_START, MemoryLayout.TILE_SET_1_END, this.gameboy.cartridge.useGbcMode ? this.gameboy.VRAMDATAReadCGBCPU : this.gameboy.VRAMDATAReadDMGCPU);
    this.setReaders(MemoryLayout.CART_RAM_START, MemoryLayout.CART_RAM_END, this.gameboy.cartridge.useGbcMode ? this.gameboy.VRAMCHRReadCGBCPU : this.gameboy.VRAMCHRReadDMGCPU);

    if (this.gameboy.cartridge.mbc && this.gameboy.cartridge.mbc.ramSize === 0) {
      this.setReaders(MemoryLayout.CART_RAM_START, MemoryLayout.CART_RAM_END, this.readBad);
    } else if (this.gameboy.cartridge.hasMBC7) {
      this.setReaders(MemoryLayout.CART_RAM_START, MemoryLayout.CART_RAM_END, this.gameboy.memoryReadMBC7);
    } else if (this.gameboy.cartridge.hasMBC3) {
      this.setReaders(MemoryLayout.CART_RAM_START, MemoryLayout.CART_RAM_END, this.gameboy.memoryReadMBC3);
    } else {
      this.setReaders(MemoryLayout.CART_RAM_START, MemoryLayout.CART_RAM_END, this.gameboy.memoryReadMBC);
    }

    this.setReaders(MemoryLayout.INTERNAL_RAM_BANK0_START, MemoryLayout.INTERNAL_RAM_BANK0_END, this.gameboy.memoryReadNormal);
    if (this.gameboy.cartridge.useGbcMode) {
      this.setReaders(MemoryLayout.INTERNAL_RAM_SWITCH_BANK_START, MemoryLayout.INTERNAL_RAM_SWITCH_BANK_END, this.gameboy.memoryReadGBCMemory);
    } else {
      this.setReaders(MemoryLayout.INTERNAL_RAM_SWITCH_BANK_START, MemoryLayout.INTERNAL_RAM_SWITCH_BANK_END, this.gameboy.memoryReadNormal);
    }

    this.setReaders(MemoryLayout.ECHO_RAM_START, 0xEFFF, this.gameboy.memoryReadECHONormal);
    if (this.gameboy.cartridge.useGbcMode) {
      this.setReaders(0xF000, MemoryLayout.ECHO_RAM_END, this.gameboy.memoryReadECHOGBCMemory);
    } else {
      this.setReaders(0xF000, MemoryLayout.ECHO_RAM_END, this.gameboy.memoryReadECHONormal);
    }

    this.setReaders(MemoryLayout.SPRITE_ATTRIBUTE_TABLE_START, MemoryLayout.SPRITE_ATTRIBUTE_TABLE_END, this.gameboy.memoryReadOAM);

    if (this.gameboy.cartridge.useGbcMode) {
      this.setReaders(MemoryLayout.UNUSABLE_MEM_START, MemoryLayout.UNUSABLE_MEM_END, this.gameboy.memoryReadNormal);
    }

    this.setWriter(MemoryLayout.JOYPAD_REG, this.gameboy.joypad.writeMemory);
    this.setHighWriter(MemoryLayout.JOYPAD_REG, this.gameboy.joypad.writeMemory);

    // top nibble returns as set.
    const joypadReader = () => 0xc0 | this.gameboy.memoryReadNormal(MemoryLayout.JOYPAD_REG);
    this.setReader(MemoryLayout.JOYPAD_REG, joypadReader);
    this.setHighReader(MemoryLayout.JOYPAD_REG, joypadReader);

    const serialDataReader = () =>
      this.gameboy.memoryReadNormal(MemoryLayout.SERIAL_CONTROL_REG) < 0x80 ?
        this.gameboy.memoryReadNormal(MemoryLayout.SERIAL_DATA_REG) :
        0xff;
    this.setReader(MemoryLayout.SERIAL_DATA_REG, serialDataReader);
    this.setHighReader(MemoryLayout.SERIAL_DATA_REG, serialDataReader);

    const serialControlReader = this.gameboy.cartridge.useGbcMode ?
      () => (this.gameboy.serialTimer <= 0 ? 0x7c : 0xfc) | this.gameboy.memoryReadNormal(MemoryLayout.SERIAL_CONTROL_REG) :
      () => (this.gameboy.serialTimer <= 0 ? 0x7e : 0xfe) | this.gameboy.memoryReadNormal(MemoryLayout.SERIAL_CONTROL_REG);
    this.setReader(MemoryLayout.SERIAL_CONTROL_REG, serialControlReader);
    this.setHighReader(MemoryLayout.SERIAL_CONTROL_REG, serialControlReader);

    this.setReader(0xff03, this.readBad);
    this.setHighReader(0xff03, this.readBad);

    const divReader = () => {
      this.gameboy.memory[MemoryLayout.DIV_REG] = this.gameboy.memoryReadNormal(MemoryLayout.DIV_REG) + (this.gameboy.DIVTicks >> 8) & 0xff;
      this.gameboy.DIVTicks &= 0xff;
      return this.gameboy.memoryReadNormal(MemoryLayout.DIV_REG);
    };
    this.setReader(MemoryLayout.DIV_REG, divReader);
    this.setHighReader(MemoryLayout.DIV_REG, divReader);

    this.setReader(MemoryLayout.TIMA_REG, this.gameboy.memoryReadNormal);
    this.setHighReader(MemoryLayout.TIMA_REG, this.gameboy.memoryHighReadNormal);

    this.setReader(MemoryLayout.TMA_REG, this.gameboy.memoryReadNormal);
    this.setHighReader(MemoryLayout.TMA_REG, this.gameboy.memoryHighReadNormal);

    const timerControlReader = () => 0xf8 | this.gameboy.memoryReadNormal(MemoryLayout.TIMER_CONTROL_REG);
    this.setReader(MemoryLayout.TIMER_CONTROL_REG, timerControlReader);
    this.setHighReader(MemoryLayout.TIMER_CONTROL_REG, timerControlReader);

    this.setReaders(0xff08, 0xff0e, this.readBad);
    this.setHighReaders(0xff08, 0xff0e, this.readBad);

    const interruptFlagReader = () => 0xe0 | this.gameboy.interruptsRequested;
    this.setReader(MemoryLayout.INTERRUPT_FLAG_REG, interruptFlagReader);
    this.setHighReader(MemoryLayout.INTERRUPT_FLAG_REG, interruptFlagReader);

    this.gameboy.memoryReadJumpCompile(); // TODO: remove
    this.gameboy.memoryWriteJumpCompile(); // TODO: remove
  }

  updateIORegisters() {
    if (this.gameboy.isBootingRom) {
      this.enableBootRomControl();

      if (this.gameboy.cartridge.useGbcMode) {
        const undocumentedGbcOnlyWriter = (address: number, data: number) => {
          data &= 1;

          if (this.gameboy.isBootingRom) {
            this.gameboy.cartridge.setGbcMode(data);
          }
          this.data[MemoryLayout.undocumentedGbcOnlyAddress] = data;
        };
        this.setWriter(MemoryLayout.undocumentedGbcOnlyAddress, undocumentedGbcOnlyWriter);
        this.setHighWriter(MemoryLayout.undocumentedGbcOnlyAddress, undocumentedGbcOnlyWriter);
      }
    } else {
      this.disableBootRomControl();
    }
  }

  enableBootRomControl() {
    const disableBootRom = (address: number, data: number) => {
      console.log("Bootstrap process has ended");

      this.gameboy.isBootingRom = false;
      this.gameboy.disableBootRom(); // Fill in the boot ROM ranges with ROM bank 0 ROM ranges
      this.data[MemoryLayout.toggleBootRomControlAddress] = data;
    };
    this.setWriter(MemoryLayout.toggleBootRomControlAddress, disableBootRom);
    this.setHighWriter(MemoryLayout.toggleBootRomControlAddress, disableBootRom);
  }

  disableBootRomControl() {
    // Lockout the ROMs from accessing the BOOT ROM control register
    this.setWriter(MemoryLayout.toggleBootRomControlAddress, this.writeIllegal);
    this.setHighWriter(MemoryLayout.toggleBootRomControlAddress, this.writeIllegal);
  }

  writeIllegal = (address: number, data: number) => {
    // console.warn(`Not allowed to write address 0x${address.toString(16)} with data: ${data.toString(2)}`);
  };

  readBad = () => 0xFF;
}
