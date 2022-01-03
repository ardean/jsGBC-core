import CPU from "./CPU";
import ROM from "./ROM";
import { GameBoy } from "..";
import Joypad from "./Joypad";
import * as util from "../util";
import settings from "../settings";
import tickTable from "./tickTable";
import Memory from "./memory/Memory";
import LcdDevice from "./lcd/device";
import { EventEmitter } from "events";
import StateManager from "./StateManager";
import AudioDevice from "./audio/AudioDevice";
import Cartridge from "./cartridge/Cartridge";
import * as MemoryLayout from "./memory/Layout";
import GPU, { totalScanlineCount } from "./GPU";
import mainInstructions from "./MainInstructions";
import AudioController from "./audio/AudioController";
import postBootRegisterState from "./postBootRegisterState";

export default class GameBoyCore {
  // Graphics Variables
  drewFrame = false; //Throttle how many draws we can do to once per iteration.
  midScanlineOffset = -1; //mid-scanline rendering offset.
  currentX = 0; //The x-coord we left off at for mid-scanline rendering.
  stopEmulator = 3; // Has the emulation been paused or a frame has ended?
  IRQLineMatched = 0; // CPU IRQ assertion.

  ROMBank1Offset: any;
  haltPostClocks: any;
  spriteCount: number = 252; // Mode 3 extra clocking counter (Depends on how many sprites are on the current line.).
  BGCHRCurrentBank: any; // BG Tile Pointer Caches:
  tileCache: any; // Tile Data Cache
  colors: number[] = [0xefffde, 0xadd794, 0x529273, 0x183442]; // "Classic" GameBoy palette colors.
  OBJPalette: any;
  BGPalette: any;
  updateGBBGPalette: (data: any) => void;
  updateGBOBJPalette: (index: any, data: any) => void;
  pixelStart: number = 0; // Temp variable for holding the current working framebuffer offset.
  pixelEnd: number = 0; // track the x-coord limit for line rendering (mid-scanline usage).
  cartridge: Cartridge;
  memory: Uint8Array;
  isBootingRom: boolean = true;
  VRAM: Uint8Array;
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
  actualScanLine: number;
  lastUnrenderedLine: number;
  gfxWindowDisplay: boolean;
  gfxSpriteShow: boolean;
  gfxSpriteNormalHeight: boolean;
  backgroundEnabled: boolean;
  hasBGPriority: boolean;
  gfxWindowCHRBankPosition: number;
  gfxBackgroundCHRBankPosition: number;
  gfxBackgroundBankOffset: number;
  windowY: number;
  windowX: number;
  drewBlank: number;
  programCounter: number;
  stackPointer: number;
  halt: any;
  skipPCIncrement: any;
  doubleSpeedShifter: number;
  colorizedGBPalettes: any;
  backgroundX: number;
  gbcOBJRawPalette: Uint8Array;
  gbcBGRawPalette: Uint8Array;
  gbcOBJPalette: util.TypedArray;
  gbcBGPalette: util.TypedArray;
  BGCHRBank2: util.TypedArray;
  currVRAMBank: number;
  gbOBJPalette: util.TypedArray;
  gbBGPalette: util.TypedArray;
  sortBuffer: util.TypedArray;
  OAMAddressCache: util.TypedArray;
  gbBGColorizedPalette: util.TypedArray;
  gbOBJColorizedPalette: util.TypedArray;
  cachedBGPaletteConversion: util.TypedArray;
  cachedOBJPaletteConversion: util.TypedArray;
  backgroundY: any;
  queuedScanLines: number;
  remainingClocks: number;
  gbcRamBankPosition: any;
  gbcRamBankPositionECHO: any;
  gbcRamBank: number;
  stateManager: StateManager;
  lcdDevice: LcdDevice;
  joypad: Joypad;
  audioController: AudioController;
  audioDevice: AudioDevice;
  cpu: CPU;
  gpu: GPU;
  memoryNew: Memory;
  events: EventEmitter;
  api: GameBoy;

