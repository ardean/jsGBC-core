import { EventEmitter } from "events";
export default class Actions extends EventEmitter {
    map: {};
    register(action: any): this;
    getAll(): string[];
    is(action: any): boolean;
    down(action: any, options: any): void;
    change(action: any, options: any): void;
    up(action: any, options: any): void;
}
