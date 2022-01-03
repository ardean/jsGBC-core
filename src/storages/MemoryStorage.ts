import Storage from "./Storage";

export default class MemoryStorage extends Storage {
  memory = {};

  get(name: string) {
    return this.memory[name];
  }

  set(name: string, buffer) {
    this.memory[name] = buffer;
  }
}