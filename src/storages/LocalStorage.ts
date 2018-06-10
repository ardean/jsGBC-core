export default class LocalStorage {
  findState(name) {
    return this.find("state-" + name);
  }

  findSRAM(name) {
    return this.find("sram-" + name);
  }

  findRTC(name) {
    return this.find("rtc-" + name);
  }

  async setState(name, buffer) {
    return await this.set("state-" + name, buffer);
  }

  async setSRAM(name, buffer) {
    return await this.set("sram-" + name, buffer);
  }

  async setRTC(name, buffer) {
    return await this.set("rtc-" + name, buffer);
  }

  find(name) {
    const data = window.localStorage.getItem(name);
    return base64ToArrayBuffer(data);
  }

  set(name, buffer) {
    const data = arrayBufferToBase64(buffer);
    window.localStorage.setItem(name, data);
  }
}

function base64ToArrayBuffer(data) {
  if (!data || data.length <= 0) return null;

  data = atob(data);
  const array = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    array[i] = data.charCodeAt(i);
  }
  return array.buffer;
}

function arrayBufferToBase64(array) {
  if (!array || array.length <= 0) return null;

  array = new Uint8Array(array);
  let data = "";
  for (let i = 0; i < array.byteLength; i++) {
    data += String.fromCharCode(array[i]);
  }

  return btoa(data);
}