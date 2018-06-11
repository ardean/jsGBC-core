import MBC5 from "./mbc5";

export default class RUMBLE extends MBC5 {
  writeRAMBank(address, data) {
    // MBC5 RAM bank switching
    // Like MBC5, but bit 3 of the lower nibble is used for rumbling and bit 2 is ignored.
    // console.log((data & 0x03).toString(2));
    this.currentMBCRAMBank = data & 0x03;
    this.currentRAMBankPosition = (this.currentMBCRAMBank << 13) - 0xa000;
    if ((data & 0x03) === 0) this.emit("rumble");
  }
}
