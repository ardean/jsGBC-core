import MBC from "./MBC";

export default class MBC2 extends MBC {
  writeRomBank = (address: number, data: number) => {
    // MBC2 ROM bank switching:
    this.romBank1Offset = data & 0x0f;
    this.setCurrentROMBank();
  };
}
