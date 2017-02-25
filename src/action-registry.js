import EventEmitter from "events";

export default class ActionRegistry extends EventEmitter {
  map = {};

  register(action) {
    this.map[action] = true;
    return this;
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
