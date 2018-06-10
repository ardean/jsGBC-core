import RTC from "./rtc";
import MBC from "./mbc";
import Cartridge from ".";
export default class MBC3 extends MBC {
    rtc: RTC;
    constructor(cartridge: Cartridge);
    writeROMBank(address: any, data: any): void;
    writeRAMBank(address: any, data: any): void;
    writeRAM(address: any, data: any): void;
    readRAM(address: any): any;
}
