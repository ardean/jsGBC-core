import EventEmitter from "events";
import settings from "../../settings.js";
import util from "../util.js";

export default class MBC extends EventEmitter {
  constructor(cartridge) {
    super();
    this.cartridge = cartridge;
    this.MBCRAMBanksEnabled = false; // MBC RAM Access Control.
    this.currentRAMBankPosition = -0xa000; // MBC Position Adder;
    this.currentMBCRAMBank = 0; // MBC Currently Indexed RAM Bank
    this.ROMBankEdge = Math.floor(cartridge.rom.length / 0x4000);
    this.numRAMBanks = 0; // How many RAM banks were actually allocated?
  }

  setupRAM() {
    // TODO: set banks amount on specific mbc type
    // Setup the auxilliary/switchable RAM:
    if (this.cartridge.hasMBC2) {
      this.numRAMBanks = 1 / 16;
    } else if (
      this.cartridge.hasMBC1 ||
      this.cartridge.cRUMBLE ||
      this.cartridge.hasMBC3 ||
      this.cartridge.cHuC3
    ) {
      this.numRAMBanks = 4;
    } else if (this.cartridge.hasMBC5) {
      this.numRAMBanks = 16;
    } else if (this.cartridge.hasSRAM) {
      this.numRAMBanks = 1;
    }

    this.allocatedRamBytes = this.numRAMBanks * 0x2000;

    console.log(
      "Actual bytes of MBC RAM allocated: 0x" +
        this.allocatedRamBytes.toString(16)
    );

    if (this.numRAMBanks > 0) {
      this.RAM = util.getTypedArray(this.allocatedRamBytes, 0, "uint8"); // Switchable RAM (Used by games for more RAM) for the main memory range 0xA000 - 0xC000.
    }
  }

  loadSRAM(data) {
    if (data.length !== this.allocatedRamBytes) return;
    this.RAM = data.slice(0);
  }

  getSRAM() {
    return new Uint8Array(this.RAM.buffer.slice(0, this.allocatedRamBytes));
  }

  cutSRAMFromBatteryFileArray(data) {
    return new Uint8Array(data.buffer.slice(0, this.allocatedRamBytes));
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
    //Read the cartridge ROM data from RAM memory:
    //Only map bank 0 to bank 1 here (MBC2 is like MBC1, but can only do 16 banks, so only the bank 0 quirk appears for MBC2):
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