  usedBootRom: boolean;

  gbBootRom?: ROM;
  gbcBootRom?: ROM;
  usedGbcBootRom: boolean;

  memoryReader = []; // Array of functions mapped to read back memory
  memoryWriter = []; // Array of functions mapped to write to memory
  highMemoryReader = []; // Array of functions mapped to read back 0xFFXX memory
  highMemoryWriter = []; // Array of functions mapped to write to 0xFFXX memory

  constructor(
    {
      api,
      audio: audioOptions = {},
      lcd: lcdOptions = {}
    }: any
  ) {
    this.api = api;

    this.events = new EventEmitter(); // TODO: use as super

    lcdOptions.gameboy = this;

    this.cpu = new CPU();
    this.gpu = new GPU(this);
    this.audioDevice = new AudioDevice({
      context: audioOptions.context,
      channels: 2
    });
    this.audioController = new AudioController({
      cpu: this.cpu,
      gameboy: this
    });
    this.joypad = new Joypad(this);
    this.lcdDevice = new LcdDevice(lcdOptions);
    this.stateManager = new StateManager(this);
    this.stateManager.init();

    // Palettes:
    this.updateGBBGPalette = this.updateGBRegularBGPalette;
    this.updateGBOBJPalette = this.updateGBRegularOBJPalette;
  }

  loadState(state) {
    this.stateManager.load(state);

    this.initializeReferencesFromSaveState();
    this.memoryNew.init();
    this.lcdDevice.init();
    this.audioController.noiseSampleTable = this.audioController.channel4BitRange === 0x7fff ? this.audioController.LSFR15Table : this.audioController.LSFR7Table;
    this.audioController.channel4VolumeShifter = this.audioController.channel4BitRange === 0x7fff ? 15 : 7;
  }

  connectCartridge(cartridge: Cartridge) {
    this.cartridge?.mbc?.removeListener("rumble", this.onRumble);

    this.cartridge?.disconnect();
    cartridge.connect(this);

    cartridge.interpret();
    if (cartridge?.mbc) {
      cartridge.mbc.addListener("rumble", this.onRumble);
      cartridge.mbc.setupROM();
      cartridge.mbc.on("ramWrite", () => {
        this.events.emit("mbcRamWrite");
      });
    }

    this.cartridge = cartridge;

    this.loadCartridgeRomIntoMemory();
    if (this.gbcBootRom) this.loadGbcBootRomIntoMemory();
    else if (this.gbBootRom) this.loadGbBootRomIntoMemory();
  }

  onRumble() {
    if (
      typeof window !== "undefined" &&
      "vibrate" in window.navigator
    ) {
      window.navigator.vibrate(200);
    }
  }

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

    // Initialize the RAM:
    this.memory = new Uint8Array(0x10000);
    this.audioController.setMemory(this.memory);
    this.frameBuffer = util.getTypedArray(23040, 0xf8f8f8, "int32") as Int32Array;
    this.BGCHRBank1 = new Uint8Array(0x800);
    this.audioController.initMemory();

    this.memoryNew = new Memory(this, this.memory);

    this.lcdDevice.init(); // Initialize the graphics.

    this.audioController.connectDevice(this.audioDevice);

    this.connectCartridge(cartridge);

    this.cartridge.setupRAM();

    // Setup the RAM for GBC mode.
    if (this.cartridge.useGbcMode) {
      this.VRAM = new Uint8Array(0x2000);
      this.GBCMemory = new Uint8Array(0x7000);
    }

    this.memoryNew.init();

