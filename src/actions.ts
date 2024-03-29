import { EventEmitter } from "events";

export default class Actions extends EventEmitter {
  map: { [key: string]: any; } = {};

  register(action: string) {
    this.map[action] = true;
    return this;
  }

  getAll() {
    return Object.keys(this.map);
  }

  is(action: string) {
    return !!this.map[action];
  }

  down(action: string, options) {
    this.emit("Down" + action, options);
  }

  change(action: string, options) {
    this.emit("Change" + action, options);
  }

  up(action: string, options) {
    this.emit("Up" + action, options);
  }
}
