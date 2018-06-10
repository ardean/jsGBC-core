import MBC from "./mbc";
export default class MBC1 extends MBC {
    MBC1Mode: boolean;
    writeType(address: any, data: any): void;
    writeROMBank(address: any, data: any): void;
    writeRAMBank(address: any, data: any): void;
    setCurrentROMBank(): void;
}
