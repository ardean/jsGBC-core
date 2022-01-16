export default abstract class Storage {
  getState(name: string) {
    return this.get("state-" + name);
  }

  getRam(name: string) {
    return this.get("ram-" + name);
  }

  getRtc(name: string) {
    return this.get("rtc-" + name);
  }

  setState(name: string, buffer) {
    return this.set("state-" + name, buffer);
  }

  setRam(name: string, buffer) {
    return this.set("ram-" + name, buffer);
  }

  setRtc(name: string, buffer) {
    return this.set("rtc-" + name, buffer);
  }

  abstract get(key: string): Promise<ArrayBuffer> | ArrayBuffer;
  abstract set(key: string, buffer: ArrayBuffer): Promise<void> | void;
}