    if (this.cartridge.useGbcMode) {
      this.gbcOBJRawPalette = new Uint8Array(0x40);
      this.gbcBGRawPalette = new Uint8Array(0x40);
      this.gbcOBJPalette = util.getTypedArray(0x20, 0x1000000, "int32");
      this.gbcBGPalette = util.getTypedArray(0x40, 0, "int32");
      this.BGCHRBank2 = util.getTypedArray(0x800, 0, "uint8");
      this.BGCHRCurrentBank = this.currVRAMBank > 0 ?
        this.BGCHRBank2 :
        this.BGCHRBank1;
      this.tileCache = this.generateCacheArray(0xf80);
    } else {
      this.gbOBJPalette = util.getTypedArray(8, 0, "int32");
      this.gbBGPalette = util.getTypedArray(4, 0, "int32");
      this.BGPalette = this.gbBGPalette;
      this.OBJPalette = this.gbOBJPalette;
      this.tileCache = this.generateCacheArray(0x700);
      this.sortBuffer = util.getTypedArray(0x100, 0, "uint8");
      this.OAMAddressCache = util.getTypedArray(10, 0, "int32");
    }
    this.gpu.initRenderFunctions();

    if (!this.usedBootRom) {
      this.isBootingRom = false;
      this.initSkipBootstrap();
    } else {
      this.initBootstrap();
    }

