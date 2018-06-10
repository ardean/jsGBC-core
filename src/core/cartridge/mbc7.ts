import MBC from "./mbc";
import settings from "../../settings";

export default class MBC7 extends MBC {
  // Gyro
  highX: number = 127;
  lowX: number = 127;
  highY: number = 127;
  lowY: number = 127;

  applyGyroEvent(x, y) {
    x *= -100;
    x += 2047;
    this.highX = x >> 8;
    this.lowX = x & 0xff;
    y *= -100;
    y += 2047;
    this.highY = y >> 8;
    this.lowY = y & 0xff;
  }

  read(address) {
    // Switchable RAM
    if (this.MBCRAMBanksEnabled || settings.alwaysAllowRWtoBanks) {
      switch (address) {
        case 0xa000:
        case 0xa060:
        case 0xa070:
          return 0;
        case 0xa080:
          // TODO: Gyro Control Register
          return 0;
        case 0xa050:
          // Y High Byte
          return this.highY;
        case 0xa040:
          // Y Low Byte
          return this.lowY;
        case 0xa030:
          // X High Byte
          return this.highX;
        case 0xa020:
          // X Low Byte:
          return this.lowX;
        default:
          return this.RAM[address + this.currentRAMBankPosition];
      }
    }

    // console.log("Reading from disabled RAM.", 1);

    return 0xff;
  }
}
