import MBC from "./MBC";

export default class MBC5 extends MBC {
  setCurrentROMBank() {
    // Read the cartridge ROM data from RAM memory:
    this.currentRomBank = this.romBank1Offset % this.romBankEdge - 1 << 14;
  }

  writRomBank = (address: number, data: number) => {
    // MBC5 ROM bank switching:
    this.romBank1Offset = this.romBank1Offset & 0x100 | data;
    this.setCurrentROMBank();
  };

  writeHighRomBank = (address: number, data: number) => {
    // MBC5 ROM bank switching (by least significant bit):
    this.romBank1Offset = (data & 0x01) << 8 | this.romBank1Offset & 0xff;
    this.setCurrentROMBank();
  }

  writeRamBank = (address: number, data: number) => {
    // MBC5 RAM bank switching
    this.currentMbcRamBank = data & 0xf;
    this.currentRamBankPosition = (this.currentMbcRamBank << 13) - 0xa000;
  };
}
