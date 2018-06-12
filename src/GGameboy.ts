import settings from "./settings";
import { stringToArrayBuffer, concatArrayBuffers, debounce, Debounced } from "./util";
import LocalStorage from "./storages/LocalStorage";
import Cartridge from "./core/cartridge/index";
import Actions from "./actions";
import { EventEmitter } from "events";
import GameBoyCore from "./core/GameBoyCore";

export default class GameBoy extends EventEmitter {
  interval: number;
  debouncedAutoSave: Debounced;
  buttons = ["right", "left", "up", "down", "a", "b", "select", "start"];
  core: GameBoyCore;
  isOn: boolean;
  actions: Actions;
  storage: LocalStorage;
  cartridge: Cartridge;
  lastRun: number;

  constructor({
    audio,
    isPaused,
    lcd,
    isSoundEnabled,
    bootRom
  }: any = {}) {
    super();

    if (typeof isSoundEnabled === "boolean") settings.soundOn = isSoundEnabled;
    if (isPaused) this.isPaused = isPaused;

    this.core = new GameBoyCore({
      audio,
      api: this,
      lcd,
      bootRom
    });

    this.debouncedAutoSave = debounce(this.autoSave.bind(this), 100);
    this.core.events.on("sramWrite", () => {
      if (!this.core.cartridge) return;
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

    const frameHandler = (now: number) => {
      if (this.isPaused()) return;

      if (!this.lastRun || this.lastRun < now - settings.runInterval) {
        this.core.run();
        this.lastRun = now;
      }

      this.requestFrame(frameHandler);
    };

    this.requestFrame(frameHandler);
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

  replaceCartridge(cartridge: Cartridge | ArrayBuffer | Uint8Array) {
    this.turnOff();
    this.removeCartridge();
    this.insertCartridge(cartridge);
    this.turnOn();
  }

  removeCartridge() {
    this.cartridge = null;
  }

  insertCartridge(cartridge: Cartridge | ArrayBuffer | Uint8Array) {
    if (!(cartridge instanceof Cartridge)) {
      cartridge = new Cartridge(cartridge);
    }

    this.cartridge = cartridge;
  }

  actionDown(action, options?) {
    this.actions.down(action, options);
  }

  actionChange(action, options) {
    this.actions.change(action, options);
  }

  actionUp(action, options?) {
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
    if (!this.core.cartridge) return;
    const name = this.core.cartridge.name;

    if (!state) {
      state = this.core.stateManager.get();
      if (!state) return false;
    }

    await this.storage.setState(name, state);
    this.emit("stateSaved", { name, state });
  }

  async saveSRAM(sram?) {
    if (!this.storage) return;
    if (!this.core.cartridge) return;
    const name = this.core.cartridge.name;

    if (!sram) {
      sram = this.core.cartridge.mbc.getSRAM();
      if (!sram) return false;
    }

    await this.storage.setSRAM(name, sram.buffer);
    this.emit("sramSaved", { name, sram });
  }

  async saveRTC(rtc?) {
    if (!this.storage) return;
    if (!this.core.cartridge) return;
    if (!this.core.cartridge.hasRTC) return;
    const name = this.core.cartridge.name;

    if (!rtc) {
      rtc = this.core.cartridge.mbc.rtc.get();
      if (!rtc) return false;
    }

    await this.storage.setRTC(name, rtc.buffer);
    this.emit("rtcSaved", { name, rtc });
  }

  loadState(state) {
    if (!this.storage) return;
    if (!this.core.cartridge) return;
    const name = this.core.cartridge.name;

    if (!state) {
      state = this.storage.findState(name);
      if (!state) return false;
    }

    this.core.loadState(state);
    this.emit("stateLoaded", { name, state });
  }

  loadSRAM(sram?) {
    if (!this.storage) return;
    if (!this.core.cartridge) return;
    const name = this.core.cartridge.name;

    if (!sram) {
      sram = this.storage.findSRAM(name);
      if (!sram) return false;
      sram = new Uint8Array(sram);
    }

    this.core.cartridge.mbc.loadSRAM(sram);
    this.emit("sramLoaded", { name, sram });
  }

  loadRTC(rtc?) {
    if (!this.storage) return;
    if (!this.core.cartridge) return;
    if (!this.core.cartridge.hasRTC) return;
    const name = this.core.cartridge.name;

    if (!rtc) {
      rtc = this.storage.findRTC(name);
      if (!rtc) return false;
      rtc = new Uint32Array(rtc);
    }

    this.core.cartridge.mbc.rtc.load(rtc);
    this.emit("rtcLoaded", { name, rtc });
  }

  getBatteryFileArrayBuffer(): ArrayBuffer {
    if (!this.core.cartridge) return null;

    const sram = this.core.cartridge.mbc.getSRAM();
    let rtc = null;
    if (this.core.cartridge.mbc.rtc) rtc = this.core.cartridge.mbc.rtc.get();

    return rtc ? concatArrayBuffers(sram.buffer, rtc.buffer) : sram.buffer;
  }

  async loadBatteryFileArrayBuffer(data: ArrayBuffer) {
    const sram = this.core.cartridge.mbc.cutSRAMFromBatteryFileArray(data);
    let rtc = null;
    if (this.core.cartridge.hasRTC) {
      rtc = this.core.cartridge.mbc.rtc.cutBatteryFileArray(data);
    }

    this.core.cartridge.mbc.loadSRAM(sram);
    if (rtc) this.core.cartridge.mbc.rtc.load(rtc);

    await this.saveSRAM(sram);
    if (rtc) await this.saveRTC(rtc);

    this.restart();
  }

  requestFrame(fn: (now: number) => void) {
    if (typeof window !== "undefined" && window.requestAnimationFrame) {
      window.requestAnimationFrame(fn);
    } else {
      const now = (typeof performance !== "undefined" ? performance : Date).now();
      setTimeout(() => fn(now), 0);
    }
  }

  // getStateFileArrayBuffer() {
  //   let array = this.core.stateManager.save();
  //   array = new Uint8Array(array);
  //   return array;
  // }
}
