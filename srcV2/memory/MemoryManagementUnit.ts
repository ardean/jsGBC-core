// import ROM from "./ROM";
import Range from "./Range";
import * as util from "../util";
// import IORegisters from "./IORegisters";
// import InterruptsEnableRegister from "./InterruptsEnableRegister";

export default class MemoryManagementUnit {
  private ranges: Range[] = [];

  // bios?: ROM;

  // // TODO: from cartridge/mbc
  // romBanks = [];
  // romBankIndex: 0 = 0;

  // videoRam = new Range(0x8000, 0x9FFF);
  // externalRam = new Range(0xA000, 0xBFFF);

  // workRamBanks = [new Range(0xC000, 0xCFFF), new Range(0xD000, 0xDFFF)];
  // workRamBankIndex: 1 = 1;

  // spriteAttributeTable = new Range(0xFE00, 0xFE9F);
  // ioRegisters = new IORegisters(0xFF00, 0xFF7F);
  // highRam = new Range(0xFF80, 0xFFFE);
  // interruptsEnableRegister = new InterruptsEnableRegister(0xFFFF, 0xFFFF);

  constructor(ranges: Range[]) {
    for (const range of ranges) {
      range.setMMU(this);
    }

    this.ranges = ranges;
  }

  readHigh(address: number) {
    return this.read(0xFF00 | address);
  }

  read(address: number) {
    const range = this.findRange(address);
    if (!range) throw new Error(`memory_read_out_of_range - ${util.formatHex(address)}`);
    return range.read(address - range.start);
  }

  writeHigh(address: number, value: number) {
    return this.write(0xFF00 | address, value);
  }

  write(address: number, value: number) {
    const range = this.findRange(address);
    if (!range) throw new Error(`memory_write_out_of_range - ${util.formatHex(value)} => ${util.formatHex(address)}`);
    return range.write(address - range.start, value);
  }

  findRange(address: number) {
    return this.ranges.find(range => address >= range.start && address <= range.end);

    // if (this.bios && address >= 0x0000 && address <= 0x00FF) return this.bios;

    // if (address >= 0x0000 && address <= 0x3FFF) return this.romBanks[0];
    // else if (address >= 0x4000 && address <= 0x7FFF) return this.romBanks[this.romBankIndex];
    // else if (address >= 0x8000 && address <= 0x9FFF) return this.videoRam;
    // else if (address >= 0xA000 && address <= 0xBFFF) return this.externalRam;
    // else if (address >= 0xC000 && address <= 0xCFFF) return this.workRamBanks[0];
    // else if (address >= 0xD000 && address <= 0xDFFF) return this.workRamBanks[this.workRamBankIndex];
    // else if (address >= 0xE000 && address <= 0xFDFF) throw new Error("Mirror of C000~DDFF (ECHO RAM) - Typically not used");
    // else if (address >= 0xFE00 && address <= 0xFE9F) return this.spriteAttributeTable;
    // else if (address >= 0xFEA0 && address <= 0xFEFF) throw new Error("Not Usable");
    // else if (address >= 0xFF00 && address <= 0xFF7F) return this.ioRegisters;
    // else if (address >= 0xFF80 && address <= 0xFFFE) return this.highRam;
    // else if (address === 0xFFFF) return this.interruptsEnableRegister;
  }

  removeRange(range: Range) {
    const index = this.ranges.indexOf(range);
    if (index > -1) this.ranges.splice(index, 1);
  }
}