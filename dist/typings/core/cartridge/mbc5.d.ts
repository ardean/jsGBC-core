import MBC from "./mbc";
export default class MBC5 extends MBC {
    setCurrentROMBank(): void;
    writeROMBankLow(address: any, data: any): void;
    writeROMBankHigh(address: any, data: any): void;
    writeRAMBank(address: number, value: number): void;
}
