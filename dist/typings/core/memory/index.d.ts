import * as util from "../../util";
import GameBoyCore from "../GameBoyCore";
export declare type WriterFunction = (address: number, value: number) => void;
export declare type ReaderFunction = (address: number) => number;
export default class Memory {
    gameboy: GameBoyCore;
    readers: ReaderFunction[];
    writers: WriterFunction[];
    data: util.TypedArray;
    constructor(gameboy: GameBoyCore, data: any);
    write(address: number, value: number): void;
    read(address: number): number;
    jumpCompile(): void;
    setReaders(from: number, to: number, reader: ReaderFunction): void;
    setReader(address: number, reader: ReaderFunction): void;
    setWriters(from: number, to: number, writer: WriterFunction): void;
    setWriter(address: number, writer: WriterFunction): void;
}
