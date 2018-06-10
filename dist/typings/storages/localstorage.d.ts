export default class LocalStorage {
    findState(name: any): ArrayBuffer;
    findSRAM(name: any): ArrayBuffer;
    findRTC(name: any): ArrayBuffer;
    setState(name: any, buffer: any): Promise<void>;
    setSRAM(name: any, buffer: any): Promise<void>;
    setRTC(name: any, buffer: any): Promise<void>;
    find(name: any): ArrayBuffer;
    set(name: any, buffer: any): void;
}
