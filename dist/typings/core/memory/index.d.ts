import MemoryWriter from "./writer";
import MemoryReader from "./reader";
import * as util from "../../util";
import GameBoyCore from "../GameBoyCore";
export default class Memory {
    gameboy: GameBoyCore;
    writer: MemoryWriter;
    reader: MemoryReader;
    data: util.TypedArray;
    constructor(gameboy: any);
    write(address: any, data: any): any;
    read(address: any): any;
}
