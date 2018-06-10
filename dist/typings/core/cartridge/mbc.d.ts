import { EventEmitter } from "events";
import Cartridge from ".";
export default class MBC extends EventEmitter {
    currentROMBank: number;
    ROMBank1Offset: number;
    RAM: any;
    ROMBankEdge: number;
    currentMBCRAMBank: number;
    currentRAMBankPosition: number;
    MBCRAMBanksEnabled: boolean;
    romSize: number;
    ramSize: number;
    romSizes: number[];
    ramSizes: number[];
    cartridge: Cartridge;
    constructor(cartridge: Cartridge);
    setupROM(): void;
    setupRAM(): void;
    loadSRAM(data: any): void;
    getSRAM(): Uint8Array;
    cutSRAMFromBatteryFileArray(data: any): Uint8Array;
    saveState(): any;
    readRAM(address: any): any;
    writeRAM(address: any, data: any): void;
    setCurrentROMBank(): void;
    writeEnable(address: any, data: any): void;
}
