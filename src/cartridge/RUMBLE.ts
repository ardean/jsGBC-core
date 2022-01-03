import MBC5 from "./MBC5";

export default class RUMBLE extends MBC5 {
  writeRamBank = (address: number, data: number) => {
    // MBC5 RAM bank switching
    if (data & 0x08) this.emit("rumble");
    data &= 0x7;

    super.writeRamBank(address, data);
  };
}
