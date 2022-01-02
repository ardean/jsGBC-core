import RTC from "./RTC";
import MBC from "./MBC";
import Cartridge from "./Cartridge";

export default class MBC3 extends MBC {
  rtc: RTC;

  constructor(cartridge: Cartridge) {
    super(cartridge);

    this.rtc = new RTC(this);
  }

  writeRomBank = (address: number, data: number) => {
    // MBC3 ROM bank switching:
    this.romBank1Offset = data & 0x7f;
    this.setCurrentROMBank();
  };

  writeRamBank = (address: number, data: number) => {
    this.currentMbcRamBank = data;
    if (data < 4) {
      // MBC3 RAM bank switching
      this.currentRamBankPosition = (this.currentMbcRamBank << 13) - 0xa000;
    }
  };

  writeHuc3RamBank = (address: number, data: number) => {
    // HuC3 RAM bank switching
    this.cartridge.mbc.currentMbcRamBank = data & 0x03;
    this.cartridge.mbc.currentRamBankPosition = (this.cartridge.mbc.currentMbcRamBank << 13) - 0xa000;
  };

  writeRam = (address: number, data: number) => {
    if (!this.ramBanksEnabled) return;

    switch (this.currentMbcRamBank) {
      case 0x00:
      case 0x01:
      case 0x02:
      case 0x03:
        this.emit("ramWrite");
        this.ram[address + this.currentRamBankPosition] = data;
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
        console.log("Invalid MBC3 bank address selected: " + this.currentMbcRamBank);
    }
  };

  readRam(address: number) {
    if (!this.ramBanksEnabled) return 0xFF;

    switch (this.currentMbcRamBank) {
      case 0x00:
      case 0x01:
      case 0x02:
      case 0x03:
        return this.ram[address + this.currentRamBankPosition];
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
}
