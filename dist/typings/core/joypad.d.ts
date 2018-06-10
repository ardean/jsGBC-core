import GameBoyCore from "./GameBoyCore";
export default class Joypad {
    initialValue: number;
    value: number;
    gameboy: GameBoyCore;
    constructor(gameboy: any);
    down(key: any): void;
    up(key: any): void;
    writeToMemory(): void;
}
