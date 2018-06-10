import MBC from "./mbc";
export default class MBC7 extends MBC {
    highX: number;
    lowX: number;
    highY: number;
    lowY: number;
    applyGyroEvent(x: any, y: any): void;
    read(address: any): any;
}
