import GameBoyCore from "./GameBoyCore";
export default class StateManager {
    gameboy: GameBoyCore;
    constructor(gameboy: any);
    init(): void;
    get(): ArrayBuffer;
    load(state: any): void;
    loadOld(state: any): void;
}
