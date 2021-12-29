export default class Storage {
  memory = {};

  getState(name: string) {
    return this.get("state-" + name);
  }

  getSRAM(name: string) {
    return this.get("sram-" + name);
  }

  getRTC(name: string) {
    return this.get("rtc-" + name);
  }

  setState(name: string, buffer) {
    return this.set("state-" + name, buffer);
  }

  setSRAM(name: string, buffer) {
    return this.set("sram-" + name, buffer);
  }

  setRTC(name: string, buffer) {
    return this.set("rtc-" + name, buffer);
  }

  get(name: string) {
    return this.memory[name];
  }

  set(name: string, buffer) {
    this.memory[name] = buffer;
  }
}