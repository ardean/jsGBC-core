import { EventEmitter } from "events";
import settings from "../../settings";
import * as util from "../../util";
import Cartridge from ".";
import RTC from "./rtc";

export default class MBC extends EventEmitter {
  currentROMBank: number;
  ROMBank1Offset: number;
  RAM: any;
  ROMBankEdge: number;
  currentMBCRAMBank: number;
  currentRAMBankPosition: number;
  MBCRAMBanksEnabled: boolean;
  romSize: number;
  ramSize: number;
  rtc?: RTC;

  romSizes = [
    0x00008000, // 32K
    0x00010000, // 64K
    0x00020000, // 128K
    0x00040000, // 256K
    0x00080000, // 512K
    0x00100000, // 1024K
    0x00200000, // 2048K
    0x00400000, // 4096K
    0x00800000 // 8192K
  ];

  ramSizes = [
    0x00000000, // 0K
    0x00002000, // 2K  // Changed to 2000 to avoid problems
    0x00002000, // 8K
    0x00008000, // 32K
    0x00020000, // 128K
    0x00010000 // 64K
  ];

  cartridge: Cartridge;

  constructor(cartridge: Cartridge) {
    super();
    this.cartridge = cartridge;
    this.MBCRAMBanksEnabled = false; // MBC RAM Access Control.
    this.currentRAMBankPosition = -0xa000; // MBC Position Adder;
    this.currentMBCRAMBank = 0; // MBC Currently Indexed RAM Bank
    this.ROMBankEdge = Math.floor(cartridge.rom.length / 0x4000);
  }

  setupROM() {
    this.romSize = this.romSizes[this.cartridge.romSizeType];
    console.log("ROM size 0x" + this.romSize.toString(16));
  }

  setupRAM() {
    this.ramSize = this.ramSizes[this.cartridge.ramSizeType];
    console.log("RAM size 0x" + this.ramSize.toString(16));
    this.RAM = util.getTypedArray(this.ramSize, 0, "uint8"); // Switchable RAM (Used by games for more RAM) for the main memory range 0xA000 - 0xC000.
  }

  loadSRAM(data: Uint8Array) {
    if (data.byteLength !== this.ramSize) return;
    this.RAM = data.slice(0);
  }

  getSRAM() {
    return new Uint8Array(this.RAM.buffer.slice(0, this.ramSize));
  }

  cutSRAMFromBatteryFileArray(data: ArrayBuffer) {
    return new Uint8Array(data.slice(0, this.ramSize));
  }

  saveState() {
    // TODO: remove after state refactor
    if (!this.cartridge.hasBattery || this.RAM.length === 0) return; // No battery backup...

    // return the MBC RAM for backup...
    return util.fromTypedArray(this.RAM);
  }

  readRAM(address) {
    // Switchable RAM
    if (this.MBCRAMBanksEnabled || settings.alwaysAllowRWtoBanks) {
      return this.RAM[address + this.currentRAMBankPosition];
    }
    //console.log("Reading from disabled RAM.");
    return 0xff;
  }

  writeRAM(address, data) {
    if (this.MBCRAMBanksEnabled || settings.alwaysAllowRWtoBanks) {
      this.emit("ramWrite");
      this.RAM[address + this.currentRAMBankPosition] = data;
    }
  }

  // TODO: for MBC2 & MBC3, compare with other MBCx
  setCurrentROMBank() {
    // Read the cartridge ROM data from RAM memory:
    // Only map bank 0 to bank 1 here (MBC2 is like MBC1, but can only do 16 banks, so only the bank 0 quirk appears for MBC2):
    this.currentROMBank = Math.max(
      this.ROMBank1Offset % this.ROMBankEdge - 1,
      0
    ) << 14;
  }

  writeEnable(address, data) {
    // MBC RAM Bank Enable/Disable:
    this.MBCRAMBanksEnabled = (data & 0x0f) === 0x0a; // If lower nibble is 0x0A, then enable, otherwise disable.
  }
}
