export default class ROM {
    data: Uint8Array;
    constructor(data: Uint8Array | ArrayBuffer);
    getByte(index: number): number;
    getChar(index: number): string;
    getString(from: number, to: number): string;
    readonly length: number;
}
