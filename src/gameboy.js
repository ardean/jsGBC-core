import settings from "./settings.js";
import { stringToArrayBuffer, concatArrayBuffers } from "./core/util.js";
import GameBoyCore from "./core/index.js";
import LocalStorage from "./storages/localstorage.js";
import Cartridge from "./core/cartridge/index.js";
import Actions from "./actions.js";
import EventEmitter from "events";
import debounce from "debounce";

export default class GameBoy extends EventEmitter {
  buttons = ["right", "left", "up", "down", "a", "b", "select", "start"];

  constructor({
    audioContext,
    isPaused,
    lcd,
    isSoundEnabled
  } = {}) {
    super();

    if (typeof isSoundEnabled === "boolean") settings.soundOn = isSoundEnabled;
    if (isPaused) this.isPaused = isPaused;

    this.core = new GameBoyCore({
      audioContext,
      api: this,
      lcd
    });

    this.debouncedAutoSave = debounce(this.autoSave.bind(this), 100);
    this.core.events.on("sramWrite", () => {
      if (!this.core.cartridgeSlot.cartridge) return;
      this.debouncedAutoSave();
    });

    this.isOn = false;
    this.actions = new Actions();
    this.registerActions();
    if (typeof document !== "undefined") {
      this.storage = new LocalStorage();
    }
  }

  isPaused() {
    return typeof document !== "undefined" && document.hidden;
  }

  setStorage(storage) {
    this.storage = storage;
  }

  registerActions() {
    this.buttons.forEach((button, index) => {
      this.actions
        .register(button)
        .on("down-" + button, () => {
          this.core.joypad.down(index);
        })
        .on("up-" + button, () => {
          this.core.joypad.up(index);
        });
    });

    this.actions
      .register("speed")
      .on("down-speed", options => this.handleSpeed(options))
      .on("change-speed", options => this.handleSpeed(options))
      .on("up-speed", () => {
        this.setSpeed(1);
      });
  }

  handleSpeed(options) {
    let multiplier = 2;
    if (options && typeof options.value === "number") {
      multiplier = options.value * 2 + 1;
    }

    this.setSpeed(multiplier);
  }

  turnOn() {
    if (this.isOn) return;
    this.isOn = true;

    this.core.start(this.cartridge);
    this.core.stopEmulator &= 1;
    this.interval = setInterval(() => { // TODO: request animation frame & performance.now()
      if (this.isPaused()) return;
      this.core.run();
    }, settings.runInterval);
  }

  turnOff() {
    if (!this.isOn) return;
    this.isOn = false;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  restart() {
    this.turnOff();
    this.turnOn();
  }

  replaceCartridge(cartridge) {
    this.turnOff();
    this.removeCartridge();
    this.insertCartridge(cartridge);
    this.turnOn();
  }

  removeCartridge() {
    this.cartridge = null;
  }

  insertCartridge(cartridge) {
    if (!(cartridge instanceof Cartridge)) {
      cartridge = new Cartridge(cartridge);
    }

    this.cartridge = cartridge;
  }

  actionDown(action, options) {
    this.actions.down(action, options);
  }

  actionChange(action, options) {
    this.actions.change(action, options);
  }

  actionUp(action, options) {
    this.actions.up(action, options);
  }

  setSpeed(multiplier) {
    this.core.setSpeed(multiplier);
  }

  autoSave() {
    this.saveSRAM();
    this.saveRTC();
  }

  async saveState(state) {
    if (!this.storage) return;
    if (!this.core.cartridgeSlot.cartridge) return;
    const name = this.core.cartridgeSlot.cartridge.name;

    if (!state) {
      state = this.core.stateManager.get();
      if (!state) return false;
    }

    await this.storage.setState(name, state);
    this.emit("stateSaved", { name, state });
  }

  async saveSRAM(sram) {
    if (!this.storage) return;
    if (!this.core.cartridgeSlot.cartridge) return;
    const name = this.core.cartridgeSlot.cartridge.name;

    if (!sram) {
      sram = this.core.cartridgeSlot.cartridge.mbc.getSRAM();
      if (!sram) return false;
    }

    await this.storage.setSRAM(name, sram.buffer);
    this.emit("sramSaved", { name, sram });
  }

  async saveRTC(rtc) {
    if (!this.storage) return;
    if (!this.core.cartridgeSlot.cartridge) return;
    if (!this.core.cartridgeSlot.cartridge.hasRTC) return;
    const name = this.core.cartridgeSlot.cartridge.name;

    if (!rtc) {
      rtc = this.core.cartridgeSlot.cartridge.mbc.rtc.get();
      if (!rtc) return false;
    }

    await this.storage.setRTC(name, rtc.buffer);
    this.emit("rtcSaved", { name, rtc });
  }

  loadState(state) {
    if (!this.storage) return;
    if (!this.core.cartridgeSlot.cartridge) return;
    const name = this.core.cartridgeSlot.cartridge.name;

    if (!state) {
      state = this.storage.findState(name);
      if (!state) return false;
    }

    this.core.loadState(state);
    this.emit("stateLoaded", { name, state });
  }

  loadSRAM(sram) {
    if (!this.storage) return;
    if (!this.core.cartridgeSlot.cartridge) return;
    const name = this.core.cartridgeSlot.cartridge.name;

    if (!sram) {
      sram = this.storage.findSRAM(name);
      if (!sram) return false;
      sram = new Uint8Array(sram);
    }

    this.core.cartridgeSlot.cartridge.mbc.loadSRAM(sram);
    this.emit("sramLoaded", { name, sram });
  }

  loadRTC(rtc) {
    if (!this.storage) return;
    if (!this.core.cartridgeSlot.cartridge) return;
    if (!this.core.cartridgeSlot.cartridge.hasRTC) return;
    const name = this.core.cartridgeSlot.cartridge.name;

    if (!rtc) {
      rtc = this.storage.findRTC(name);
      if (!rtc) return false;
      rtc = new Uint32Array(rtc);
    }

    this.core.cartridgeSlot.cartridge.mbc.rtc.load(rtc);
    this.emit("rtcLoaded", { name, rtc });
  }

  getBatteryFileArrayBuffer() {
    if (!this.core.cartridgeSlot.cartridge) return;

    const sram = this.core.cartridgeSlot.cartridge.mbc.getSRAM();
    let rtc = null;
    if (this.core.cartridgeSlot.cartridge.mbc.rtc) rtc = this.core.cartridgeSlot.cartridge.mbc.rtc.get();

    return rtc ? concatArrayBuffers(sram.buffer, rtc.buffer) : sram.buffer;
  }

  async loadBatteryFileArrayBuffer(data) {
    if (typeof data === "string") {
      data = stringToArrayBuffer(data);
    }

    const sram = this.core.cartridgeSlot.cartridge.mbc.cutSRAMFromBatteryFileArray(
      data
    );
    let rtc = null;
    if (this.core.cartridgeSlot.cartridge.hasRTC) {
      rtc = this.core.cartridgeSlot.cartridge.mbc.rtc.cutBatteryFileArray(data);
    }

    this.core.cartridgeSlot.cartridge.mbc.loadSRAM(sram);
    if (rtc) this.core.cartridgeSlot.cartridge.mbc.rtc.load(rtc);

    await this.saveSRAM(sram);
    if (rtc) await this.saveRTC(rtc);

    this.restart();
  }

  // getStateFileArrayBuffer() {
  //   let array = this.core.stateManager.save();
  //   array = new Uint8Array(array);
  //   return array;
  // }
}
