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

    return reader(0xFF00 | address);
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

    return writer(0xFF00 | address, data);
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

    this.setWriter(MemoryLayout.joypadAddress, this.gameboy.joypad.writeMemory);
    this.setHighWriter(MemoryLayout.joypadAddress, this.gameboy.joypad.writeMemory);

    this.setReader(MemoryLayout.joypadAddress, this.gameboy.joypad.readMemory);
    this.setHighReader(MemoryLayout.joypadAddress, this.gameboy.joypad.readMemory);

    const serialDataReader = () =>
      this.gameboy.memoryReadNormal(MemoryLayout.serialControlAddress) < 0x80 ?
        this.gameboy.memoryReadNormal(MemoryLayout.serialDataAddress) :
        0xff;
    this.setReader(MemoryLayout.serialDataAddress, serialDataReader);
    this.setHighReader(MemoryLayout.serialDataAddress, serialDataReader);

    const serialControlReader = this.gameboy.cartridge.useGbcMode ?
      () => (this.gameboy.serialTimer <= 0 ? 0x7c : 0xfc) | this.gameboy.memoryReadNormal(MemoryLayout.serialControlAddress) :
      () => (this.gameboy.serialTimer <= 0 ? 0x7e : 0xfe) | this.gameboy.memoryReadNormal(MemoryLayout.serialControlAddress);
    this.setReader(MemoryLayout.serialControlAddress, serialControlReader);
    this.setHighReader(MemoryLayout.serialControlAddress, serialControlReader);

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

    const timerControlReader = () => 0xF8 | this.gameboy.memoryReadNormal(MemoryLayout.TIMER_CONTROL_REG);
    this.setReader(MemoryLayout.TIMER_CONTROL_REG, timerControlReader);
    this.setHighReader(MemoryLayout.TIMER_CONTROL_REG, timerControlReader);

    this.setReaders(0xFF08, 0xFF0E, this.readBad);
    this.setHighReaders(0xFF08, 0xFF0E, this.readBad);

    const interruptFlagReader = () => 0xE0 | this.gameboy.interruptRequestedFlags;
    this.setReader(MemoryLayout.INTERRUPT_FLAG_REG, interruptFlagReader);
    this.setHighReader(MemoryLayout.INTERRUPT_FLAG_REG, interruptFlagReader);

    this.memoryReadJumpCompile();
    this.memoryWriteJumpCompile();
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

  memoryReadJumpCompile() {
    for (let address = 0x0000; address <= 0xffff; address++) {
      if (address >= 0xff00) {
        switch (address) {
          case 0xff10:
            this.gameboy.highMemoryReader[0x10] = this.gameboy.memoryReader[0xff10] = address => {
              return 0x80 | this.gameboy.memory[0xff10];
            };
            break;
          case 0xff11:
            this.gameboy.highMemoryReader[0x11] = this.gameboy.memoryReader[0xff11] = address => {
              return 0x3f | this.gameboy.memory[0xff11];
            };
            break;
          case 0xff12:
            this.gameboy.highMemoryReader[0x12] = this.gameboy.memoryHighReadNormal;
            this.gameboy.memoryReader[0xff12] = this.gameboy.memoryReadNormal;
            break;
          case 0xff13:
            this.gameboy.highMemoryReader[0x13] = this.gameboy.memoryReader[0xff13] = this.readBad;
            break;
          case 0xff14:
            this.gameboy.highMemoryReader[0x14] = this.gameboy.memoryReader[0xff14] = address => {
              return 0xbf | this.gameboy.memory[0xff14];
            };
            break;
          case 0xff15:
            this.gameboy.highMemoryReader[0x15] = this.readBad;
            this.gameboy.memoryReader[0xff15] = this.readBad;
            break;
          case 0xff16:
            this.gameboy.highMemoryReader[0x16] = this.gameboy.memoryReader[0xff16] = address => {
              return 0x3f | this.gameboy.memory[0xff16];
            };
            break;
          case 0xff17:
            this.gameboy.highMemoryReader[0x17] = this.gameboy.memoryHighReadNormal;
            this.gameboy.memoryReader[0xff17] = this.gameboy.memoryReadNormal;
            break;
          case 0xff18:
            this.gameboy.highMemoryReader[0x18] = this.gameboy.memoryReader[0xff18] = this.readBad;
            break;
          case 0xff19:
            this.gameboy.highMemoryReader[0x19] = this.gameboy.memoryReader[0xff19] = address => {
              return 0xbf | this.gameboy.memory[0xff19];
            };
            break;
          case 0xff1a:
            this.gameboy.highMemoryReader[0x1a] = this.gameboy.memoryReader[0xff1a] = address => {
              return 0x7f | this.gameboy.memory[0xff1a];
            };
            break;
          case 0xff1b:
            this.gameboy.highMemoryReader[0x1b] = this.gameboy.memoryReader[0xff1b] = this.readBad;
            break;
          case 0xff1c:
            this.gameboy.highMemoryReader[0x1c] = this.gameboy.memoryReader[0xff1c] = address => {
              return 0x9f | this.gameboy.memory[0xff1c];
            };
            break;
          case 0xff1d:
            this.gameboy.highMemoryReader[0x1d] = this.gameboy.memoryReader[0xff1d] = this.readBad;
            break;
          case 0xff1e:
            this.gameboy.highMemoryReader[0x1e] = this.gameboy.memoryReader[0xff1e] = address => {
              return 0xbf | this.gameboy.memory[0xff1e];
            };
            break;
          case 0xff1f:
          case 0xff20:
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryReader[address] = this.readBad;
            break;
          case 0xff21:
          case 0xff22:
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryHighReadNormal;
            this.gameboy.memoryReader[address] = this.gameboy.memoryReadNormal;
            break;
          case 0xff23:
            this.gameboy.highMemoryReader[0x23] = this.gameboy.memoryReader[0xff23] = address => {
              return 0xbf | this.gameboy.memory[0xff23];
            };
            break;
          case 0xff24:
          case 0xff25:
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryHighReadNormal;
            this.gameboy.memoryReader[address] = this.gameboy.memoryReadNormal;
            break;
          case 0xff26:
            this.gameboy.highMemoryReader[0x26] = this.gameboy.memoryReader[0xff26] = address => {
              this.gameboy.audioController.run();
              return 0x70 | this.gameboy.memory[0xff26];
            };
            break;
          case 0xff27:
          case 0xff28:
          case 0xff29:
          case 0xff2a:
          case 0xff2b:
          case 0xff2c:
          case 0xff2d:
          case 0xff2e:
          case 0xff2f:
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryReader[address] = this.readBad;
            break;
          case 0xff30:
          case 0xff31:
          case 0xff32:
          case 0xff33:
          case 0xff34:
          case 0xff35:
          case 0xff36:
          case 0xff37:
          case 0xff38:
          case 0xff39:
          case 0xff3a:
          case 0xff3b:
          case 0xff3c:
          case 0xff3d:
          case 0xff3e:
          case 0xff3f:
            this.gameboy.memoryReader[address] = address => {
              return this.gameboy.audioController.channel3CanPlay ?
                this.gameboy.memory[0xff00 | this.gameboy.audioController.channel3lastSampleLookup >> 1] :
                this.gameboy.memory[address];
            };
            this.gameboy.highMemoryReader[address & 0xff] = address => {
              return this.gameboy.audioController.channel3CanPlay ?
                this.gameboy.memory[0xff00 | this.gameboy.audioController.channel3lastSampleLookup >> 1] :
                this.gameboy.memory[0xff00 | address];
            };
            break;
          case 0xff40:
            this.gameboy.highMemoryReader[0x40] = this.gameboy.memoryHighReadNormal;
            this.gameboy.memoryReader[0xff40] = this.gameboy.memoryReadNormal;
            break;
          case 0xff41:
            this.gameboy.highMemoryReader[0x41] = this.gameboy.memoryReader[0xff41] = address => {
              return 0x80 | this.gameboy.memory[0xff41] | this.gameboy.modeSTAT;
            };
            break;
          case 0xff42:
            this.gameboy.highMemoryReader[0x42] = this.gameboy.memoryReader[0xff42] = address => {
              return this.gameboy.backgroundY;
            };
            break;
          case 0xff43:
            this.gameboy.highMemoryReader[0x43] = this.gameboy.memoryReader[0xff43] = address => {
              return this.gameboy.backgroundX;
            };
            break;
          case 0xff44:
            this.gameboy.highMemoryReader[0x44] = this.gameboy.memoryReader[0xff44] = address => {
              return this.gameboy.gpu.lcdEnabled ? this.gameboy.memory[0xff44] : 0;
            };
            break;
          case 0xff45:
          case 0xff46:
          case 0xff47:
          case 0xff48:
          case 0xff49:
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryHighReadNormal;
            this.gameboy.memoryReader[address] = this.gameboy.memoryReadNormal;
            break;
          case 0xff4a:
            //WY
            this.gameboy.highMemoryReader[0x4a] = this.gameboy.memoryReader[0xff4a] = address => {
              return this.gameboy.windowY;
            };
            break;
          case 0xff4b:
            this.gameboy.highMemoryReader[0x4b] = this.gameboy.memoryHighReadNormal;
            this.gameboy.memoryReader[0xff4b] = this.gameboy.memoryReadNormal;
            break;
          case 0xff4c:
            this.gameboy.highMemoryReader[0x4c] = this.gameboy.memoryReader[0xff4c] = this.readBad;
            break;
          case 0xff4d:
            this.gameboy.highMemoryReader[0x4d] = this.gameboy.memoryHighReadNormal;
            this.gameboy.memoryReader[0xff4d] = this.gameboy.memoryReadNormal;
            break;
          case 0xff4e:
            this.gameboy.highMemoryReader[0x4e] = this.gameboy.memoryReader[0xff4e] = this.readBad;
            break;
          case 0xff4f:
            this.gameboy.highMemoryReader[0x4f] = this.gameboy.memoryReader[0xff4f] = address => {
              return this.gameboy.currVRAMBank;
            };
            break;
          case MemoryLayout.toggleBootRomControlAddress:
          case 0xff51:
          case 0xff52:
          case 0xff53:
          case 0xff54:
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryHighReadNormal;
            this.gameboy.memoryReader[address] = this.gameboy.memoryReadNormal;
            break;
          case 0xff55:
            if (this.gameboy.cartridge.useGbcMode) {
              this.gameboy.highMemoryReader[0x55] = this.gameboy.memoryReader[0xff55] = address => {
                if (!this.gameboy.gpu.lcdEnabled && this.gameboy.hdmaRunning) {
                  //Undocumented behavior alert: HDMA becomes GDMA when LCD is off (Worms Armageddon Fix).
                  //DMA
                  this.gameboy.writeDirectlyToMemory((this.gameboy.memory[0xff55] & 0x7f) + 1);
                  this.gameboy.memory[0xff55] = 0xff; //Transfer completed.
                  this.gameboy.hdmaRunning = false;
                }
                return this.gameboy.memory[0xff55];
              };
            } else {
              this.gameboy.memoryReader[0xff55] = this.gameboy.memoryReadNormal;
              this.gameboy.highMemoryReader[0x55] = this.gameboy.memoryHighReadNormal;
            }
            break;
          case 0xff56:
            if (this.gameboy.cartridge.useGbcMode) {
              this.gameboy.highMemoryReader[0x56] = this.gameboy.memoryReader[0xff56] = address => {
                //Return IR "not connected" status:
                return 0x3c | (this.gameboy.memory[0xff56] >= 0xc0 ? 0x2 | this.gameboy.memory[0xff56] & 0xc1 : this.gameboy.memory[0xff56] & 0xc3);
              };
            } else {
              this.gameboy.memoryReader[0xff56] = this.gameboy.memoryReadNormal;
              this.gameboy.highMemoryReader[0x56] = this.gameboy.memoryHighReadNormal;
            }
            break;
          case 0xff57:
          case 0xff58:
          case 0xff59:
          case 0xff5a:
          case 0xff5b:
          case 0xff5c:
          case 0xff5d:
          case 0xff5e:
          case 0xff5f:
          case 0xff60:
          case 0xff61:
          case 0xff62:
          case 0xff63:
          case 0xff64:
          case 0xff65:
          case 0xff66:
          case 0xff67:
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryReader[address] = this.readBad;
            break;
          case 0xff68:
          case 0xff69:
          case 0xff6a:
          case 0xff6b:
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryHighReadNormal;
            this.gameboy.memoryReader[address] = this.gameboy.memoryReadNormal;
            break;
          case 0xff6c:
            if (this.gameboy.cartridge.useGbcMode) {
              this.gameboy.highMemoryReader[0x6c] = this.gameboy.memoryReader[0xff6c] = address => {
                return 0xfe | this.gameboy.memory[0xff6c];
              };
            } else {
              this.gameboy.highMemoryReader[0x6c] = this.gameboy.memoryReader[0xff6c] = this.readBad;
            }
            break;
          case 0xff6d:
          case 0xff6e:
          case 0xff6f:
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryReader[address] = this.readBad;
            break;
          case 0xff70:
            if (this.gameboy.cartridge.useGbcMode) {
              //SVBK
              this.gameboy.highMemoryReader[0x70] = this.gameboy.memoryReader[0xff70] = address => {
                return 0x40 | this.gameboy.memory[0xff70];
              };
            } else {
              this.gameboy.highMemoryReader[0x70] = this.gameboy.memoryReader[0xff70] = this.readBad;
            }
            break;
          case 0xff71:
            this.gameboy.highMemoryReader[0x71] = this.gameboy.memoryReader[0xff71] = this.readBad;
            break;
          case 0xff72:
          case 0xff73:
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryReader[address] = this.gameboy.memoryReadNormal;
            break;
          case 0xff74:
            if (this.gameboy.cartridge.useGbcMode) {
              this.gameboy.highMemoryReader[0x74] = this.gameboy.memoryReader[0xff74] = this.gameboy.memoryReadNormal;
            } else {
              this.gameboy.highMemoryReader[0x74] = this.gameboy.memoryReader[0xff74] = this.readBad;
            }
            break;
          case 0xff75:
            this.gameboy.highMemoryReader[0x75] = this.gameboy.memoryReader[0xff75] = address => {
              return 0x8f | this.gameboy.memory[0xff75];
            };
            break;
          case 0xff76:
            //Undocumented realtime PCM amplitude readback:
            this.gameboy.highMemoryReader[0x76] = this.gameboy.memoryReader[0xff76] = address => {
              this.gameboy.audioController.run();
              return this.gameboy.audioController.channel2envelopeVolume << 4 | this.gameboy.audioController.channel1envelopeVolume;
            };
            break;
          case 0xff77:
            //Undocumented realtime PCM amplitude readback:
            this.gameboy.highMemoryReader[0x77] = this.gameboy.memoryReader[0xff77] = address => {
              this.gameboy.audioController.run();
              return this.gameboy.audioController.channel4envelopeVolume << 4 | this.gameboy.audioController.channel3envelopeVolume;
            };
            break;
          case 0xff78:
          case 0xff79:
          case 0xff7a:
          case 0xff7b:
          case 0xff7c:
          case 0xff7d:
          case 0xff7e:
          case 0xff7f:
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryReader[address] = this.readBad;
            break;
          case MemoryLayout.interruptEnableAddress:
            this.gameboy.highMemoryReader[0xff] = this.gameboy.memoryReader[MemoryLayout.interruptEnableAddress] = address => this.gameboy.interruptEnabledFlags;
            break;
          default:
            this.gameboy.memoryReader[address] = this.gameboy.memoryReadNormal;
            this.gameboy.highMemoryReader[address & 0xff] = this.gameboy.memoryHighReadNormal;
        }
      } else {
        this.gameboy.memoryReader[address] = this.readBad;
      }
    }
  }

  memoryWriteJumpCompile() {
    // Faster in some browsers, since we are doing less conditionals overall by implementing them in advance.
    for (let address = 0x0000; address <= 0xffff; address++) {
      if (address <= MemoryLayout.CART_ROM_SWITCH_BANK_END) {
        if (this.gameboy.cartridge.hasMBC1) {
          if (address < 0x2000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBCWriteEnable;
          } else if (address < 0x4000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBC1WriteROMBank;
          } else if (address < 0x6000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBC1WriteRAMBank;
          } else {
            this.gameboy.memoryWriter[address] = this.gameboy.MBC1WriteType;
          }
        } else if (this.gameboy.cartridge.hasMBC2) {
          if (address < 0x1000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBCWriteEnable;
          } else if (address >= 0x2100 && address < 0x2200) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBC2WriteROMBank;
          } else {
            this.gameboy.memoryWriter[address] = this.writeIllegal;
          }
        } else if (this.gameboy.cartridge.hasMBC3) {
          if (address < 0x2000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBCWriteEnable;
          } else if (address < 0x4000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBC3WriteROMBank;
          } else if (address < 0x6000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBC3WriteRAMBank;
          } else {
            this.gameboy.memoryWriter[address] = this.gameboy.MBC3WriteRTCLatch;
          }
        } else if (
          this.gameboy.cartridge.hasMBC5 ||
          this.gameboy.cartridge.hasRUMBLE ||
          this.gameboy.cartridge.hasMBC7
        ) {
          if (address < 0x2000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBCWriteEnable;
          } else if (address < 0x3000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBC5WriteROMBankLow;
          } else if (address < 0x4000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBC5WriteROMBankHigh;
          } else if (address < 0x6000) {
            this.gameboy.memoryWriter[address] = this.gameboy.cartridge.hasRUMBLE ?
              this.gameboy.RUMBLEWriteRAMBank :
              this.gameboy.MBC5WriteRAMBank;
          } else {
            this.gameboy.memoryWriter[address] = this.writeIllegal;
          }
        } else if (this.gameboy.cartridge.hasHuC3) {
          if (address < 0x2000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBCWriteEnable;
          } else if (address < 0x4000) {
            this.gameboy.memoryWriter[address] = this.gameboy.MBC3WriteROMBank;
          } else if (address < 0x6000) {
            this.gameboy.memoryWriter[address] = this.gameboy.HuC3WriteRAMBank;
          } else {
            this.gameboy.memoryWriter[address] = this.writeIllegal;
          }
        } else {
          this.gameboy.memoryWriter[address] = this.writeIllegal;
        }
      } else if (address <= MemoryLayout.TILE_SET_0_END) {
        this.gameboy.memoryWriter[address] = this.gameboy.cartridge.useGbcMode ? this.gameboy.VRAMGBCDATAWrite : this.gameboy.VRAMGBDATAWrite;
      } else if (address < 0x9800) {
        this.gameboy.memoryWriter[address] = this.gameboy.cartridge.useGbcMode ? this.gameboy.VRAMGBCDATAWrite : this.gameboy.VRAMGBDATAUpperWrite;
      } else if (address < 0xa000) {
        this.gameboy.memoryWriter[address] = this.gameboy.cartridge.useGbcMode ? this.gameboy.VRAMGBCCHRMAPWrite : this.gameboy.VRAMGBCHRMAPWrite;
      } else if (address < 0xc000) {
        if (this.gameboy.cartridge.mbc && this.gameboy.cartridge.mbc.ramSize !== 0) {
          if (!this.gameboy.cartridge.hasMBC3) {
            this.gameboy.memoryWriter[address] = this.gameboy.memoryWriteMBCRAM;
          } else {
            //MBC3 RTC + RAM:
            this.gameboy.memoryWriter[address] = this.gameboy.memoryWriteMBC3RAM;
          }
        } else {
          this.gameboy.memoryWriter[address] = this.writeIllegal;
        }
      } else if (address < 0xe000) {
        if (this.gameboy.cartridge.useGbcMode && address >= 0xd000) {
          this.gameboy.memoryWriter[address] = this.gameboy.memoryWriteGBCRAM;
        } else {
          this.gameboy.memoryWriter[address] = this.gameboy.memoryWriteNormal;
        }
      } else if (address < 0xfe00) {
        if (this.gameboy.cartridge.useGbcMode && address >= 0xf000) {
          this.gameboy.memoryWriter[address] = this.gameboy.memoryWriteECHOGBCRAM;
        } else {
          this.gameboy.memoryWriter[address] = this.gameboy.memoryWriteECHONormal;
        }
      } else if (address <= 0xfea0) {
        this.gameboy.memoryWriter[address] = this.gameboy.memoryWriteOAMRAM;
      } else if (address < 0xff00) {
        if (this.gameboy.cartridge.useGbcMode) {
          // Only GBC has access to this.gameboy RAM.
          this.gameboy.memoryWriter[address] = this.gameboy.memoryWriteNormal;
        } else {
          this.gameboy.memoryWriter[address] = this.writeIllegal;
        }
      } else {
        //Start the I/O initialization by filling in the slots as normal memory:
        this.gameboy.memoryWriter[address] = this.gameboy.memoryWriteNormal;
        this.gameboy.highMemoryWriter[address & 0xff] = this.gameboy.memoryHighWriteNormal;
      }
    }

    this.registerIOMemoryWriters(); // Compile the I/O write functions separately...
  }

  registerIOMemoryWriters() {
    // SB (Serial Transfer Data)
    this.gameboy.highMemoryWriter[0x1] = this.gameboy.memoryWriter[MemoryLayout.serialDataAddress] = (address: number, data: number) => {
      if (this.gameboy.memory[MemoryLayout.serialControlAddress] < 0x80) {
        //Cannot write while a serial transfer is active.
        this.gameboy.memory[MemoryLayout.serialDataAddress] = data;
      }
    };
    // SC (Serial Transfer Control):
    this.gameboy.highMemoryWriter[0x2] = this.gameboy.memoryHighWriteNormal;
    this.gameboy.memoryWriter[MemoryLayout.serialControlAddress] = this.gameboy.memoryWriteNormal;

    // Unmapped I/O:
    this.gameboy.highMemoryWriter[0x3] = this.gameboy.memoryWriter[0xff03] = this.writeIllegal;

    // DIV
    this.gameboy.highMemoryWriter[0x4] = this.gameboy.memoryWriter[MemoryLayout.DIV_REG] = (address: number, data: number) => {
      this.gameboy.DIVTicks &= 0xff; // Update DIV for realignment.
      this.gameboy.memory[MemoryLayout.DIV_REG] = 0;
    };
    // TIMA
    this.gameboy.highMemoryWriter[0x5] = this.gameboy.memoryWriter[0xff05] = (address: number, data: number) => {
      this.gameboy.memory[0xff05] = data;
    };
    // TMA
    this.gameboy.highMemoryWriter[0x6] = this.gameboy.memoryWriter[0xff06] = (address: number, data: number) => {
      this.gameboy.memory[0xff06] = data;
    };
    // TAC
    this.gameboy.highMemoryWriter[0x7] = this.gameboy.memoryWriter[0xff07] = (address: number, data: number) => {
      this.gameboy.memory[0xff07] = data & 0x07;
      this.gameboy.TIMAEnabled = (data & 0x04) === 0x04;
      this.gameboy.TACClocker = Math.pow(4, (data & 0b11) !== 0 ? data & 0b11 : 4) << 2; //TODO: Find a way to not make a conditional in here...
    };
    //Unmapped I/O:
    this.gameboy.highMemoryWriter[0x8] = this.gameboy.memoryWriter[0xff08] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0x9] = this.gameboy.memoryWriter[0xff09] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0xa] = this.gameboy.memoryWriter[0xff0a] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0xb] = this.gameboy.memoryWriter[0xff0b] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0xc] = this.gameboy.memoryWriter[0xff0c] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0xd] = this.gameboy.memoryWriter[0xff0d] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0xe] = this.gameboy.memoryWriter[0xff0e] = this.writeIllegal;
    //IF (Interrupt Request)
    this.gameboy.highMemoryWriter[0xf] = this.gameboy.memoryWriter[0xff0f] = (address: number, data: number) => {
      this.gameboy.interruptRequestedFlags = data;
      this.gameboy.checkIRQMatching();
    };

    this.gameboy.audioController.registerMemoryWriters();

    //0xFF27 to 0xFF2F don't do anything...
    this.gameboy.highMemoryWriter[0x27] = this.gameboy.memoryWriter[0xff27] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0x28] = this.gameboy.memoryWriter[0xff28] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0x29] = this.gameboy.memoryWriter[0xff29] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0x2a] = this.gameboy.memoryWriter[0xff2a] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0x2b] = this.gameboy.memoryWriter[0xff2b] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0x2c] = this.gameboy.memoryWriter[0xff2c] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0x2d] = this.gameboy.memoryWriter[0xff2d] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0x2e] = this.gameboy.memoryWriter[0xff2e] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0x2f] = this.gameboy.memoryWriter[0xff2f] = this.writeIllegal;

    this.gameboy.audioController.registerWaveformMemoryWriters();

    //SCY
    this.gameboy.highMemoryWriter[0x42] = this.gameboy.memoryWriter[0xff42] = (address: number, data: number) => {
      if (this.gameboy.backgroundY != data) {
        this.gameboy.midScanLineJIT();
        this.gameboy.backgroundY = data;
      }
    };
    //SCX
    this.gameboy.highMemoryWriter[0x43] = this.gameboy.memoryWriter[0xff43] = (address: number, data: number) => {
      if (this.gameboy.backgroundX != data) {
        this.gameboy.midScanLineJIT();
        this.gameboy.backgroundX = data;
      }
    };
    //LY
    this.gameboy.highMemoryWriter[0x44] = this.gameboy.memoryWriter[0xff44] = (address: number, data: number) => {
      //Read Only:
      if (this.gameboy.gpu.lcdEnabled) {
        //Gambatte says to do this.gameboy:
        this.gameboy.modeSTAT = 2;
        this.gameboy.midScanlineOffset = -1;
        this.gameboy.cpu.totalLinesPassed = this.gameboy.currentX = this.gameboy.queuedScanLines = this.gameboy.lastUnrenderedLine = this.gameboy.LCDTicks = this.gameboy.STATTracker = this.gameboy.actualScanLine = this.gameboy.memory[0xff44] = 0;
      }
    };
    //LYC
    this.gameboy.highMemoryWriter[0x45] = this.gameboy.memoryWriter[0xff45] = (address: number, data: number) => {
      if (this.gameboy.memory[0xff45] != data) {
        this.gameboy.memory[0xff45] = data;
        if (this.gameboy.gpu.lcdEnabled) {
          this.gameboy.matchLYC(); //Get the compare of the first scan line.
        }
      }
    };
    //WY
    this.gameboy.highMemoryWriter[0x4a] = this.gameboy.memoryWriter[0xff4a] = (address: number, data: number) => {
      if (this.gameboy.windowY != data) {
        this.gameboy.midScanLineJIT();
        this.gameboy.windowY = data;
      }
    };
    //WX
    this.gameboy.highMemoryWriter[0x4b] = this.gameboy.memoryWriter[0xff4b] = (address: number, data: number) => {
      if (this.gameboy.memory[0xff4b] != data) {
        this.gameboy.midScanLineJIT();
        this.gameboy.memory[0xff4b] = data;
        this.gameboy.windowX = data - 7;
      }
    };
    this.gameboy.highMemoryWriter[0x72] = this.gameboy.memoryWriter[0xff72] = (address: number, data: number) => {
      this.gameboy.memory[0xff72] = data;
    };
    this.gameboy.highMemoryWriter[0x73] = this.gameboy.memoryWriter[0xff73] = (address: number, data: number) => {
      this.gameboy.memory[0xff73] = data;
    };
    this.gameboy.highMemoryWriter[0x75] = this.gameboy.memoryWriter[0xff75] = (address: number, data: number) => {
      this.gameboy.memory[0xff75] = data;
    };
    this.gameboy.highMemoryWriter[0x76] = this.gameboy.memoryWriter[0xff76] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0x77] = this.gameboy.memoryWriter[0xff77] = this.writeIllegal;
    this.gameboy.highMemoryWriter[0xff] = this.gameboy.memoryWriter[MemoryLayout.interruptEnableAddress] = (address: number, data: number) => {
      this.gameboy.interruptEnabledFlags = data;
      this.gameboy.checkIRQMatching();
    };
    this.recompileModelSpecificIOWriteHandling();
    this.updateIORegisters();
  }

  recompileModelSpecificIOWriteHandling() {
    if (this.gameboy.cartridge.useGbcMode) {
      // GameBoy Color Specific I/O:
      // SC (Serial Transfer Control Register)
      this.gameboy.highMemoryWriter[0x2] = this.gameboy.memoryWriter[MemoryLayout.serialControlAddress] = (address: number, data: number) => {
        if ((data & 0x1) === 0x1) {
          // Internal clock:
          this.gameboy.memory[MemoryLayout.serialControlAddress] = data & 0x7f;
          this.gameboy.serialTimer = (data & 0x2) === 0 ? 4096 : 128; //Set the Serial IRQ counter.
          this.gameboy.serialShiftTimer = this.gameboy.serialShiftTimerAllocated = (data & 0x2) === 0 ? 512 : 16; //Set the transfer data shift counter.
        } else {
          // External clock:
          this.gameboy.memory[MemoryLayout.serialControlAddress] = data;
          this.gameboy.serialShiftTimer = this.gameboy.serialShiftTimerAllocated = this.gameboy.serialTimer = 0; //Zero the timers, since we're emulating as if nothing is connected.
        }
      };
      this.gameboy.highMemoryWriter[0x40] = this.gameboy.memoryWriter[0xff40] = (address: number, data: number) => {
        if (this.gameboy.memory[0xff40] !== data) {
          this.gameboy.midScanLineJIT();
          const isLcdOn = data > 0x7f;
          if (isLcdOn !== this.gameboy.gpu.lcdEnabled) {
            // When the display mode changes...
            this.gameboy.gpu.lcdEnabled = isLcdOn;
            this.gameboy.memory[0xff41] &= 0x78;
            this.gameboy.midScanlineOffset = -1;
            this.gameboy.cpu.totalLinesPassed = this.gameboy.currentX = this.gameboy.queuedScanLines = this.gameboy.lastUnrenderedLine = this.gameboy.STATTracker = this.gameboy.LCDTicks = this.gameboy.actualScanLine = this.gameboy.memory[0xff44] = 0;
            if (this.gameboy.gpu.lcdEnabled) {
              this.gameboy.modeSTAT = 2;
              this.gameboy.matchLYC(); // Get the compare of the first scan line.
              this.gameboy.gpu.enableLCD();
            } else {
              this.gameboy.modeSTAT = 0;
              this.gameboy.gpu.disableLCD();
              this.gameboy.lcdDevice.DisplayShowOff();
            }
            this.gameboy.interruptRequestedFlags &= 0xfd;
          }
          this.gameboy.gfxWindowCHRBankPosition = (data & 0x40) === 0x40 ? 0x400 : 0;
          this.gameboy.gfxWindowDisplay = (data & 0x20) === 0x20;
          this.gameboy.gfxBackgroundBankOffset = (data & 0x10) === 0x10 ? 0 : 0x80;
          this.gameboy.gfxBackgroundCHRBankPosition = (data & 0x08) === 0x08 ? 0x400 : 0;
          this.gameboy.gfxSpriteNormalHeight = (data & 0x04) === 0;
          this.gameboy.gfxSpriteShow = (data & 0x02) === 0x02;
          this.gameboy.hasBGPriority = (data & 0x01) === 0x01;
          this.gameboy.priorityFlaggingPathRebuild(); // Special case the priority flagging as an optimization.
          this.gameboy.memory[0xff40] = data;
        }
      };
      this.gameboy.highMemoryWriter[0x41] = this.gameboy.memoryWriter[0xff41] = (address: number, data: number) => {
        this.gameboy.LYCMatchTriggerSTAT = (data & 0x40) === 0x40;
        this.gameboy.mode2TriggerSTAT = (data & 0x20) === 0x20;
        this.gameboy.mode1TriggerSTAT = (data & 0x10) === 0x10;
        this.gameboy.mode0TriggerSTAT = (data & 0x08) === 0x08;
        this.gameboy.memory[0xff41] = data & 0x78;
      };
      this.gameboy.highMemoryWriter[0x46] = this.gameboy.memoryWriter[0xff46] = (address: number, data: number) => {
        this.gameboy.memory[0xff46] = data;
        if (data < 0xe0) {
          data <<= 8;
          address = 0xfe00;
          var stat = this.gameboy.modeSTAT;
          this.gameboy.modeSTAT = 0;
          var newData = 0;
          do {
            newData = this.gameboy.memoryRead(data++);
            if (newData != this.gameboy.memory[address]) {
              // JIT the graphics render queue:
              this.gameboy.modeSTAT = stat;
              this.gameboy.graphicsJIT();
              this.gameboy.modeSTAT = 0;
              this.gameboy.memory[address++] = newData;
              break;
            }
          } while (++address < 0xfea0);
          if (address < 0xfea0) {
            do {
              this.gameboy.memory[address++] = this.gameboy.memoryRead(data++);
              this.gameboy.memory[address++] = this.gameboy.memoryRead(data++);
              this.gameboy.memory[address++] = this.gameboy.memoryRead(data++);
              this.gameboy.memory[address++] = this.gameboy.memoryRead(data++);
            } while (address < 0xfea0);
          }
          this.gameboy.modeSTAT = stat;
        }
      };
      //KEY1
      this.gameboy.highMemoryWriter[0x4d] = this.gameboy.memoryWriter[0xff4d] = (address: number, data: number) => {
        this.gameboy.memory[0xff4d] = data & 0x7f | this.gameboy.memory[0xff4d] & 0x80;
      };
      this.gameboy.highMemoryWriter[0x4f] = this.gameboy.memoryWriter[0xff4f] = (address: number, data: number) => {
        this.gameboy.currVRAMBank = data & 0x01;
        if (this.gameboy.currVRAMBank > 0) {
          this.gameboy.BGCHRCurrentBank = this.gameboy.BGCHRBank2;
        } else {
          this.gameboy.BGCHRCurrentBank = this.gameboy.BGCHRBank1;
        }

        //Only writable by GBC.
      };
      this.gameboy.highMemoryWriter[0x51] = this.gameboy.memoryWriter[0xff51] = (address: number, data: number) => {
        if (!this.gameboy.hdmaRunning) {
          this.gameboy.memory[0xff51] = data;
        }
      };
      this.gameboy.highMemoryWriter[0x52] = this.gameboy.memoryWriter[0xff52] = (address: number, data: number) => {
        if (!this.gameboy.hdmaRunning) {
          this.gameboy.memory[0xff52] = data & 0xf0;
        }
      };
      this.gameboy.highMemoryWriter[0x53] = this.gameboy.memoryWriter[0xff53] = (address: number, data: number) => {
        if (!this.gameboy.hdmaRunning) {
          this.gameboy.memory[0xff53] = data & 0x1f;
        }
      };
      this.gameboy.highMemoryWriter[0x54] = this.gameboy.memoryWriter[0xff54] = (address: number, data: number) => {
        if (!this.gameboy.hdmaRunning) {
          this.gameboy.memory[0xff54] = data & 0xf0;
        }
      };
      this.gameboy.highMemoryWriter[0x55] = this.gameboy.memoryWriter[0xff55] = (address: number, data: number) => {
        if (!this.gameboy.hdmaRunning) {
          if ((data & 0x80) === 0) {
            //DMA
            this.gameboy.writeDirectlyToMemory((data & 0x7f) + 1);
            this.gameboy.memory[0xff55] = 0xff; //Transfer completed.
          } else {
            //H-Blank DMA
            this.gameboy.hdmaRunning = true;
            this.gameboy.memory[0xff55] = data & 0x7f;
          }
        } else if ((data & 0x80) === 0) {
          //Stop H-Blank DMA
          this.gameboy.hdmaRunning = false;
          this.gameboy.memory[0xff55] |= 0x80;
        } else {
          this.gameboy.memory[0xff55] = data & 0x7f;
        }
      };
      this.gameboy.highMemoryWriter[0x68] = this.gameboy.memoryWriter[0xff68] = (address: number, data: number) => {
        this.gameboy.memory[0xff69] = this.gameboy.gbcBGRawPalette[data & 0x3f];
        this.gameboy.memory[0xff68] = data;
      };
      this.gameboy.highMemoryWriter[0x69] = this.gameboy.memoryWriter[0xff69] = (address: number, data: number) => {
        this.gameboy.updateGBCBGPalette(this.gameboy.memory[0xff68] & 0x3f, data);
        if (this.gameboy.memory[0xff68] > 0x7f) {
          // high bit = autoincrement
          var next = this.gameboy.memory[0xff68] + 1 & 0x3f;
          this.gameboy.memory[0xff68] = next | 0x80;
          this.gameboy.memory[0xff69] = this.gameboy.gbcBGRawPalette[next];
        } else {
          this.gameboy.memory[0xff69] = data;
        }
      };
      this.gameboy.highMemoryWriter[0x6a] = this.gameboy.memoryWriter[0xff6a] = (address: number, data: number) => {
        this.gameboy.memory[0xff6b] = this.gameboy.gbcOBJRawPalette[data & 0x3f];
        this.gameboy.memory[0xff6a] = data;
      };
      this.gameboy.highMemoryWriter[0x6b] = this.gameboy.memoryWriter[0xff6b] = (address: number, data: number) => {
        this.gameboy.updateGBCOBJPalette(this.gameboy.memory[0xff6a] & 0x3f, data);
        if (this.gameboy.memory[0xff6a] > 0x7f) {
          // high bit = autoincrement
          var next = this.gameboy.memory[0xff6a] + 1 & 0x3f;
          this.gameboy.memory[0xff6a] = next | 0x80;
          this.gameboy.memory[0xff6b] = this.gameboy.gbcOBJRawPalette[next];
        } else {
          this.gameboy.memory[0xff6b] = data;
        }
      };
      //SVBK
      this.gameboy.highMemoryWriter[0x70] = this.gameboy.memoryWriter[0xff70] = (address: number, data: number) => {
        var addressCheck = this.gameboy.memory[0xff51] << 8 | this.gameboy.memory[0xff52]; //Cannot change the RAM bank while WRAM is the source of a running HDMA.
        if (!this.gameboy.hdmaRunning || addressCheck < 0xd000 || addressCheck >= 0xe000) {
          this.gameboy.gbcRamBank = Math.max(data & 0x07, 1); //Bank range is from 1-7
          this.gameboy.gbcRamBankPosition = (this.gameboy.gbcRamBank - 1 << 12) - 0xd000;
          this.gameboy.gbcRamBankPositionECHO = this.gameboy.gbcRamBankPosition - 0x2000;
        }
        this.gameboy.memory[0xff70] = data; //Bit 6 cannot be written to.
      };
      this.gameboy.highMemoryWriter[0x74] = this.gameboy.memoryWriter[0xff74] = (address: number, data: number) => {
        this.gameboy.memory[0xff74] = data;
      };
    } else {
      //Fill in the GameBoy Color I/O registers as normal RAM for GameBoy compatibility:
      //SC (Serial Transfer Control Register)
      this.gameboy.highMemoryWriter[0x2] = this.gameboy.memoryWriter[MemoryLayout.serialControlAddress] = (address: number, data: number) => {
        if ((data & 0x1) === 0x1) {
          //Internal clock:
          this.gameboy.memory[MemoryLayout.serialControlAddress] = data & 0x7f;
          this.gameboy.serialTimer = 4096; //Set the Serial IRQ counter.
          this.gameboy.serialShiftTimer = this.gameboy.serialShiftTimerAllocated = 512; //Set the transfer data shift counter.
        } else {
          //External clock:
          this.gameboy.memory[MemoryLayout.serialControlAddress] = data;
          this.gameboy.serialShiftTimer = this.gameboy.serialShiftTimerAllocated = this.gameboy.serialTimer = 0; //Zero the timers, since we're emulating as if nothing is connected.
        }
      };
      this.gameboy.highMemoryWriter[0x40] = this.gameboy.memoryWriter[0xff40] = (address: number, data: number) => {
        if (this.gameboy.memory[0xff40] != data) {
          this.gameboy.midScanLineJIT();
          const newState = data > 0x7f;
          if (newState !== this.gameboy.gpu.lcdEnabled) {
            // When the display mode changes...
            this.gameboy.gpu.lcdEnabled = newState;
            this.gameboy.memory[0xff41] &= 0x78;
            this.gameboy.midScanlineOffset = -1;
            this.gameboy.cpu.totalLinesPassed = this.gameboy.currentX = this.gameboy.queuedScanLines = this.gameboy.lastUnrenderedLine = this.gameboy.STATTracker = this.gameboy.LCDTicks = this.gameboy.actualScanLine = this.gameboy.memory[0xff44] = 0;
            if (this.gameboy.gpu.lcdEnabled) {
              this.gameboy.modeSTAT = 2;
              this.gameboy.matchLYC(); // Get the compare of the first scan line.
              this.gameboy.gpu.enableLCD();
            } else {
              this.gameboy.modeSTAT = 0;
              this.gameboy.gpu.disableLCD();
              this.gameboy.lcdDevice.DisplayShowOff();
            }
            this.gameboy.interruptRequestedFlags &= 0xfd;
          }
          this.gameboy.gfxWindowCHRBankPosition = (data & 0x40) === 0x40 ? 0x400 : 0;
          this.gameboy.gfxWindowDisplay = (data & 0x20) === 0x20;
          this.gameboy.gfxBackgroundBankOffset = (data & 0x10) === 0x10 ? 0 : 0x80;
          this.gameboy.gfxBackgroundCHRBankPosition = (data & 0x08) === 0x08 ? 0x400 : 0;
          this.gameboy.gfxSpriteNormalHeight = (data & 0x04) === 0;
          this.gameboy.gfxSpriteShow = (data & 0x02) === 0x02;
          this.gameboy.bgEnabled = (data & 0x01) === 0x01;
          this.gameboy.memory[0xff40] = data;
        }
      };
      this.gameboy.highMemoryWriter[0x41] = this.gameboy.memoryWriter[0xff41] = (address: number, data: number) => {
        this.gameboy.LYCMatchTriggerSTAT = (data & 0x40) === 0x40;
        this.gameboy.mode2TriggerSTAT = (data & 0x20) === 0x20;
        this.gameboy.mode1TriggerSTAT = (data & 0x10) === 0x10;
        this.gameboy.mode0TriggerSTAT = (data & 0x08) === 0x08;
        this.gameboy.memory[0xff41] = data & 0x78;
        if ((!this.gameboy.usedBootRom || !this.gameboy.usedGbcBootRom) && this.gameboy.gpu.lcdEnabled && this.gameboy.modeSTAT < 2) {
          this.gameboy.interruptRequestedFlags |= 0x2;
          this.gameboy.checkIRQMatching();
        }
      };
      this.gameboy.highMemoryWriter[0x46] = this.gameboy.memoryWriter[0xff46] = (address: number, data: number) => {
        this.gameboy.memory[0xff46] = data;
        if (data > 0x7f && data < 0xe0) {
          //DMG cannot DMA from the ROM banks.
          data <<= 8;
          address = 0xfe00;
          var stat = this.gameboy.modeSTAT;
          this.gameboy.modeSTAT = 0;
          var newData = 0;
          do {
            newData = this.gameboy.memoryRead(data++);
            if (newData != this.gameboy.memory[address]) {
              //JIT the graphics render queue:
              this.gameboy.modeSTAT = stat;
              this.gameboy.graphicsJIT();
              this.gameboy.modeSTAT = 0;
              this.gameboy.memory[address++] = newData;
              break;
            }
          } while (++address < 0xfea0);
          if (address < 0xfea0) {
            do {
              this.gameboy.memory[address++] = this.gameboy.memoryRead(data++);
              this.gameboy.memory[address++] = this.gameboy.memoryRead(data++);
              this.gameboy.memory[address++] = this.gameboy.memoryRead(data++);
              this.gameboy.memory[address++] = this.gameboy.memoryRead(data++);
            } while (address < 0xfea0);
          }
          this.gameboy.modeSTAT = stat;
        }
      };
      this.gameboy.highMemoryWriter[0x47] = this.gameboy.memoryWriter[0xff47] = (address: number, data: number) => {
        if (this.gameboy.memory[0xff47] != data) {
          this.gameboy.midScanLineJIT();
          this.gameboy.updateGBBGPalette(data);
          this.gameboy.memory[0xff47] = data;
        }
      };
      this.gameboy.highMemoryWriter[0x48] = this.gameboy.memoryWriter[0xff48] = (address: number, data: number) => {
        if (this.gameboy.memory[0xff48] != data) {
          this.gameboy.midScanLineJIT();
          this.gameboy.updateGBOBJPalette(0, data);
          this.gameboy.memory[0xff48] = data;
        }
      };
      this.gameboy.highMemoryWriter[0x49] = this.gameboy.memoryWriter[0xff49] = (address: number, data: number) => {
        if (this.gameboy.memory[0xff49] != data) {
          this.gameboy.midScanLineJIT();
          this.gameboy.updateGBOBJPalette(4, data);
          this.gameboy.memory[0xff49] = data;
        }
      };
      this.gameboy.highMemoryWriter[0x4d] = this.gameboy.memoryWriter[0xff4d] = (address: number, data: number) => {
        this.gameboy.memory[0xff4d] = data;
      };
      this.gameboy.highMemoryWriter[0x4f] = this.gameboy.memoryWriter[0xff4f] = this.writeIllegal; // Not writable in DMG mode.
      this.gameboy.highMemoryWriter[0x55] = this.gameboy.memoryWriter[0xff55] = this.writeIllegal;
      this.gameboy.highMemoryWriter[0x68] = this.gameboy.memoryWriter[0xff68] = this.writeIllegal;
      this.gameboy.highMemoryWriter[0x69] = this.gameboy.memoryWriter[0xff69] = this.writeIllegal;
      this.gameboy.highMemoryWriter[0x6a] = this.gameboy.memoryWriter[0xff6a] = this.writeIllegal;
      this.gameboy.highMemoryWriter[0x6b] = this.gameboy.memoryWriter[0xff6b] = this.writeIllegal;
      this.gameboy.highMemoryWriter[0x6c] = this.gameboy.memoryWriter[0xff6c] = this.writeIllegal;
      this.gameboy.highMemoryWriter[0x70] = this.gameboy.memoryWriter[0xff70] = this.writeIllegal;
      this.gameboy.highMemoryWriter[0x74] = this.gameboy.memoryWriter[0xff74] = this.writeIllegal;
    }
  }
}
