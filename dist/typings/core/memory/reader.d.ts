import GameBoyCore from "../GameBoyCore";
export default class MemoryReader {
    data: any;
    gameboy: GameBoyCore;
    constructor({data, gameboy}: {
        data: any;
        gameboy: any;
    });
    read(address: any): any;
}
