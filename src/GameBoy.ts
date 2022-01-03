import CPU from "./CPU";
import ROM from "./ROM";
import LCD from "./LCD";
import Joypad from "./Joypad";
import * as util from "./util";
import Actions from "./actions";
import settings from "./settings";
import tickTable from "./tickTable";
import Memory from "./memory/Memory";
import { EventEmitter } from "events";
import Storage from "./storages/Storage";
import StateManager from "./StateManager";
import AudioDevice from "./audio/AudioDevice";
import Cartridge from "./cartridge/Cartridge";
import * as MemoryLayout from "./memory/Layout";
import GPU, { totalScanlineCount } from "./GPU";
import postBootRomState from "./postBootRomState";
import mainInstructions from "./MainInstructions";
import LocalStorage from "./storages/LocalStorage";
import MemoryStorage from "./storages/MemoryStorage";
import AudioController from "./audio/AudioController";
import { concatArrayBuffers, debounce, Debounced } from "./util";

export type Action = (
  "Start" | "Select" |
  "A" | "B" |
  "Up" | "Down" | "Left" | "Right"
);

export const actions: Action[] = [
  "Right", "Left",
  "Up", "Down",
  "A", "B",
  "Select", "Start"
];

export default class GameBoy extends EventEmitter {
  interval: number;
  debouncedAutoSave: Debounced;
  core: GameBoy;
  isOn: boolean;
  actions: Actions;
  storage: Storage;
  cartridge: Cartridge;
  lastRun: number;

  // Graphics Variables
  midScanlineOffset = -1; //mid-scanline rendering offset.
  currentX = 0; //The x-coord we left off at for mid-scanline rendering.

  stopEmulator = 3; // Has the emulation been paused or a frame has ended?
  matchedIrqLines = 0; // CPU IRQ assertion.

  ROMBank1Offset: number;
  haltPostClocks: number;
  spriteCount: number = 252; // Mode 3 extra clocking counter (Depends on how many sprites are on the current line.).
  BGCHRCurrentBank: Uint8Array; // BG Tile Pointer Caches:
  tileCache: any; // Tile Data Cache
  colors: number[] = [0xefffde, 0xadd794, 0x529273, 0x183442]; // "Classic" GameBoy palette colors.
  OBJPalette: Int32Array;
  BGPalette: Int32Array;
  updateGBBGPalette: (data: any) => void;
  updateGBOBJPalette: (index: any, data: any) => void;
  pixelStart: number = 0; // Temp variable for holding the current working framebuffer offset.
  pixelEnd: number = 0; // track the x-coord limit for line rendering (mid-scanline usage).
  memory: Uint8Array;
  isBootingRom: boolean = true;
  videoRam: Uint8Array;
  GBCMemory: Uint8Array;
  frameBuffer: Int32Array;
  BGCHRBank1: Uint8Array;

  registerA: number;
  registerB: number;
  registerC: number;
  registerD: number;
  registerE: number;
  FZero: boolean;
  FSubtract: boolean;
  FHalfCarry: boolean;
  FCarry: boolean;
  registersHL: number;
  programCounter: number;
  stackPointer: number;

  IME: boolean;
  interruptRequestedFlags: number;
  interruptEnabledFlags: number;
  hdmaRunning: boolean;
  currentInstructionCycleCount: number;
  STATTracker: number;
  modeSTAT: number;
  LYCMatchTriggerSTAT: boolean;
  mode2TriggerSTAT: boolean;
  mode1TriggerSTAT: boolean;
  mode0TriggerSTAT: boolean;
  DIVTicks: number;
  LCDTicks: number;
  timerTicks: number;
  TIMAEnabled: boolean;
  TACClocker: number;
  serialTimer: number;
  serialShiftTimer: number;
  serialShiftTimerAllocated: number;
  IRQEnableDelay: number;
  actualScanline: number;
  lastUnrenderedLine: number;
  gfxWindowDisplay: boolean;
  gfxSpriteShow: boolean;
  gfxSpriteNormalHeight: boolean;
  backgroundEnabled: boolean;
  hasBackgroundPriority: boolean;
  gfxWindowCHRBankPosition: number;
  gfxBackgroundCHRBankPosition: number;
  gfxBackgroundBankOffset: number;
  windowY: number;
  windowX: number;
  drewBlank: number;
  halt: boolean;
  skipPCIncrement: boolean;
  doubleSpeedShifter: number;
  colorizedGBPalettes: boolean;
  backgroundX: number;
  gbcOBJRawPalette: Uint8Array;
  gbcBGRawPalette: Uint8Array;
  gbcOBJPalette: Int32Array;
  gbcBGPalette: Int32Array;
  BGCHRBank2: Uint8Array;
  currentVideoRamBank: number;
  gbOBJPalette: Int32Array;
  gbBGPalette: Int32Array;
  sortBuffer: Uint8Array;
  OAMAddressCache: Int32Array;
  gbBGColorizedPalette: Int32Array;
  gbOBJColorizedPalette: Int32Array;
  cachedBGPaletteConversion: Int32Array;
  cachedOBJPaletteConversion: Int32Array;
  backgroundY: number;
  queuedScanlines: number;
  remainingClocks: number;
  gbcRamBankPosition: number;
  gbcEchoRamBankPosition: number;
  gbcRamBank: number;
  stateManager: StateManager;
  lcdDevice: LCD;
  joypad: Joypad;
  audioController: AudioController;
  audioDevice: AudioDevice;
  cpu: CPU;
  gpu: GPU;
  memoryNew: Memory;

  usedBootRom: boolean;

  gbBootRom?: ROM;
  gbcBootRom?: ROM;
  usedGbcBootRom: boolean;

  memoryReader = []; // Array of functions mapped to read back memory
  memoryWriter = []; // Array of functions mapped to write to memory
  highMemoryReader = []; // Array of functions mapped to read back 0xFFXX memory
  highMemoryWriter = []; // Array of functions mapped to write to 0xFFXX memory

  constructor(
    options: {
      audio?: any;
      lcd?: any;
      bootRom?: ArrayBuffer;
    } = {}
  ) {
    super();

    this.debouncedAutoSave = debounce(
      this.autoSave.bind(this),
      100
    );
    this.addListener("mbcRamWrite", () => {
      if (!this.cartridge) return;
      this.debouncedAutoSave();
    });

    this.isOn = false;
    this.actions = new Actions();
    this.registerActions();

    if (typeof document !== "undefined") {
      this.storage = new LocalStorage();
    } else {
      this.storage = new MemoryStorage();
    }

    this.cpu = new CPU();
    this.gpu = new GPU(this);
    this.audioDevice = new AudioDevice({
      context: options.audio?.context,
      channels: 2
    });
    this.audioController = new AudioController({
      cpu: this.cpu,
      gameboy: this
    });
    this.joypad = new Joypad(this);
    this.lcdDevice = new LCD(
      this,
      options.lcd
    );
    this.stateManager = new StateManager(this);
    this.stateManager.init();

    // Palettes:
    this.updateGBBGPalette = this.updateGBRegularBGPalette;
    this.updateGBOBJPalette = this.updateGBRegularOBJPalette;
  }

  isPaused() {
    return (
      typeof document !== "undefined" &&
      document.hidden
    );
  }

  setStorage(storage: Storage) {
    this.storage = storage;
  }

