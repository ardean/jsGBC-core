import RTC from "./RTC_";
import MBC from "./MBC_";
import Cartridge from "./Cartridge_";

export default class MBC3 extends MBC {
  rtc: RTC;

  constructor(cartridge: Cartridge) {
    super(cartridge);

    this.rtc = new RTC(this);
  }

  writeROMBank(address: number, data: number) {
    // MBC3 ROM bank switching:
    this.ROMBank1Offset = data & 0x7f;
    this.setCurrentROMBank();
  }

  writeRAMBank(address: number, data: number) {
    this.currentMBCRAMBank = data;
    if (data < 4) {
      // MBC3 RAM bank switching
      this.currentRAMBankPosition = (this.currentMBCRAMBank << 13) - 0xa000;
    }
  }

  writeRam = (address: number, data: number) => {
    if (this.ramBanksEnabled) {
      switch (this.currentMBCRAMBank) {
        case 0x00:
        case 0x01:
        case 0x02:
        case 0x03:
          this.emit("ramWrite");
          this.ram[address + this.currentRAMBankPosition] = data;
          break;
        case 0x08:
          this.rtc?.writeSeconds(data);
          break;
        case 0x09:
          this.rtc?.writeMinutes(data);
          break;
        case 0x0a:
          this.rtc?.writeHours(data);
          break;
        case 0x0b:
          this.rtc?.writeDaysLow(data);
          break;
        case 0x0c:
          this.rtc?.writeDaysHigh(data);
          break;
        default:
          console.log("Invalid MBC3 bank address selected: " + this.currentMBCRAMBank);
      }
    }
  };

  readRam(address: number) {
    if (this.ramBanksEnabled) {
      switch (this.currentMBCRAMBank) {
        case 0x00:
        case 0x01:
        case 0x02:
        case 0x03:
          return this.ram[address + this.currentRAMBankPosition];
        case 0x08:
          if (this.rtc) return this.rtc.readSeconds();
          break;
        case 0x09:
          if (this.rtc) return this.rtc.readMinutes();
          break;
        case 0x0a:
          if (this.rtc) return this.rtc.readHours();
          break;
        case 0x0b:
          if (this.rtc) return this.rtc.readDaysLow();
          break;
        case 0x0c:
          if (this.rtc) return this.rtc.readDaysHigh();
          break;
      }
    }

    return 0xff;
  }
}