    // Check for IRQ matching upon initialization:
    this.checkIRQMatching();
  }

  generateCacheArray(tileAmount: number) {
    const tileArray = [];
    let tileNumber = 0;
    while (tileNumber < tileAmount) {
      tileArray[tileNumber++] = new Uint8Array(64);
    }
    return tileArray;
  }

  initSkipBootstrap() {
    // Fill in the boot ROM set register values
    // Default values to the GB boot ROM values, then fill in the GBC boot ROM values after ROM loading
    var index = 0xff;
    while (index >= 0) {
      if (index >= 0x30 && index < 0x40) {
        this.writeMemory(0xff00 | index, postBootRegisterState[index]);
      } else {
        switch (index) {
          case 0x00:
          case 0x01:
          case 0x02:
          case 0x05:
          case 0x07:
          case 0x0f:
          case 0xff:
            this.writeMemory(0xff00 | index, postBootRegisterState[index]);
            break;
          default:
            this.memory[0xff00 | index] = postBootRegisterState[index];
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
    this.registerA = this.cartridge.useGbcMode ? 0x11 : 0x1;
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
    this.IRQLineMatched = 0;
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
    this.actualScanLine = 144;
    this.lastUnrenderedLine = 0;
    this.gfxWindowDisplay = false;
    this.gfxSpriteShow = false;
    this.gfxSpriteNormalHeight = true;
    this.backgroundEnabled = true;
    this.hasBGPriority = true;
    this.gfxWindowCHRBankPosition = 0;
    this.gfxBackgroundCHRBankPosition = 0;
    this.gfxBackgroundBankOffset = 0;
    this.windowY = 0;
    this.windowX = 0;
    this.drewBlank = 0;
    this.midScanlineOffset = -1;
    this.currentX = 0;
  }

  initBootstrap() {
    console.log("Starting selected boot ROM");

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
    if ((this.stopEmulator & 2) === 0) {
      if ((this.stopEmulator & 1) === 1) {
        if (!this.cpu.stopped) {
          this.stopEmulator = 0;

          this.audioController.adjustUnderrun();

          if (this.cartridge?.hasRTC) {
            this.cartridge.mbc?.rtc?.updateClock();
          }

          if (!this.halt) {
            this.executeIteration();
          } else {
            // Finish the HALT rundown execution.
            this.currentInstructionCycleCount = 0;
            this.calculateHALTPeriod();

            if (!this.halt) {
              this.executeIteration();
            } else {
              this.updateCore();
              this.iterationEndRoutine();
            }
          }
          // Request the graphics target to be updated:
          this.lcdDevice.requestDraw();
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
          this.checkIRQMatching();
          --this.IRQEnableDelay;
          break;
        case 2:
          --this.IRQEnableDelay;
          break;
        default:
          break;
      }
      //Is an IRQ set to fire?:
      if (this.IRQLineMatched > 0) {
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

      this.gpu.runScanline(this.actualScanLine); // Scan Line and STAT Mode Control

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
            this.checkIRQMatching();
          }
        }
      }

      if (this.serialTimer > 0) {
        // Serial Timing
        // IRQ Counter:
        this.serialTimer -= this.currentInstructionCycleCount;
        if (this.serialTimer <= 0) {
          this.interruptRequestedFlags |= 0x8;
          this.checkIRQMatching();
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
      this.memory[MemoryLayout.DIV_REG] = this.memory[MemoryLayout.DIV_REG] + (this.DIVTicks >> 8) & 0xff;
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
        this.checkIRQMatching();
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
        this.checkIRQMatching();
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
            this.checkIRQMatching();
          }
          this.modeSTAT = 3;
        }
        this.incrementScanLineQueue();
        this.updateSpriteCount(this.actualScanLine);
        this.STATTracker = 2;
      }
      if (this.LCDTicks >= this.spriteCount) {
        if (this.hdmaRunning) {
          this.executeHDMA();
        }
        if (this.mode0TriggerSTAT) {
          this.interruptRequestedFlags |= 0x2;
          this.checkIRQMatching();
        }
        this.STATTracker = 3;
        this.modeSTAT = 0;
      }
    }
  }

  clocksUntilLYCMatch() {
    if (this.memory[0xff45] !== 0) {
      if (this.memory[0xff45] > this.actualScanLine) {
        return (
          456 *
          (
            this.memory[0xff45] -
            this.actualScanLine
          )
        );
      }

      return (
        456 *
        (
          totalScanlineCount -
          this.actualScanLine +
          this.memory[0xff45]
        )
      );
    }

    return (
      456 *
      (
        (
          this.actualScanLine === 153 &&
          this.memory[0xff44] === 0
        ) ?
          totalScanlineCount :
          153 - this.actualScanLine
      ) +
      8
    );
  }

  clocksUntilMode0() {
    switch (this.modeSTAT) {
      case 0:
        if (this.actualScanLine === 143) {
          this.updateSpriteCount(0);
          return this.spriteCount + 5016;
        }
        this.updateSpriteCount(this.actualScanLine + 1);
        return this.spriteCount + 456;
      case 2:
      case 3:
        this.updateSpriteCount(this.actualScanLine);
        return this.spriteCount;
      case 1:
        this.updateSpriteCount(0);
        return this.spriteCount + 456 * (totalScanlineCount - this.actualScanLine);
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
        this.checkIRQMatching();
      }
    } else {
      this.memory[0xff41] &= 0x7b;
    }
  }

  updateCore() {
    //Update the clocking for the LCD emulation:
    this.LCDTicks += this.currentInstructionCycleCount >> this.doubleSpeedShifter; // LCD Timing
    this.gpu.runScanline(this.actualScanLine); //Scan Line and STAT Mode Control
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
          this.checkIRQMatching();
        }
      }
    }
    if (this.serialTimer > 0) {
      //Serial Timing
      //IRQ Counter:
      this.serialTimer -= this.currentInstructionCycleCount;
      if (this.serialTimer <= 0) {
        this.interruptRequestedFlags |= 0x8;
        this.checkIRQMatching();
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

  renderScanLine(scanline: number) {
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

  renderMidScanLine() {
    if (this.actualScanLine < 144 && this.modeSTAT === 3) {
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
    this.VRAM = this.GBCMemory = this.BGCHRCurrentBank = this.BGCHRBank2 = undefined;
    this.tileCache.length = 0x700;
    if (settings.colorizeGBMode) {
      this.gbBGColorizedPalette = util.getTypedArray(4, 0, "int32");
      this.gbOBJColorizedPalette = util.getTypedArray(8, 0, "int32");
      this.cachedBGPaletteConversion = util.getTypedArray(4, 0, "int32");
      this.cachedOBJPaletteConversion = util.getTypedArray(8, 0, "int32");
      this.BGPalette = this.gbBGColorizedPalette;
      this.OBJPalette = this.gbOBJColorizedPalette;
      this.gbOBJPalette = this.gbBGPalette = undefined;
      this.getGBCColor();
    } else {
      this.gbOBJPalette = util.getTypedArray(8, 0, "int32");
      this.gbBGPalette = util.getTypedArray(4, 0, "int32");
      this.BGPalette = this.gbBGPalette;
      this.OBJPalette = this.gbOBJPalette;
    }
    this.sortBuffer = util.getTypedArray(0x100, 0, "uint8");
    this.OAMAddressCache = util.getTypedArray(10, 0, "int32");
    this.gpu.initRenderFunctions();
    this.memoryNew.init();
  }

  initializeReferencesFromSaveState() {
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

      this.sortBuffer = util.getTypedArray(0x100, 0, "uint8");
      this.OAMAddressCache = util.getTypedArray(10, 0, "int32");
    } else {
      this.BGCHRCurrentBank = this.currVRAMBank > 0 ? this.BGCHRBank2 : this.BGCHRBank1;
      this.tileCache = this.generateCacheArray(0xf80);
      for (let tileIndex = 0; tileIndex < 0x1800; tileIndex += 0x10) {
        this.generateGBCTileBank1(tileIndex);
        this.generateGBCTileBank2(tileIndex);
      }
    }
    this.gpu.initRenderFunctions();
  }

  adjustRGBTint(value: number) {
    // Adjustment for the GBC's tinting (According to Gambatte):
    const red = value & 0x1f;
    const green = value >> 5 & 0x1f;
    const blue = value >> 10 & 0x1f;
    return red * 13 + green * 2 + blue >> 1 << 16 | green * 3 + blue << 9 | red * 3 + green * 2 + blue * 11 >> 1;
  }

  getGBCColor() {
    // GBC Colorization of DMG ROMs:
    // BG
    for (let counter = 0; counter < 4; counter++) {
      const adjustedIndex = counter << 1;
      // BG
      this.cachedBGPaletteConversion[counter] = this.adjustRGBTint(this.gbcBGRawPalette[adjustedIndex | 1] << 8 | this.gbcBGRawPalette[adjustedIndex]);
      // OBJ 1
      this.cachedOBJPaletteConversion[counter] = this.adjustRGBTint(this.gbcOBJRawPalette[adjustedIndex | 1] << 8 | this.gbcOBJRawPalette[adjustedIndex]);
    }

    // OBJ 2
    for (let counter = 4; counter < 8; counter++) {
      const adjustedIndex = counter << 1;
      this.cachedOBJPaletteConversion[counter] = this.adjustRGBTint(this.gbcOBJRawPalette[adjustedIndex | 1] << 8 | this.gbcOBJRawPalette[adjustedIndex]);
    }

    // Update the palette entries:
    this.updateGBBGPalette = this.updateGBColorizedBGPalette;
    this.updateGBOBJPalette = this.updateGBColorizedOBJPalette;
    this.updateGBBGPalette(this.memory[0xff47]);
    this.updateGBOBJPalette(0, this.memory[0xff48]);
    this.updateGBOBJPalette(1, this.memory[0xff49]);
    this.colorizedGBPalettes = true;
  }

  updateGBRegularBGPalette(data) {
    this.gbBGPalette[0] = this.colors[data & 0x03] | 0x2000000;
    this.gbBGPalette[1] = this.colors[data >> 2 & 0x03];
    this.gbBGPalette[2] = this.colors[data >> 4 & 0x03];
    this.gbBGPalette[3] = this.colors[data >> 6];
  }

  updateGBColorizedBGPalette(data) {
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
    if (this.gbcBGRawPalette[address] != data) {
      this.midScanLineJIT();
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
        this.midScanLineJIT();
        this.gbcOBJPalette[address >> 1] = 0x1000000 | this.adjustRGBTint(this.gbcOBJRawPalette[address | 1] << 8 | this.gbcOBJRawPalette[address & 0x3e]);
      }
    }
  }

  findLowestSpriteDrawable(scanlineToRender, drawableRange) {
    var address = 0xfe00;
    var spriteCount = 0;
    var diff = 0;
    while (address < 0xfea0 && spriteCount < 10) {
      diff = scanlineToRender - this.memory[address];
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
    var lineCopy = this.VRAM[0x1 | address] << 8 | this.VRAM[0x1ffe & address];
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
      lineCopy = this.VRAM[0x1 | vramAddress] << 8 | this.VRAM[vramAddress];
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
      this.graphicsJITScanlineGroup();
    }
  }

  graphicsJITVBlank() {
    // JIT the graphics to v-blank framing:
    this.cpu.totalLinesPassed += this.queuedScanLines;
    this.graphicsJITScanlineGroup();
  }

  graphicsJITScanlineGroup() {
    // Normal rendering JIT, where we try to do groups of scanlines at once:
    while (this.queuedScanLines > 0) {
      this.renderScanLine(this.lastUnrenderedLine);
      if (this.lastUnrenderedLine < 143) {
        ++this.lastUnrenderedLine;
      } else {
        this.lastUnrenderedLine = 0;
      }
      --this.queuedScanLines;
    }
  }

  incrementScanLineQueue() {
    if (this.queuedScanLines < 144) {
      ++this.queuedScanLines;
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

  midScanLineJIT() {
    this.graphicsJIT();
    this.renderMidScanLine();
  }

  //Check for the highest priority IRQ to fire:
  launchIRQ() {
    var bitShift = 0;
    var testbit = 1;
    do {
      //Check to see if an interrupt is enabled AND requested.
      if ((testbit & this.IRQLineMatched) === testbit) {
        this.IME = false; //Reset the interrupt enabling.
        this.interruptRequestedFlags -= testbit; //Reset the interrupt request.
        this.IRQLineMatched = 0; //Reset the IRQ assertion.
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
  checkIRQMatching() {
    if (this.IME) {
      this.IRQLineMatched = this.interruptEnabledFlags & this.interruptRequestedFlags & 0x1f;
    }
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
          currentClocks = 456 * ((this.modeSTAT === 1 ? 298 : 144) - this.actualScanLine) - this.LCDTicks << this.doubleSpeedShifter;
        }
        if (((this.interruptEnabledFlags >> 1) & 1) === 1) {
          if (this.mode0TriggerSTAT) {
            const temp_var = this.clocksUntilMode0() - this.LCDTicks << this.doubleSpeedShifter;
            if (temp_var <= currentClocks || currentClocks === -1) {
              currentClocks = temp_var;
            }
          }
          if (this.mode1TriggerSTAT && (this.interruptEnabledFlags & 1) === 0) {
            const temp_var = 456 * ((this.modeSTAT === 1 ? 298 : 144) - this.actualScanLine) - this.LCDTicks << this.doubleSpeedShifter;
            if (temp_var <= currentClocks || currentClocks === -1) {
              currentClocks = temp_var;
            }
          }
          if (this.mode2TriggerSTAT) {
            const temp_var = (
              (
                this.actualScanLine >= 143 ?
                  456 * (totalScanlineCount - this.actualScanLine) :
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
  readMemory(address: number) {
    // Act as a wrapper for reading the returns from the compiled jumps to memory.
    if (this.memoryNew.hasReader(address)) return this.memoryNew.read(address);
    return this.memoryReader[address].apply(this, [address]);
  }

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

  memoryReadNormal = (address: number) => {
    return this.memory[address];
  };

  memoryHighReadNormal = (address: number) => {
    return this.memory[0xff00 | address];
  };

  memoryReadROM = (address: number) => {
    return this.cartridge.rom.getByte(
      this.cartridge.mbc.currentRomBank +
      address
    );
  };

  memoryReadMBC = (address: number) => {
    return this.cartridge.mbc.readRam(address);
  };

  memoryReadMBC7 = (address: number) => {
    return this.cartridge.mbc.readRam(address);
  };

  memoryReadMBC3 = (address: number) => {
    return this.cartridge.mbc.readRam(address);
  };

  memoryReadGBCMemory = (address: number) => {
    return this.GBCMemory[address + this.gbcRamBankPosition];
  };

  memoryReadOAM = (address: number) => {
    return this.modeSTAT > 1 ? 0xff : this.memory[address];
  };

  memoryReadECHOGBCMemory = (address: number) => {
    return this.GBCMemory[address + this.gbcRamBankPositionECHO];
  };

  memoryReadECHONormal = (address: number) => {
    return this.memory[address - 0x2000];
  };

  VRAMDATAReadCGBCPU = (address: number) => {
    // CPU Side Reading The VRAM (Optimized for GameBoy Color)
    return this.modeSTAT > 2 ?
      0xff :
      (
        this.currVRAMBank === 0 ?
          this.memory[address] :
          this.VRAM[address & 0x1fff]
      );
  };

  VRAMDATAReadDMGCPU = (address: number) => {
    // CPU Side Reading The VRAM (Optimized for classic GameBoy)
    return this.modeSTAT > 2 ? 0xff : this.memory[address];
  };

  VRAMCHRReadCGBCPU = (address: number) => {
    // CPU Side Reading the Character Data Map:
    return this.modeSTAT > 2 ? 0xff : this.BGCHRCurrentBank[address & 0x7ff];
  };

  VRAMCHRReadDMGCPU(address: number) {
    // CPU Side Reading the Character Data Map:
    return this.modeSTAT > 2 ? 0xff : this.BGCHRBank1[address & 0x7ff];
  }

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
      if (this.memory[address] != data) {
        this.graphicsJIT();
        this.memory[address] = data;
      }
    }
  }

  memoryWriteECHOGBCRAM(address: number, data: number) {
    this.GBCMemory[address + this.gbcRamBankPositionECHO] = data;
  }

  memoryWriteECHONormal = (address: number, data: number) => {
    this.memory[address - 0x2000] = data;
  };

  VRAMGBDATAWrite(address: number, data: number) {
    if (this.modeSTAT < 3) {
      //VRAM cannot be written to during mode 3
      if (this.memory[address] != data) {
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
      if (this.memory[address] != data) {
        //JIT the graphics render queue:
        this.graphicsJIT();
        this.memory[address] = data;
        this.generateGBTileLine(address);
      }
    }
  }

  VRAMGBCDATAWrite(address: number, data: number) {
    if (this.modeSTAT < 3) {
      //VRAM cannot be written to during mode 3
      if (this.currVRAMBank === 0) {
        if (this.memory[address] != data) {
          //JIT the graphics render queue:
          this.graphicsJIT();
          this.memory[address] = data;
          this.generateGBCTileLineBank1(address);
        }
      } else {
        address &= 0x1fff;
        if (this.VRAM[address] != data) {
          //JIT the graphics render queue:
          this.graphicsJIT();
          this.VRAM[address] = data;
          this.generateGBCTileLineBank2(address);
        }
      }
    }
  }

  VRAMGBCHRMAPWrite(address: number, data: number) {
    if (this.modeSTAT < 3) {
      //VRAM cannot be written to during mode 3
      address &= 0x7ff;
      if (this.BGCHRBank1[address] != data) {
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
      if (this.BGCHRCurrentBank[address] != data) {
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
    var source = this.memory[0xff51] << 8 | this.memory[0xff52];
    // Destination address in the VRAM memory range:
    var destination = this.memory[0xff53] << 8 | this.memory[0xff54];
    // JIT the graphics render queue:
    this.graphicsJIT();
    var memory = this.memory;
    // Determining which bank we're working on so we can optimize:
    if (this.currVRAMBank === 0) {
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
      var VRAM = this.VRAM;
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