  registerActions() {
    for (const action of actions) {
      const index = actions.indexOf(action);
      this.actions
        .register(action)
        .addListener("Down" + action, () => {
          this.joypad.down(index);
        })
        .addListener("Up" + action, () => {
          this.joypad.up(index);
        });
    }

    this.actions
      .register("Speed")
      .addListener("DownSpeed", options => this.handleSpeed(options))
      .addListener("ChangeSpeed", options => this.handleSpeed(options))
      .addListener("UpSpeed", () => {
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

    this.start(this.cartridge);
    this.stopEmulator = 1;

    this.requestFrame(this.frameHandler);
  }

  frameHandler = (now: number) => {
    if (this.isPaused()) return;

    if (
      !this.lastRun ||
      this.lastRun < now - settings.runInterval
    ) {
      this.run();
      this.lastRun = now;
    }

    this.requestFrame(this.frameHandler);
  };

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

  setGbBootRom(rom: ROM | ArrayBuffer | Uint8Array) {
    if (!(rom instanceof ROM)) {
      rom = new ROM(rom);
    }

    this.gbBootRom = rom;
  }

  setGbcBootRom(rom: ROM | ArrayBuffer | Uint8Array) {
    if (!(rom instanceof ROM)) {
      rom = new ROM(rom);
    }

    this.gbcBootRom = rom;
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

  actionDown(action: Action, options?) {
    this.actions.down(action, options);
  }

  actionChange(action: Action, options) {
    this.actions.change(action, options);
  }

  actionUp(action: Action, options?) {
    this.actions.up(action, options);
  }

  autoSave() {
    this.saveRam();
    this.saveRtc();
  }

  async saveState(state) {
    if (
      !this.storage ||
      !this.cartridge
    ) return;
    const name = this.cartridge.name;

    if (!state) {
      state = this.stateManager.get();
      if (!state) return false;
    }

    await this.storage.setState(name, state);
    this.emit("stateSaved", { name, state });
  }

  async saveRam(ram?) {
    if (
      !this.storage ||
      !this.cartridge?.mbc
    ) return;
    const name = this.cartridge.name;

    if (!ram) {
      ram = this.cartridge.mbc.getRam();
      if (!ram) return false;
    }

    await this.storage.setRam(name, ram.buffer);
    this.emit("ramSaved", { name, ram });
  }

  async saveRtc(rtc?) {
    if (
      !this.storage ||
      !this.cartridge?.mbc?.rtc
    ) return;

    const name = this.cartridge.name;

    if (!rtc) {
      rtc = this.cartridge.mbc.rtc.get();
      if (!rtc) return false;
    }

    await this.storage.setRtc(name, rtc.buffer);
    this.emit("rtcSaved", { name, rtc });
  }

  loadState(state) {
    if (
      !this.storage ||
      !this.cartridge
    ) return;

    const name = this.cartridge.name;

    if (!state) {
      state = this.storage.getState(name);
      if (!state) return false;
    }

    this.stateManager.load(state);

    this.initReferencesFromSaveState();
    this.memoryNew.init();
    this.lcdDevice.init();
    this.audioController.noiseSampleTable = (
      this.audioController.channel4BitRange === 0x7fff ?
        this.audioController.LSFR15Table :
        this.audioController.LSFR7Table
    );
    this.audioController.channel4VolumeShifter = (
      this.audioController.channel4BitRange === 0x7fff ?
        15 :
        7
    );

    this.emit("stateLoaded", { name, state });
  }

  loadRam(ram?) {
    if (
      !this.storage ||
      !this.cartridge
    ) return;

    const name = this.cartridge.name;

    if (!ram) {
      ram = this.storage.getRam(name);
      if (!ram) return false;
      ram = new Uint8Array(ram);
    }

    this.cartridge.mbc.loadRam(ram);
    this.emit("ramLoaded", { name, ram });
  }

  loadRtc(rtc?) {
    if (
      !this.storage ||
      !this.core?.cartridge?.hasRtc
    ) return;

    const name = this.cartridge.name;

    if (!rtc) {
      rtc = this.storage.getRtc(name);
      if (!rtc) return false;
      rtc = new Uint32Array(rtc);
    }

    this.cartridge.mbc.rtc.load(rtc);
    this.emit("rtcLoaded", { name, rtc });
  }

  getBatteryFileArrayBuffer(): ArrayBuffer {
    if (!this.cartridge?.mbc) return;

    const ram = this.cartridge.mbc.getRam();
    const rtc = this.cartridge.mbc.rtc?.get();

    return (
      rtc ?
        concatArrayBuffers(ram.buffer, rtc.buffer) :
        ram.buffer
    );
  }

  async loadBatteryFileArrayBuffer(data: ArrayBuffer) {
    if (!this.cartridge?.mbc) return;

    const ram = this.cartridge.mbc.cutSRAMFromBatteryFileArray(data);
    const rtc = this.cartridge.mbc.rtc?.cutBatteryFileArray(data);

    this.cartridge.mbc.loadRam(ram);
    if (rtc) this.cartridge.mbc.rtc.load(rtc);

    await this.saveRam(ram);
    if (rtc) await this.saveRtc(rtc);

    this.restart();
  }

  requestFrame(fn: (now: number) => void) {
    if (
      typeof window !== "undefined" &&
      window.requestAnimationFrame
    ) {
      window.requestAnimationFrame(fn);
    } else {
      const now = (typeof performance !== "undefined" ? performance : Date).now();
      setTimeout(() => fn(now), 0);
    }
  }

  connectCartridge(cartridge: Cartridge) {
    this.cartridge?.mbc
      ?.removeListener("rumble", this.rumble)
      ?.removeListener("ramWrite", this.onMbcRamWrite);

    this.cartridge?.disconnect();
    cartridge.connect(this);

    cartridge.interpret();
    cartridge.mbc
      ?.addListener("rumble", this.rumble)
      ?.addListener("ramWrite", this.onMbcRamWrite);
    cartridge.mbc?.setupRom();

    this.cartridge = cartridge;

    this.loadCartridgeRomIntoMemory();
    if (this.gbcBootRom) this.loadGbcBootRomIntoMemory();
    else if (this.gbBootRom) this.loadGbBootRomIntoMemory();
  }

  rumble() {
    if (
      typeof window !== "undefined" &&
      "vibrate" in window.navigator
    ) {
      window.navigator.vibrate(200);
    }
  }

  onMbcRamWrite = () => {
    this.emit("mbcRamWrite");
  };

  loadGbcBootRomIntoMemory() {
    let address = 0;
    while (address < 0x100) {
      this.memory[address] = this.gbcBootRom.getByte(address);
      ++address;
    }

    while (address < 0x200) {
      this.memory[address] = this.cartridge.rom.getByte(address);
      ++address;
    }

    while (address < 0x900) {
      this.memory[address] = this.gbcBootRom.getByte(address);
      ++address;
    }

    this.usedBootRom = true;
    this.usedGbcBootRom = true;
  }

  loadGbBootRomIntoMemory() {
    let address = 0;
    while (address < 0x100) {
      this.memory[address] = this.gbBootRom.getByte(address);
      ++address;
    }
    this.usedBootRom = true;
  }

  loadCartridgeRomIntoMemory() {
    for (let address = 0; address < 0x4000; address++) {
      this.memory[address] = this.cartridge.rom.getByte(address);
    }
  }

  start(cartridge: Cartridge) {
    this.stateManager.init();

    this.memory = new Uint8Array(0x10000);
    this.audioController.setMemory(this.memory);
    this.frameBuffer = util.getTypedArray(23040, 0xf8f8f8, "int32") as Int32Array;
    this.BGCHRBank1 = new Uint8Array(0x800);
    this.audioController.initMemory();

    this.memoryNew = new Memory(this, this.memory);

    this.lcdDevice.init();

    this.audioController.connectDevice(this.audioDevice);

    this.connectCartridge(cartridge);

    this.cartridge.setupRAM();

    // Setup the RAM for GBC mode.
    if (this.cartridge.useGbcMode) {
      this.videoRam = new Uint8Array(0x2000);
      this.GBCMemory = new Uint8Array(0x7000);
    }

    this.memoryNew.init();

    if (this.cartridge.useGbcMode) {
      this.gbcOBJRawPalette = new Uint8Array(0x40);
      this.gbcBGRawPalette = new Uint8Array(0x40);
      this.gbcOBJPalette = util.getTypedArray(0x20, 0x1000000, "int32") as Int32Array;
      this.gbcBGPalette = new Int32Array(0x40);
      this.BGCHRBank2 = new Uint8Array(0x800);
      this.BGCHRCurrentBank = this.currentVideoRamBank > 0 ?
        this.BGCHRBank2 :
        this.BGCHRBank1;
      this.tileCache = this.generateCacheArray(0xf80);
    } else {
      this.gbOBJPalette = new Int32Array(8);
      this.gbBGPalette = new Int32Array(4);
      this.BGPalette = this.gbBGPalette;
      this.OBJPalette = this.gbOBJPalette;
      this.tileCache = this.generateCacheArray(0x700);
      this.sortBuffer = new Uint8Array(0x100);
      this.OAMAddressCache = new Int32Array(10);
    }

    this.gpu.initRenderer();

    if (!this.usedBootRom) {
      this.isBootingRom = false;
      this.skipBootRom();
    } else {
      this.initBootRom();
    }

    // Check for IRQ matching upon initialization:
    this.checkIrqMatching();
  }

  generateCacheArray(tileAmount: number) {
    const tileArray = [];
    let tileNumber = 0;
    while (tileNumber < tileAmount) {
      tileArray[tileNumber++] = new Uint8Array(64);
    }
    return tileArray;
  }

  skipBootRom() {
    // Fill in the boot ROM set register values
    // Default values to the GB boot ROM values, then fill in the GBC boot ROM values after ROM loading
    var index = 0xff;
    while (index >= 0) {
      if (index >= 0x30 && index < 0x40) {
        this.writeMemory(0xff00 | index, postBootRomState[index]);
      } else {
        switch (index) {
          case 0x00:
          case 0x01:
          case 0x02:
          case 0x05:
          case 0x07:
          case 0x0f:
          case 0xff:
            this.writeMemory(0xff00 | index, postBootRomState[index]);
            break;
          default:
            this.memory[0xff00 | index] = postBootRomState[index];
        }
      }
      --index;
    }

    if (this.cartridge.useGbcMode) {
      this.memory[0xff6c] = 0xfe;
      this.memory[0xff74] = 0xfe;
    } else {
      this.memory[0xff48] = 0xff;
      this.memory[0xff49] = 0xff;
      this.memory[0xff6c] = 0xff;
      this.memory[0xff74] = 0xff;
    }

    // Start as an unset device:
    console.log("Starting without the GBC boot ROM.");
    this.registerA = (
      this.cartridge.useGbcMode ?
        0x11 :
        0x1
    );
    this.registerB = 0;
    this.registerC = 0x13;
    this.registerD = 0;
    this.registerE = 0xd8;
    this.FZero = true;
    this.FSubtract = false;
    this.FHalfCarry = true;
    this.FCarry = true;
    this.registersHL = 0x014d;
    this.gpu.enableLCD();
    this.IME = false;
    this.matchedIrqLines = 0;
    this.interruptRequestedFlags = 225;
    this.interruptEnabledFlags = 0;
    this.hdmaRunning = false;
    this.currentInstructionCycleCount = 12;
    this.STATTracker = 0;
    this.modeSTAT = 1;
    this.spriteCount = 252;
    this.LYCMatchTriggerSTAT = false;
    this.mode2TriggerSTAT = false;
    this.mode1TriggerSTAT = false;
    this.mode0TriggerSTAT = false;
    this.audioController.setSkippedBootRomState();
    this.DIVTicks = 27044;
    this.LCDTicks = 160;
    this.timerTicks = 0;
    this.TIMAEnabled = false;
    this.TACClocker = 1024;
    this.serialTimer = 0;
    this.serialShiftTimer = 0;
    this.serialShiftTimerAllocated = 0;
    this.IRQEnableDelay = 0;
    this.actualScanline = 144;
    this.lastUnrenderedLine = 0;
    this.gfxWindowDisplay = false;
    this.gfxSpriteShow = false;
    this.gfxSpriteNormalHeight = true;
    this.backgroundEnabled = true;
    this.hasBackgroundPriority = true;
    this.gfxWindowCHRBankPosition = 0;
    this.gfxBackgroundCHRBankPosition = 0;
    this.gfxBackgroundBankOffset = 0;
    this.windowY = 0;
    this.windowX = 0;
    this.drewBlank = 0;
    this.midScanlineOffset = -1;
    this.currentX = 0;
  }

  initBootRom() {
    console.log("Starting boot rom");

    this.programCounter = 0;
    this.stackPointer = 0;
    this.IME = false;
    this.LCDTicks = 0;
    this.DIVTicks = 0;
    this.registerA = 0;
    this.registerB = 0;
    this.registerC = 0;
    this.registerD = 0;
    this.registerE = 0;
    this.FZero = this.FSubtract = this.FHalfCarry = this.FCarry = false;
    this.registersHL = 0;
    this.audioController.init();
    this.joypad.init();
  }

  disableBootRom() {
    this.loadCartridgeRomIntoMemory();

    if (this.usedGbcBootRom) {
      if (!this.cartridge.useGbcMode) {
        // Clean up the post-boot (GB mode only) state:
        this.adjustGBCtoGBMode();
      } else {
        this.memoryNew.updateIORegisters();
      }
    } else {
      this.memoryNew.updateIORegisters();
    }
  }

  setSpeed(speed: number) {
    this.cpu.setSpeed(speed);
    this.audioController.connectDevice(this.audioDevice);
  }

  run() {
    // The preprocessing before the actual iteration loop:
    if ((this.stopEmulator & 0b10) === 0) {
      if ((this.stopEmulator & 0b1) === 1) {
        if (!this.cpu.stopped) {
          this.stopEmulator = 0;

          this.audioController.adjustUnderrun();
          this.cartridge.mbc?.rtc?.updateClock();

          if (this.halt) {
            // Finish the HALT rundown execution.
            this.currentInstructionCycleCount = 0;
            this.calculateHALTPeriod();

            if (this.halt) {
              this.updateCore();
              this.iterationEndRoutine();
            } else {
              this.executeIteration();
            }
          } else {
            this.executeIteration();
          }

          this.lcdDevice.draw();
        } else {
          this.audioController.adjustUnderrun();
          this.audioController.audioTicks += this.cpu.cyclesTotal;
          this.audioController.run();
          this.stopEmulator |= 1; // End current loop.
        }
      } else {
        // We can only get here if there was an internal error, but the loop was restarted.
        console.error("Iterator restarted a faulted core.");
      }
    }
  }

  executeIteration() {
    // Iterate the interpreter loop
    while (this.stopEmulator === 0) {
      // Interrupt Arming:
      switch (this.IRQEnableDelay) {
        case 1:
          this.IME = true;
          this.checkIrqMatching();
          --this.IRQEnableDelay;
          break;
        case 2:
          --this.IRQEnableDelay;
          break;
        default:
          break;
      }
      //Is an IRQ set to fire?:
      if (this.matchedIrqLines > 0) {
        //IME is true and and interrupt was matched:
        this.launchIRQ();
      }
      //Fetch the current opcode:
      const operationCode = this.readMemory(this.programCounter);
      //Increment the program counter to the next instruction:
      this.programCounter = this.programCounter + 1 & 0xffff;
      //Check for the program counter quirk:
      if (this.skipPCIncrement) {
        this.programCounter = this.programCounter - 1 & 0xffff;
        this.skipPCIncrement = false;
      }
      //Get how many CPU cycles the current instruction counts for:
      this.currentInstructionCycleCount = tickTable[operationCode];

      //Execute the current instruction:
      mainInstructions[operationCode].apply(this);

      //Update the state (Inlined updateCoreFull manually here):
      //Update the clocking for the LCD emulation:
      const timedTicks = this.currentInstructionCycleCount >> this.doubleSpeedShifter;
      this.LCDTicks += timedTicks; //LCD Timing

      this.gpu.runScanline(this.actualScanline); // Scan Line and STAT Mode Control

      //Single-speed relative timing for A/V emulation:
      this.audioController.audioTicks += timedTicks; //Audio Timing
      this.cpu.ticks += timedTicks; //Emulator Timing
      //CPU Timers:
      this.DIVTicks += this.currentInstructionCycleCount; //DIV Timing
      if (this.TIMAEnabled) {
        //TIMA Timing
        this.timerTicks += this.currentInstructionCycleCount;
        while (this.timerTicks >= this.TACClocker) {
          this.timerTicks -= this.TACClocker;
          if (++this.memory[0xff05] === 0x100) {
            this.memory[0xff05] = this.memory[0xff06];
            this.interruptRequestedFlags |= 0x4;
            this.checkIrqMatching();
          }
        }
      }

      if (this.serialTimer > 0) {
        // Serial Timing
        // IRQ Counter:
        this.serialTimer -= this.currentInstructionCycleCount;
        if (this.serialTimer <= 0) {
          this.interruptRequestedFlags |= 0x8;
          this.checkIrqMatching();
        }

        // Bit Shift Counter:
        this.serialShiftTimer -= this.currentInstructionCycleCount;
        if (this.serialShiftTimer <= 0) {
          this.serialShiftTimer = this.serialShiftTimerAllocated;
          // We could shift in actual link data here if we were to implement such!!!
          this.memory[MemoryLayout.serialDataAddress] = this.memory[MemoryLayout.serialDataAddress] << 1 & 0xfe | 0x01;
        }
      }

      // End of iteration routine:
      if (this.cpu.ticks >= this.cpu.cyclesTotal) {
        this.iterationEndRoutine();
      }
    }
  }

  iterationEndRoutine() {
    if ((this.stopEmulator & 0x1) === 0) {
      this.audioController.run(); // make sure we at least output once per iteration.
      // update DIV Alignment (Integer overflow safety):
      this.memory[MemoryLayout.divAddress] = this.memory[MemoryLayout.divAddress] + (this.DIVTicks >> 8) & 0xff;
      this.DIVTicks &= 0xff;
      // update emulator flags:
      this.stopEmulator |= 1; // end current loop.
      this.cpu.ticks -= this.cpu.cyclesTotal;
      this.cpu.cyclesTotalCurrent += this.cpu.cyclesTotalRoundoff;
      this.recalculateIterationClockLimit();
    }
  }

  stop() {
    this.cpu.stopped = true; // Stop CPU until joypad input changes.
    this.iterationEndRoutine();
    if (this.cpu.ticks < 0) {
      this.audioController.audioTicks -= this.cpu.ticks;
      this.audioController.run();
    }
  }

  recalculateIterationClockLimit() {
    const endModulus = this.cpu.cyclesTotalCurrent % 4;
    this.cpu.cyclesTotal = this.cpu.cyclesTotalBase + this.cpu.cyclesTotalCurrent - endModulus;
    this.cpu.cyclesTotalCurrent = endModulus;
  }

  scanLineMode2() {
    //OAM Search Period
    if (this.STATTracker !== 1) {
      if (this.mode2TriggerSTAT) {
        this.interruptRequestedFlags |= 0x2;
        this.checkIrqMatching();
      }
      this.STATTracker = 1;
      this.modeSTAT = 2;
    }
  }

  scanLineMode3() {
    //Scan Line Drawing Period
    if (this.modeSTAT !== 3) {
      if (this.STATTracker === 0 && this.mode2TriggerSTAT) {
        this.interruptRequestedFlags |= 0x2;
        this.checkIrqMatching();
      }
      this.STATTracker = 1;
      this.modeSTAT = 3;
    }
  }

  scanLineMode0() {
    //Horizontal Blanking Period
    if (this.modeSTAT !== 0) {
      if (this.STATTracker !== 2) {
        if (this.STATTracker === 0) {
          if (this.mode2TriggerSTAT) {
            this.interruptRequestedFlags |= 0x2;
            this.checkIrqMatching();
          }
          this.modeSTAT = 3;
        }
        this.incrementScanlineQueue();
        this.updateSpriteCount(this.actualScanline);
        this.STATTracker = 2;
      }
      if (this.LCDTicks >= this.spriteCount) {
        if (this.hdmaRunning) {
          this.executeHDMA();
        }
        if (this.mode0TriggerSTAT) {
          this.interruptRequestedFlags |= 0x2;
          this.checkIrqMatching();
        }
        this.STATTracker = 3;
        this.modeSTAT = 0;
      }
    }
  }

  clocksUntilLYCMatch() {
    if (this.memory[0xff45] !== 0) {
      if (this.memory[0xff45] > this.actualScanline) {
        return (
          456 *
          (
            this.memory[0xff45] -
            this.actualScanline
          )
        );
      }

      return (
        456 *
        (
          totalScanlineCount -
          this.actualScanline +
          this.memory[0xff45]
        )
      );
    }

    return (
      456 *
      (
        (
          this.actualScanline === 153 &&
          this.memory[0xff44] === 0
        ) ?
          totalScanlineCount :
          153 - this.actualScanline
      ) +
      8
    );
  }

  clocksUntilMode0() {
    switch (this.modeSTAT) {
      case 0:
        if (this.actualScanline === 143) {
          this.updateSpriteCount(0);
          return this.spriteCount + 5016;
        }
        this.updateSpriteCount(this.actualScanline + 1);
        return this.spriteCount + 456;
      case 2:
      case 3:
        this.updateSpriteCount(this.actualScanline);
        return this.spriteCount;
      case 1:
        this.updateSpriteCount(0);
        return this.spriteCount + 456 * (totalScanlineCount - this.actualScanline);
    }
  }

  updateSpriteCount(line: number) {
    this.spriteCount = 252;
    if (this.cartridge.useGbcMode && this.gfxSpriteShow) {
      //Is the window enabled and are we in CGB mode?
      var lineAdjusted = line + 0x10;
      var yoffset = 0;
      var yCap = this.gfxSpriteNormalHeight ? 0x8 : 0x10;
      for (
        var OAMAddress = 0xfe00; OAMAddress < 0xfea0 && this.spriteCount < 312; OAMAddress += 4
      ) {
        yoffset = lineAdjusted - this.memory[OAMAddress];
        if (yoffset > -1 && yoffset < yCap) {
          this.spriteCount += 6;
        }
      }
    }
  }

  matchLYC() {
    //LYC Register Compare
    if (this.memory[0xff44] === this.memory[0xff45]) {
      this.memory[0xff41] |= 0x04;
      if (this.LYCMatchTriggerSTAT) {
        this.interruptRequestedFlags |= 0x2;
        this.checkIrqMatching();
      }
    } else {
      this.memory[0xff41] &= 0x7b;
    }
  }

  updateCore() {
    //Update the clocking for the LCD emulation:
    this.LCDTicks += this.currentInstructionCycleCount >> this.doubleSpeedShifter; // LCD Timing
    this.gpu.runScanline(this.actualScanline); //Scan Line and STAT Mode Control
    //Single-speed relative timing for A/V emulation:
    var timedTicks = this.currentInstructionCycleCount >> this.doubleSpeedShifter; // CPU clocking can be updated from the LCD handling.
    this.audioController.audioTicks += timedTicks; // Audio Timing
    this.cpu.ticks += timedTicks; // CPU Timing
    //CPU Timers:
    this.DIVTicks += this.currentInstructionCycleCount; // DIV Timing
    if (this.TIMAEnabled) {
      //TIMA Timing
      this.timerTicks += this.currentInstructionCycleCount;
      while (this.timerTicks >= this.TACClocker) {
        this.timerTicks -= this.TACClocker;
        if (++this.memory[0xff05] === 0x100) {
          this.memory[0xff05] = this.memory[0xff06];
          this.interruptRequestedFlags |= 0x4;
          this.checkIrqMatching();
        }
      }
    }
    if (this.serialTimer > 0) {
      //Serial Timing
      //IRQ Counter:
      this.serialTimer -= this.currentInstructionCycleCount;
      if (this.serialTimer <= 0) {
        this.interruptRequestedFlags |= 0x8;
        this.checkIrqMatching();
      }
      //Bit Shit Counter:
      this.serialShiftTimer -= this.currentInstructionCycleCount;
      if (this.serialShiftTimer <= 0) {
        this.serialShiftTimer = this.serialShiftTimerAllocated;
        this.memory[MemoryLayout.serialDataAddress] = this.memory[MemoryLayout.serialDataAddress] << 1 & 0xfe | 0x01; //We could shift in actual link data here if we were to implement such!!!
      }
    }
  }

  updateCoreFull() {
    //Update the state machine:
    this.updateCore();
    //End of iteration routine:
    if (this.cpu.ticks >= this.cpu.cyclesTotal) {
      this.iterationEndRoutine();
    }
  }

  executeHDMA() {
    this.writeDirectlyToMemory(1);

    if (this.halt) {
      if (
        this.LCDTicks - this.spriteCount < (4 >> this.doubleSpeedShifter | 0x20)
      ) {
        //HALT clocking correction:
        this.currentInstructionCycleCount = 4 + (0x20 + this.spriteCount << this.doubleSpeedShifter);
        this.LCDTicks = this.spriteCount + (4 >> this.doubleSpeedShifter | 0x20);
      }
    } else {
      this.LCDTicks += 4 >> this.doubleSpeedShifter | 0x20; //LCD Timing Update For HDMA.
    }
    if (this.memory[0xff55] === 0) {
      this.hdmaRunning = false;
      this.memory[0xff55] = 0xff; //Transfer completed ("Hidden last step," since some ROMs don't imply this, but most do).
    } else {
      --this.memory[0xff55];
    }
  }

  renderScanline(scanline: number) {
    this.pixelStart = scanline * 160;
    if (this.backgroundEnabled) {
      this.pixelEnd = 160;
      this.gpu.renderBackgroundLayer(scanline);
      this.gpu.renderWindowLayer(scanline);
    } else {
      const pixelLine = (scanline + 1) * 160;
      const defaultColor = this.cartridge.useGbcMode || this.colorizedGBPalettes ? 0xf8f8f8 : 0xefffde;
      for (let pixelPosition = scanline * 160 + this.currentX; pixelPosition < pixelLine; pixelPosition++) {
        this.frameBuffer[pixelPosition] = defaultColor;
      }
    }
    this.gpu.renderSpriteLayer(scanline);
    this.currentX = 0;
    this.midScanlineOffset = -1;
  }

  renderMidScanline() {
    if (this.actualScanline < 144 && this.modeSTAT === 3) {
      // TODO: Get this accurate:
      if (this.midScanlineOffset === -1) {
        this.midScanlineOffset = this.backgroundX & 0x7;
      }
      if (this.LCDTicks >= 82) {
        this.pixelEnd = this.LCDTicks - 74;
        this.pixelEnd = Math.min(
          this.pixelEnd - this.midScanlineOffset - this.pixelEnd % 0x8,
          160
        );

        if (this.backgroundEnabled) {
          this.pixelStart = this.lastUnrenderedLine * 160;
          this.gpu.renderBackgroundLayer(this.lastUnrenderedLine);
          this.gpu.renderWindowLayer(this.lastUnrenderedLine);
          // TODO: Do midscanline JIT for sprites...
        } else {
          var pixelLine = this.lastUnrenderedLine * 160 + this.pixelEnd;
          var defaultColor = this.cartridge.useGbcMode ||
            this.colorizedGBPalettes ?
            0xf8f8f8 :
            0xefffde;
          for (
            var pixelPosition = this.lastUnrenderedLine * 160 + this.currentX;
            pixelPosition < pixelLine;
            pixelPosition++
          ) {
            this.frameBuffer[pixelPosition] = defaultColor;
          }
        }
        this.currentX = this.pixelEnd;
      }
    }
  }

  adjustGBCtoGBMode() {
    console.log("Stepping down from GBC mode.");
    this.videoRam = this.GBCMemory = this.BGCHRCurrentBank = this.BGCHRBank2 = undefined;

    this.tileCache.length = 0x700;

    if (settings.colorizeGBMode) {
      this.gbBGColorizedPalette = new Int32Array(4);
      this.gbOBJColorizedPalette = new Int32Array(8);
      this.cachedBGPaletteConversion = new Int32Array(4);
      this.cachedOBJPaletteConversion = new Int32Array(8);
      this.BGPalette = this.gbBGColorizedPalette;
      this.OBJPalette = this.gbOBJColorizedPalette;
      this.gbOBJPalette = this.gbBGPalette = undefined;
      this.getGBCColor();
    } else {
      this.gbOBJPalette = new Int32Array(8);
      this.gbBGPalette = new Int32Array(4);
      this.BGPalette = this.gbBGPalette;
      this.OBJPalette = this.gbOBJPalette;
    }

    this.sortBuffer = new Uint8Array(0x100);
    this.OAMAddressCache = new Int32Array(10);
    this.gpu.initRenderer();
    this.memoryNew.init();
  }

  initReferencesFromSaveState() {
    if (!this.cartridge.useGbcMode) {
      if (this.colorizedGBPalettes) {
        this.BGPalette = this.gbBGColorizedPalette;
        this.OBJPalette = this.gbOBJColorizedPalette;
        this.updateGBBGPalette = this.updateGBColorizedBGPalette;
        this.updateGBOBJPalette = this.updateGBColorizedOBJPalette;
      } else {
        this.BGPalette = this.gbBGPalette;
        this.OBJPalette = this.gbOBJPalette;
      }

      this.tileCache = this.generateCacheArray(0x700);
      for (let tileIndex = 0x8000; tileIndex < 0x9000; tileIndex += 2) {
        this.generateGBOAMTileLine(tileIndex);
      }

      for (let tileIndex = 0x9000; tileIndex < 0x9800; tileIndex += 2) {
        this.generateGBTileLine(tileIndex);
      }

      this.sortBuffer = new Uint8Array(0x100);
      this.OAMAddressCache = new Int32Array(10);
    } else {
      this.BGCHRCurrentBank = this.currentVideoRamBank > 0 ? this.BGCHRBank2 : this.BGCHRBank1;
      this.tileCache = this.generateCacheArray(0xf80);
      for (let tileIndex = 0; tileIndex < 0x1800; tileIndex += 0x10) {
        this.generateGBCTileBank1(tileIndex);
        this.generateGBCTileBank2(tileIndex);
      }
    }
    this.gpu.initRenderer();
  }

  adjustRGBTint(value: number) {
    // Adjustment for the GBC's tinting (According to Gambatte):
    const red = value & 0x1F;
    const green = value >> 5 & 0x1F;
    const blue = value >> 10 & 0x1F;
    return (
      red * 13 + green * 2 + blue >> 1 << 16 |
      green * 3 + blue << 9 |
      red * 3 + green * 2 + blue * 11 >> 1
    );
  }

  getGBCColor() {
    // GBC Colorization of DMG ROMs:
    // BG
    for (let counter = 0; counter < 4; counter++) {
      const adjustedIndex = counter << 1;
      // BG
      this.cachedBGPaletteConversion[counter] = this.adjustRGBTint(
        this.gbcBGRawPalette[adjustedIndex | 1] << 8 |
        this.gbcBGRawPalette[adjustedIndex]
      );
      // OBJ 1
      this.cachedOBJPaletteConversion[counter] = this.adjustRGBTint(
        this.gbcOBJRawPalette[adjustedIndex | 1] << 8 |
        this.gbcOBJRawPalette[adjustedIndex]
      );
    }

    // OBJ 2
    for (let counter = 4; counter < 8; counter++) {
      const adjustedIndex = counter << 1;
      this.cachedOBJPaletteConversion[counter] = this.adjustRGBTint(
        this.gbcOBJRawPalette[adjustedIndex | 1] << 8 |
        this.gbcOBJRawPalette[adjustedIndex]
      );
    }

    // Update the palette entries:
    this.updateGBBGPalette = this.updateGBColorizedBGPalette;
    this.updateGBOBJPalette = this.updateGBColorizedOBJPalette;
    this.updateGBBGPalette(this.memory[0xff47]);
    this.updateGBOBJPalette(0, this.memory[0xff48]);
    this.updateGBOBJPalette(1, this.memory[0xff49]);
    this.colorizedGBPalettes = true;
  }

  updateGBRegularBGPalette(data: number) {
    this.gbBGPalette[0] = this.colors[data & 0x03] | 0x2000000;
    this.gbBGPalette[1] = this.colors[data >> 2 & 0x03];
    this.gbBGPalette[2] = this.colors[data >> 4 & 0x03];
    this.gbBGPalette[3] = this.colors[data >> 6];
  }

  updateGBColorizedBGPalette(data: number) {
    // GB colorization:
    this.gbBGColorizedPalette[0] = this.cachedBGPaletteConversion[data & 0x03] | 0x2000000;
    this.gbBGColorizedPalette[1] = this.cachedBGPaletteConversion[data >> 2 & 0x03];
    this.gbBGColorizedPalette[2] = this.cachedBGPaletteConversion[data >> 4 & 0x03];
    this.gbBGColorizedPalette[3] = this.cachedBGPaletteConversion[data >> 6];
  }

  updateGBRegularOBJPalette(address: number, data: number) {
    this.gbOBJPalette[address | 1] = this.colors[data >> 2 & 0x03];
    this.gbOBJPalette[address | 2] = this.colors[data >> 4 & 0x03];
    this.gbOBJPalette[address | 3] = this.colors[data >> 6];
  }

  updateGBColorizedOBJPalette(address: number, data: number) {
    // GB colorization:
    this.gbOBJColorizedPalette[address | 1] = this.cachedOBJPaletteConversion[address | data >> 2 & 0x03];
    this.gbOBJColorizedPalette[address | 2] = this.cachedOBJPaletteConversion[address | data >> 4 & 0x03];
    this.gbOBJColorizedPalette[address | 3] = this.cachedOBJPaletteConversion[address | data >> 6];
  }

  updateGBCBGPalette(address: number, data: number) {
    if (this.gbcBGRawPalette[address] !== data) {
      this.midScanlineJIT();
      //Update the color palette for BG tiles since it changed:
      this.gbcBGRawPalette[address] = data;
      if ((address & 0x06) === 0) {
        //Palette 0 (Special tile Priority stuff)
        data = 0x2000000 | this.adjustRGBTint(this.gbcBGRawPalette[address | 1] << 8 | this.gbcBGRawPalette[address & 0x3e]);
        address >>= 1;
        this.gbcBGPalette[address] = data;
        this.gbcBGPalette[0x20 | address] = 0x1000000 | data;
      } else {
        //Regular Palettes (No special crap)
        data = this.adjustRGBTint(this.gbcBGRawPalette[address | 1] << 8 | this.gbcBGRawPalette[address & 0x3e]);
        address >>= 1;
        this.gbcBGPalette[address] = data;
        this.gbcBGPalette[0x20 | address] = 0x1000000 | data;
      }
    }
  }

  updateGBCOBJPalette(address: number, data: number) {
    if (this.gbcOBJRawPalette[address] !== data) {
      //Update the color palette for OBJ tiles since it changed:
      this.gbcOBJRawPalette[address] = data;
      if ((address & 0x06) > 0) {
        //Regular Palettes (No special crap)
        this.midScanlineJIT();
        this.gbcOBJPalette[address >> 1] = 0x1000000 | this.adjustRGBTint(this.gbcOBJRawPalette[address | 1] << 8 | this.gbcOBJRawPalette[address & 0x3e]);
      }
    }
  }

  findLowestSpriteDrawable(scanline: number, drawableRange) {
    var address = 0xfe00;
    var spriteCount = 0;
    var diff = 0;
    while (address < 0xfea0 && spriteCount < 10) {
      diff = scanline - this.memory[address];
      if ((diff & drawableRange) === diff) {
        this.OAMAddressCache[spriteCount++] = address;
      }
      address += 4;
    }
    return spriteCount;
  }

  //Generate only a single tile line for the GB tile cache mode:
  generateGBTileLine(address: number) {
    var lineCopy = this.memory[0x1 | address] << 8 | this.memory[0x9ffe & address];
    var tileBlock = this.tileCache[(address & 0x1ff0) >> 4];
    address = (address & 0xe) << 2;
    tileBlock[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
    tileBlock[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
    tileBlock[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
    tileBlock[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
    tileBlock[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
    tileBlock[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
    tileBlock[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
    tileBlock[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
  }

  //Generate only a single tile line for the GBC tile cache mode (Bank 1):
  generateGBCTileLineBank1(address: number) {
    var lineCopy = this.memory[0x1 | address] << 8 | this.memory[0x9ffe & address];
    address &= 0x1ffe;
    var tileBlock1 = this.tileCache[address >> 4];
    var tileBlock2 = this.tileCache[0x200 | address >> 4];
    var tileBlock3 = this.tileCache[0x400 | address >> 4];
    var tileBlock4 = this.tileCache[0x600 | address >> 4];
    address = (address & 0xe) << 2;
    var addressFlipped = 0x38 - address;
    tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
    tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
    tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
    tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
    tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
    tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
    tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
    tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
  }

  //Generate all the flip combinations for a full GBC VRAM bank 1 tile:
  generateGBCTileBank1(vramAddress) {
    var address = vramAddress >> 4;
    var tileBlock1 = this.tileCache[address];
    var tileBlock2 = this.tileCache[0x200 | address];
    var tileBlock3 = this.tileCache[0x400 | address];
    var tileBlock4 = this.tileCache[0x600 | address];
    var lineCopy = 0;
    vramAddress |= 0x8000;
    address = 0;
    var addressFlipped = 56;
    do {
      lineCopy = this.memory[0x1 | vramAddress] << 8 | this.memory[vramAddress];
      tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
      tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
      tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
      tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
      tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
      tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
      tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
      tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
      address += 8;
      addressFlipped -= 8;
      vramAddress += 2;
    } while (addressFlipped > -1);
  }

  //Generate only a single tile line for the GBC tile cache mode (Bank 2):
  generateGBCTileLineBank2(address: number) {
    var lineCopy = this.videoRam[0x1 | address] << 8 | this.videoRam[0x1ffe & address];
    var tileBlock1 = this.tileCache[0x800 | address >> 4];
    var tileBlock2 = this.tileCache[0xa00 | address >> 4];
    var tileBlock3 = this.tileCache[0xc00 | address >> 4];
    var tileBlock4 = this.tileCache[0xe00 | address >> 4];
    address = (address & 0xe) << 2;
    var addressFlipped = 0x38 - address;
    tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
    tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
    tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
    tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
    tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
    tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
    tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
    tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
  }

  //Generate all the flip combinations for a full GBC VRAM bank 2 tile:
  generateGBCTileBank2(vramAddress) {
    var address = vramAddress >> 4;
    var tileBlock1 = this.tileCache[0x800 | address];
    var tileBlock2 = this.tileCache[0xa00 | address];
    var tileBlock3 = this.tileCache[0xc00 | address];
    var tileBlock4 = this.tileCache[0xe00 | address];
    var lineCopy = 0;
    address = 0;
    var addressFlipped = 56;
    do {
      lineCopy = this.videoRam[0x1 | vramAddress] << 8 | this.videoRam[vramAddress];
      tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
      tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
      tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
      tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
      tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
      tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
      tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
      tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
      address += 8;
      addressFlipped -= 8;
      vramAddress += 2;
    } while (addressFlipped > -1);
  }

  // Generate only a single tile line for the GB tile cache mode (OAM accessible range):
  generateGBOAMTileLine(address: number) {
    var lineCopy = this.memory[0x1 | address] << 8 | this.memory[0x9ffe & address];
    address &= 0x1ffe;

    var tileBlock1 = this.tileCache[address >> 4];
    var tileBlock2 = this.tileCache[0x200 | address >> 4];
    var tileBlock3 = this.tileCache[0x400 | address >> 4];
    var tileBlock4 = this.tileCache[0x600 | address >> 4];

    address = (address & 0xe) << 2;
    var addressFlipped = 0x38 - address;
    tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
    tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
    tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
    tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
    tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
    tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
    tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
    tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
  }

  graphicsJIT() {
    if (this.gpu.lcdEnabled) {
      this.cpu.totalLinesPassed = 0; //Mark frame for ensuring a JIT pass for the next framebuffer output.
      this.renderQueuedScanlines();
    }
  }

  graphicsJITVBlank() {
    // JIT the graphics to v-blank framing:
    this.cpu.totalLinesPassed += this.queuedScanlines;
    this.renderQueuedScanlines();
  }

  renderQueuedScanlines() {
    // Normal rendering JIT, where we try to do groups of scanlines at once:
    while (this.queuedScanlines > 0) {
      this.renderScanline(this.lastUnrenderedLine);
      if (this.lastUnrenderedLine < 143) {
        ++this.lastUnrenderedLine;
      } else {
        this.lastUnrenderedLine = 0;
      }
      --this.queuedScanlines;
    }
  }

  incrementScanlineQueue() {
    if (this.queuedScanlines < 144) {
      ++this.queuedScanlines;
    } else {
      this.currentX = 0;
      this.midScanlineOffset = -1;
      if (this.lastUnrenderedLine < 143) {
        ++this.lastUnrenderedLine;
      } else {
        this.lastUnrenderedLine = 0;
      }
    }
  }

  midScanlineJIT() {
    this.graphicsJIT();
    this.renderMidScanline();
  }

  //Check for the highest priority IRQ to fire:
  launchIRQ() {
    var bitShift = 0;
    var testbit = 1;
    do {
      //Check to see if an interrupt is enabled AND requested.
      if ((testbit & this.matchedIrqLines) === testbit) {
        this.IME = false; //Reset the interrupt enabling.
        this.interruptRequestedFlags -= testbit; //Reset the interrupt request.
        this.matchedIrqLines = 0; //Reset the IRQ assertion.
        //Interrupts have a certain clock cycle length:
        this.currentInstructionCycleCount = 20;
        //Set the stack pointer to the current program counter value:
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.writeMemory(this.stackPointer, this.programCounter >> 8);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.writeMemory(this.stackPointer, this.programCounter & 0xff);
        //Set the program counter to the interrupt's address:
        this.programCounter = 0x40 | bitShift << 3;
        //Clock the core for mid-instruction updates:
        this.updateCore();
        return; //We only want the highest priority interrupt.
      }
      testbit = 1 << ++bitShift;
    } while (bitShift < 5);
  }

  /*
    Check for IRQs to be fired while not in HALT:
  */
  checkIrqMatching() {
    if (!this.IME) return;

    this.matchedIrqLines = this.interruptEnabledFlags & this.interruptRequestedFlags & 0x1f;
  }

  /*
    Handle the HALT opcode by predicting all IRQ cases correctly,
    then selecting the next closest IRQ firing from the prediction to
    clock up to. This prevents hacky looping that doesn't predict, but
    instead just clocks through the core update procedure by one which
    is very slow. Not many emulators do this because they have to cover
    all the IRQ prediction cases and they usually get them wrong.
  */
  calculateHALTPeriod() {
    //Initialize our variables and start our prediction:
    if (!this.halt) {
      this.halt = true;
      var currentClocks = -1;
      if (this.gpu.lcdEnabled) {
        //If the LCD is enabled, then predict the LCD IRQs enabled:
        if (((this.interruptEnabledFlags >> 0) & 1) === 1) {
          currentClocks = 456 * ((this.modeSTAT === 1 ? 298 : 144) - this.actualScanline) - this.LCDTicks << this.doubleSpeedShifter;
        }
        if (((this.interruptEnabledFlags >> 1) & 1) === 1) {
          if (this.mode0TriggerSTAT) {
            const temp_var = this.clocksUntilMode0() - this.LCDTicks << this.doubleSpeedShifter;
            if (temp_var <= currentClocks || currentClocks === -1) {
              currentClocks = temp_var;
            }
          }
          if (this.mode1TriggerSTAT && (this.interruptEnabledFlags & 1) === 0) {
            const temp_var = 456 * ((this.modeSTAT === 1 ? 298 : 144) - this.actualScanline) - this.LCDTicks << this.doubleSpeedShifter;
            if (temp_var <= currentClocks || currentClocks === -1) {
              currentClocks = temp_var;
            }
          }
          if (this.mode2TriggerSTAT) {
            const temp_var = (
              (
                this.actualScanline >= 143 ?
                  456 * (totalScanlineCount - this.actualScanline) :
                  456
              ) -
              this.LCDTicks << this.doubleSpeedShifter
            );
            if (temp_var <= currentClocks || currentClocks === -1) {
              currentClocks = temp_var;
            }
          }
          if (this.LYCMatchTriggerSTAT && this.memory[0xff45] <= 153) {
            const temp_var = this.clocksUntilLYCMatch() - this.LCDTicks << this.doubleSpeedShifter;
            if (temp_var <= currentClocks || currentClocks === -1) {
              currentClocks = temp_var;
            }
          }
        }
      }
      if (this.TIMAEnabled && ((this.interruptEnabledFlags >> 2) & 1) === 1) {
        //CPU timer IRQ prediction:
        const temp_var = (0x100 - this.memory[0xff05]) * this.TACClocker - this.timerTicks;
        if (temp_var <= currentClocks || currentClocks === -1) {
          currentClocks = temp_var;
        }
      }
      if (this.serialTimer > 0 && ((this.interruptEnabledFlags >> 3) & 1) === 1) {
        //Serial IRQ prediction:
        if (this.serialTimer <= currentClocks || currentClocks === -1) {
          currentClocks = this.serialTimer;
        }
      }
    } else {
      currentClocks = this.remainingClocks;
    }

    const maxClocks = this.cpu.cyclesTotal - this.cpu.ticks << this.doubleSpeedShifter;
    if (currentClocks >= 0) {
      if (currentClocks <= maxClocks) {
        //Exit out of HALT normally:
        this.currentInstructionCycleCount = Math.max(currentClocks, this.currentInstructionCycleCount);
        this.updateCoreFull();
        this.halt = false;
        this.currentInstructionCycleCount = 0;
      } else {
        //Still in HALT, clock only up to the clocks specified per iteration:
        this.currentInstructionCycleCount = Math.max(maxClocks, this.currentInstructionCycleCount);
        this.remainingClocks = currentClocks - this.currentInstructionCycleCount;
      }
    } else {
      //Still in HALT, clock only up to the clocks specified per iteration:
      //Will stay in HALT forever (Stuck in HALT forever), but the APU and LCD are still clocked, so don't pause:
      this.currentInstructionCycleCount += maxClocks;
    }
  }

  // Memory Reading:
  readMemory = (address: number) => {
    // Act as a wrapper for reading the returns from the compiled jumps to memory.
    if (this.memoryNew.hasReader(address)) return this.memoryNew.read(address);
    return this.memoryReader[address].apply(this, [address]);
  };

  memoryHighRead(address: number) {
    // Act as a wrapper for reading the returns from the compiled jumps to memory.
    if (this.memoryNew.hasHighReader(address)) return this.memoryNew.readHigh(address);
    return this.highMemoryReader[address].apply(this, [address]);
  }

  // Memory Writing:
  writeMemory(address: number, data: number) {
    //Act as a wrapper for writing by compiled jumps to specific memory writing functions.
    if (this.memoryNew.hasWriter(address)) return this.memoryNew.write(address, data);
    return this.memoryWriter[address].apply(this, [address, data]);
  }

  //0xFFXX fast path:
  memoryHighWrite(address: number, data: number) {
    //Act as a wrapper for writing by compiled jumps to specific memory writing functions.
    if (this.memoryNew.hasHighWriter(address)) return this.memoryNew.writeHigh(address, data);
    return this.highMemoryWriter[address].apply(this, [address, data]);
  }

  memoryHighReadNormal = (address: number) => {
    return this.memory[0xff00 | address];
  };

  memoryReadGBCMemory = (address: number) => {
    return this.GBCMemory[address + this.gbcRamBankPosition];
  };

  memoryReadOAM = (address: number) => {
    return this.modeSTAT > 1 ? 0xff : this.memory[address];
  };

  readGbcEchoRam = (address: number) => {
    return this.GBCMemory[address + this.gbcEchoRamBankPosition];
  };

  readEchoRam = (address: number) => {
    return this.memory[address - 0x2000];
  };

  readGbcVideoRam = (address: number) => {
    // CPU Side Reading The VRAM (Optimized for GameBoy Color)
    return this.modeSTAT > 2 ?
      0xff :
      (
        this.currentVideoRamBank === 0 ?
          this.memory[address] :
          this.videoRam[address & 0x1fff]
      );
  };

  readVideoRam = (address: number) => {
    // CPU Side Reading The VRAM (Optimized for classic GameBoy)
    return (
      this.modeSTAT > 2 ?
        0xff :
        this.memory[address]
    );
  };

  readGbcCharacterVideoRam = (address: number) => {
    // CPU Side Reading the Character Data Map:
    return (
      this.modeSTAT > 2 ?
        0xff :
        this.BGCHRCurrentBank[address & 0x7ff]
    );
  };

  readCharacterVideoRam = (address: number) => {
    // CPU Side Reading the Character Data Map:
    return (
      this.modeSTAT > 2 ?
        0xff :
        this.BGCHRBank1[address & 0x7ff]
    );
  };

  memoryWriteNormal = (address: number, data: number) => {
    this.memory[address] = data;
  };

  memoryHighWriteNormal = (address: number, data: number) => {
    this.memory[0xff00 | address] = data;
  };

  memoryWriteGBCRAM = (address: number, data: number) => {
    this.GBCMemory[address + this.gbcRamBankPosition] = data;
  };

  memoryWriteOAMRAM(address: number, data: number) {
    if (this.modeSTAT < 2) {
      //OAM RAM cannot be written to in mode 2 & 3
      if (this.memory[address] !== data) {
        this.graphicsJIT();
        this.memory[address] = data;
      }
    }
  }

  memoryWriteECHOGBCRAM(address: number, data: number) {
    this.GBCMemory[address + this.gbcEchoRamBankPosition] = data;
  }

  memoryWriteECHONormal = (address: number, data: number) => {
    this.memory[address - 0x2000] = data;
  };

  VRAMGBDATAWrite(address: number, data: number) {
    if (this.modeSTAT < 3) {
      //VRAM cannot be written to during mode 3
      if (this.memory[address] !== data) {
        //JIT the graphics render queue:
        this.graphicsJIT();
        this.memory[address] = data;
        this.generateGBOAMTileLine(address);
      }
    }
  }

  VRAMGBDATAUpperWrite(address: number, data: number) {
    if (this.modeSTAT < 3) {
      //VRAM cannot be written to during mode 3
      if (this.memory[address] !== data) {
        //JIT the graphics render queue:
        this.graphicsJIT();
        this.memory[address] = data;
        this.generateGBTileLine(address);
      }
    }
  }

  VRAMGBCDATAWrite(address: number, data: number) {
    if (this.modeSTAT < 3) {
      // VRAM cannot be written to during mode 3
      if (this.currentVideoRamBank === 0) {
        if (this.memory[address] !== data) {
          // JIT the graphics render queue:
          this.graphicsJIT();
          this.memory[address] = data;
          this.generateGBCTileLineBank1(address);
        }
      } else {
        address &= 0x1fff;
        if (this.videoRam[address] !== data) {
          // JIT the graphics render queue:
          this.graphicsJIT();
          this.videoRam[address] = data;
          this.generateGBCTileLineBank2(address);
        }
      }
    }
  }

  VRAMGBCHRMAPWrite(address: number, data: number) {
    if (this.modeSTAT < 3) {
      //VRAM cannot be written to during mode 3
      address &= 0x7ff;
      if (this.BGCHRBank1[address] !== data) {
        //JIT the graphics render queue:
        this.graphicsJIT();
        this.BGCHRBank1[address] = data;
      }
    }
  }

  VRAMGBCCHRMAPWrite(address: number, data: number) {
    if (this.modeSTAT < 3) {
      //VRAM cannot be written to during mode 3
      address &= 0x7ff;
      if (this.BGCHRCurrentBank[address] !== data) {
        //JIT the graphics render queue:
        this.graphicsJIT();
        this.BGCHRCurrentBank[address] = data;
      }
    }
  }

  writeDirectlyToMemory(tilesToTransfer: number) {
    if (!this.halt) {
      //Clock the CPU for the DMA transfer (CPU is halted during the transfer):
      this.currentInstructionCycleCount += 4 | tilesToTransfer << 5 << this.doubleSpeedShifter;
    }
    // Source address of the transfer:
    let source = this.memory[0xff51] << 8 | this.memory[0xff52];
    // Destination address in the VRAM memory range:
    let destination = this.memory[0xff53] << 8 | this.memory[0xff54];
    // JIT the graphics render queue:
    this.graphicsJIT();
    const memory = this.memory;
    // Determining which bank we're working on so we can optimize:
    if (this.currentVideoRamBank === 0) {
      // DMA transfer for VRAM bank 0:
      do {
        if (destination < 0x1800) {
          memory[0x8000 | destination] = this.readMemory(source++);
          memory[0x8001 | destination] = this.readMemory(source++);
          memory[0x8002 | destination] = this.readMemory(source++);
          memory[0x8003 | destination] = this.readMemory(source++);
          memory[0x8004 | destination] = this.readMemory(source++);
          memory[0x8005 | destination] = this.readMemory(source++);
          memory[0x8006 | destination] = this.readMemory(source++);
          memory[0x8007 | destination] = this.readMemory(source++);
          memory[0x8008 | destination] = this.readMemory(source++);
          memory[0x8009 | destination] = this.readMemory(source++);
          memory[0x800a | destination] = this.readMemory(source++);
          memory[0x800b | destination] = this.readMemory(source++);
          memory[0x800c | destination] = this.readMemory(source++);
          memory[0x800d | destination] = this.readMemory(source++);
          memory[0x800e | destination] = this.readMemory(source++);
          memory[0x800f | destination] = this.readMemory(source++);
          this.generateGBCTileBank1(destination);
          destination += 0x10;
        } else {
          destination &= 0x7f0;
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          this.BGCHRBank1[destination++] = this.readMemory(source++);
          destination = destination + 0x1800 & 0x1ff0;
        }
        source &= 0xfff0;
        --tilesToTransfer;
      } while (tilesToTransfer > 0);
    } else {
      var VRAM = this.videoRam;
      //DMA transfer for VRAM bank 1:
      do {
        if (destination < 0x1800) {
          VRAM[destination] = this.readMemory(source++);
          VRAM[destination | 0x1] = this.readMemory(source++);
          VRAM[destination | 0x2] = this.readMemory(source++);
          VRAM[destination | 0x3] = this.readMemory(source++);
          VRAM[destination | 0x4] = this.readMemory(source++);
          VRAM[destination | 0x5] = this.readMemory(source++);
          VRAM[destination | 0x6] = this.readMemory(source++);
          VRAM[destination | 0x7] = this.readMemory(source++);
          VRAM[destination | 0x8] = this.readMemory(source++);
          VRAM[destination | 0x9] = this.readMemory(source++);
          VRAM[destination | 0xa] = this.readMemory(source++);
          VRAM[destination | 0xb] = this.readMemory(source++);
          VRAM[destination | 0xc] = this.readMemory(source++);
          VRAM[destination | 0xd] = this.readMemory(source++);
          VRAM[destination | 0xe] = this.readMemory(source++);
          VRAM[destination | 0xf] = this.readMemory(source++);
          this.generateGBCTileBank2(destination);
          destination += 0x10;
        } else {
          destination &= 0x7f0;
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          this.BGCHRBank2[destination++] = this.readMemory(source++);
          destination = destination + 0x1800 & 0x1ff0;
        }
        source &= 0xfff0;
        --tilesToTransfer;
      } while (tilesToTransfer > 0);
    }
    // Update the HDMA registers to their next addresses:
    memory[0xff51] = source >> 8;
    memory[0xff52] = source & 0xf0;
    memory[0xff53] = destination >> 8;
    memory[0xff54] = destination & 0xf0;
  };
}
