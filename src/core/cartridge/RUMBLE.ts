import MBC5 from "./mbc5";

export default class RUMBLE extends MBC5 {
  writeRAMBank(address: number, data: number) {
    // MBC5 RAM bank switching
    if (data & 0x08) this.emit("rumble");
    data &= 0x7;

    super.writeRAMBank(address, data);
  }
}
