import GameBoyCore from "../GameBoyCore";
export default class MemoryWriter {
    data: any;
    gameboy: GameBoyCore;
    constructor({data, gameboy}: {
        data: any;
        gameboy: any;
    });
    write(address: any, data: any): any;
}
