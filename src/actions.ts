import { EventEmitter } from "events";

export default class Actions extends EventEmitter {
  map = {};

  register(action) {
    this.map[action] = true;
    return this;
  }

  getAll() {
    return Object.keys(this.map);
  }

  is(action) {
    return !!this.map[action];
  }

  down(action, options) {
    this.emit("down-" + action, options);
  }

  change(action, options) {
    this.emit("change-" + action, options);
  }

  up(action, options) {
    this.emit("up-" + action, options);
  }
}
