import MBC from "./MBC";

export default class MBC1 extends MBC {
  MBC1Mode: boolean = false; // MBC1 Type (4/32, 16/8)

  writeType = (address: number, data: number) => {
    // MBC1 mode setting:
    this.MBC1Mode = (data & 0x1) === 0x1;
    if (this.MBC1Mode) {
      this.romBank1Offset &= 0x1f;
      this.setCurrentROMBank();
    } else {
      this.currentMbcRamBank = 0;
      this.currentRamBankPosition = -0xa000;
    }
  };

  writeRomBank = (address: number, data: number) => {
    // MBC1 ROM bank switching:
    this.romBank1Offset = this.romBank1Offset & 0x60 | data & 0x1f;
    this.setCurrentROMBank();
  };

  writeRamBank = (address: number, data: number) => {
    // MBC1 RAM bank switching
    if (this.MBC1Mode) {
      // 4/32 Mode
      this.currentMbcRamBank = data & 0x03;
      this.currentRamBankPosition = (this.currentMbcRamBank << 13) - 0xa000;
    } else {
      // 16/8 Mode
      this.romBank1Offset = (data & 0x03) << 5 | this.romBank1Offset & 0x1f;
      this.setCurrentROMBank();
    }
  };

  setCurrentROMBank() {
    // Read the cartridge ROM data from RAM memory:
    switch (this.romBank1Offset) {
      case 0x00:
      case 0x20:
      case 0x40:
      case 0x60:
        // Bank calls for 0x00, 0x20, 0x40, and 0x60 are really for 0x01, 0x21, 0x41, and 0x61.
        this.currentRomBank = this.romBank1Offset % this.romBankEdge << 14;
        break;
      default:
        this.currentRomBank = this.romBank1Offset % this.romBankEdge - 1 << 14;
    }
  }
}
