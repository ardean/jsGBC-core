import * as util from "../util";
import settings from "../settings";
import TickTable from "./tick-table";
import AudioDevice from "./audio/device";
import AudioController from "./audio/controller";
import LcdDevice from "./lcd/device";
import LcdController from "./lcd/controller";
import mainInstructions from "./MainInstructions";
import PostBootRegisterState from "./post-boot-register-state";
import StateManager from "./state-manager";
import dutyLookup from "./duty-lookup";
import Joypad from "./Joypad";
import { EventEmitter } from "events";
import Memory from "./memory/index";
import CPU from "./cpu";
import { GameBoy } from "..";
import Cartridge from "./cartridge";
import * as MemoryLayout from "./memory/Layout";

export default class GameBoyCore {
  useGBCMode: any;
  ROMBank1Offset: any;
  BGPriorityEnabled: any;
  channel1FrequencyCounter: any;
  channel1totalLength: any;
  channel1envelopeVolume: any;
  channel1envelopeType: any;
  channel1envelopeSweeps: any;
  channel1envelopeSweepsLast: any;
  channel1consecutive: any;
  channel1frequency: any;
  channel1SweepFault: any;
  channel1ShadowFrequency: any;
  channel1timeSweep: any;
  channel1lastTimeSweep: any;
  channel1Swept: any;
  channel1frequencySweepDivider: any;
  channel1decreaseSweep: any;
  channel2FrequencyTracker: any;
  channel2FrequencyCounter: any;
  channel2totalLength: any;
  channel2envelopeVolume: any;
  channel2envelopeType: any;
  channel2envelopeSweeps: any;
  channel2envelopeSweepsLast: any;
  channel2consecutive: any;
  channel2frequency: any;
  channel3canPlay: any;
  channel3totalLength: any;
  channel3patternType: any;
  channel3frequency: any;
  channel3consecutive: any;
  channel3PCM: any;
  channel4totalLength: any;
  channel4envelopeVolume: any;
  channel4currentVolume: any;
  channel4envelopeType: any;
  channel4envelopeSweeps: any;
  channel4envelopeSweepsLast: any;
  channel4consecutive: any;
  channel4BitRange: any;
  leftChannel1: any;
  leftChannel2: any;
  leftChannel3: any;
  leftChannel4: any;
  rightChannel1: any;
  rightChannel2: any;
  rightChannel3: any;
  rightChannel4: any;
  channel1currentSampleLeft: any;
  channel1currentSampleRight: any;
  channel2currentSampleLeft: any;
  channel2currentSampleRight: any;
  channel3currentSampleLeft: any;
  channel3currentSampleRight: any;
  channel4currentSampleLeft: any;
  channel4currentSampleRight: any;
  channel1currentSampleLeftSecondary: any;
  channel1currentSampleRightSecondary: any;
  channel2currentSampleLeftSecondary: any;
  channel2currentSampleRightSecondary: any;
  channel3currentSampleLeftSecondary: any;
  channel3currentSampleRightSecondary: any;
  channel4currentSampleLeftSecondary: any;
  channel4currentSampleRightSecondary: any;
  channel1currentSampleLeftTrimary: any;
  channel1currentSampleRightTrimary: any;
  channel2currentSampleLeftTrimary: any;
  channel2currentSampleRightTrimary: any;
  channel3Counter: any;
  channel3FrequencyPeriod: any;
  channel3lastSampleLookup: any;
  haltPostClocks: any;
  spriteCount: number;
  LINECONTROL: any[];
  DISPLAYOFFCONTROL: (() => void)[];
  LCDCONTROL: any;
  drewFrame: boolean;
  midScanlineOffset: number;
  pixelEnd: number;
  currentX: number;
  BGCHRCurrentBank: any;
  tileCache: any;
  colors: number[];
  OBJPalette: any;
  BGPalette: any;
  updateGBBGPalette: (data: any) => void;
  updateGBOBJPalette: (index: any, data: any) => void;
  renderBGLayer: any;
  renderWindowLayer: any;
  renderSpriteLayer: any;
  pixelStart: number;
  cartridge: Cartridge;
  memory: any;
  usedBootROM: any;
  inBootstrap: boolean;
  VRAM: util.TypedArray;
  GBCMemory: util.TypedArray;
  frameBuffer: util.TypedArray;
  BGCHRBank1: util.TypedArray;
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
  interruptsRequested: number;
  interruptsEnabled: number;
  hdmaRunning: boolean;
  CPUTicks: number;
  STATTracker: number;
  modeSTAT: number;
  LYCMatchTriggerSTAT: boolean;
  mode2TriggerSTAT: boolean;
  mode1TriggerSTAT: boolean;
  mode0TriggerSTAT: boolean;
  LCDisOn: boolean;
  soundMasterEnabled: boolean;
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
  bgEnabled: boolean;
  hasBGPriority: boolean;
  gfxWindowCHRBankPosition: number;
  gfxBackgroundCHRBankPosition: number;
  gfxBackgroundBankOffset: number;
  windowY: number;
  windowX: number;
  drewBlank: number;
  programCounter: number;
  stackPointer: number;
  usedGBCBootROM: any;
  CPUStopped: any;
  halt: any;
  skipPCIncrement: any;
  doubleSpeedShifter: any;
  colorizedGBPalettes: any;
  backgroundX: number;
  gbcOBJRawPalette: util.TypedArray;
  gbcBGRawPalette: util.TypedArray;
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
  memoryHighWriter: any[];
  memoryHighReader: any[];
  memoryWriter: any[];
  memoryReader: any[];
  IRQLineMatched: number;
  stopEmulator: number;
  GBCBOOTROM: any[];
  GBBOOTROM: any[];
  lcdController: LcdController;
  stateManager: StateManager;
  lcdDevice: LcdDevice;
  joypad: Joypad;
  audioController: AudioController;
  audioDevice: AudioDevice;
  cpu: CPU;
  memoryNew: Memory;
  events: EventEmitter;
  api: GameBoy;

  constructor({
    audio: audioOptions = {},
    api,
    lcd: lcdOptions = {}
  }: any) {
    this.api = api;

    this.events = new EventEmitter(); // TODO: use as super

    lcdOptions.gameboy = this;

    this.cpu = new CPU();
    this.audioDevice = new AudioDevice({
      context: audioOptions.context,
      channels: 2,
      volume: settings.soundVolume
    });
    this.audioController = new AudioController({
      cpu: this.cpu,
      gameboy: this
    });
    this.joypad = new Joypad(this);
    this.lcdDevice = new LcdDevice(lcdOptions);
    this.lcdController = new LcdController();
    this.stateManager = new StateManager(this);
    this.stateManager.init();

    //GB BOOT ROM
    //Add 256 byte boot rom here if you are going to use it.
    this.GBBOOTROM = [];

    //GBC BOOT ROM
    //Add 2048 byte boot rom here if you are going to use it.
    this.GBCBOOTROM = [];

    this.memoryReadNormal = this.memoryReadNormal.bind(this);
    this.memoryWriteNormal = this.memoryWriteNormal.bind(this);
    this.memoryWriteGBCRAM = this.memoryWriteGBCRAM.bind(this);
    this.memoryWriteMBCRAM = this.memoryWriteMBCRAM.bind(this);
    this.memoryWriteMBC3RAM = this.memoryWriteMBC3RAM.bind(this);
    this.memoryReadGBCMemory = this.memoryReadGBCMemory.bind(this);
    this.memoryReadROM = this.memoryReadROM.bind(this);
    this.memoryHighWriteNormal = this.memoryHighWriteNormal.bind(this);
    this.memoryHighReadNormal = this.memoryHighReadNormal.bind(this);
    this.MBC5WriteRAMBank = this.MBC5WriteRAMBank.bind(this);
    this.MBCWriteEnable = this.MBCWriteEnable.bind(this);
    this.RUMBLEWriteRAMBank = this.RUMBLEWriteRAMBank.bind(this);
    this.onRUMBLE = this.onRUMBLE.bind(this);
    this.memoryReadMBC = this.memoryReadMBC.bind(this);
    this.memoryReadMBC3 = this.memoryReadMBC3.bind(this);
    this.memoryReadMBC7 = this.memoryReadMBC7.bind(this);
    this.memoryReadECHONormal = this.memoryReadECHONormal.bind(this);
    this.memoryReadECHOGBCMemory = this.memoryReadECHOGBCMemory.bind(this);
    this.memoryWriteECHONormal = this.memoryWriteECHONormal.bind(this);
    this.VRAMDATAReadCGBCPU = this.VRAMDATAReadCGBCPU.bind(this);
    this.VRAMDATAReadDMGCPU = this.VRAMDATAReadDMGCPU.bind(this);
    this.VRAMCHRReadCGBCPU = this.VRAMCHRReadCGBCPU.bind(this);

    this.renderBGGBLayer = this.renderBGGBLayer.bind(this);
    this.renderWindowGBLayer = this.renderWindowGBLayer.bind(this);
    this.renderSpriteGBLayer = this.renderSpriteGBLayer.bind(this);
    this.renderSpriteGBCLayer = this.renderSpriteGBCLayer.bind(this);

    this.stopEmulator = 3; // Has the emulation been paused or a frame has ended?
    this.IRQLineMatched = 0; // CPU IRQ assertion.

    // Main RAM, MBC RAM, GBC Main RAM, VRAM, etc.
    this.memoryReader = []; // Array of functions mapped to read back memory
    this.memoryWriter = []; // Array of functions mapped to write to memory
    this.memoryHighReader = []; // Array of functions mapped to read back 0xFFXX memory
    this.memoryHighWriter = []; // Array of functions mapped to write to 0xFFXX memory
    this.spriteCount = 252; // Mode 3 extra clocking counter (Depends on how many sprites are on the current line.).
    this.LINECONTROL = []; // Array of functions to handle each scan line we do (onscreen + offscreen)
    this.DISPLAYOFFCONTROL = [function () { }]; // Array of line 0 function to handle the LCD controller when it's off (Do nothing!).

    this.LCDCONTROL = null; //Pointer to either LINECONTROL or DISPLAYOFFCONTROL.
    this.initializeLCDController(); //Compile the LCD controller functions.

    //Graphics Variables
    this.drewFrame = false; //Throttle how many draws we can do to once per iteration.
    this.midScanlineOffset = -1; //mid-scanline rendering offset.
    this.pixelEnd = 0; //track the x-coord limit for line rendering (mid-scanline usage).
    this.currentX = 0; //The x-coord we left off at for mid-scanline rendering.

    //BG Tile Pointer Caches:
    this.BGCHRCurrentBank = null;

    //Tile Data Cache:
    this.tileCache = null;

    //Palettes:
    this.colors = [0xefffde, 0xadd794, 0x529273, 0x183442]; // "Classic" GameBoy palette colors.
    this.OBJPalette = null;
    this.BGPalette = null;
    this.updateGBBGPalette = this.updateGBRegularBGPalette;
    this.updateGBOBJPalette = this.updateGBRegularOBJPalette;
    this.renderBGLayer = null; // Reference to the BG rendering function.
    this.renderWindowLayer = null; // Reference to the window rendering function.
    this.renderSpriteLayer = null; // Reference to the OAM rendering function.
    this.pixelStart = 0; // Temp variable for holding the current working framebuffer offset.
  }

  loadState(state) {
    this.stateManager.load(state);

    this.initializeReferencesFromSaveState();
    this.jumpCompile();
    this.lcdDevice.init();
    this.initSound();
    this.audioController.noiseSampleTable = this.audioController.channel4BitRange === 0x7fff ? this.audioController.LSFR15Table : this.audioController.LSFR7Table;
    this.audioController.channel4VolumeShifter = this.audioController.channel4BitRange === 0x7fff ? 15 : 7;
  }

  jumpCompile() {
    this.memoryNew.jumpCompile();
  }

  connectCartridge(cartridge: Cartridge) {
    if (this.cartridge && this.cartridge.mbc) this.cartridge.mbc.removeListener("rumble", this.onRUMBLE);

    cartridge.connect(this);
    this.cartridge = cartridge;

    this.loadCartridgeRomIntoMemory();

    this.cartridge.interpret();

    if (this.cartridge && this.cartridge.mbc) this.cartridge.mbc.on("rumble", this.onRUMBLE);
  }

  onRUMBLE() {
    if (typeof window !== "undefined" && "vibrate" in window.navigator) {
      window.navigator.vibrate(200);
    }
  }

  loadCartridgeRomIntoMemory() {
    for (let index = 0; index < 0x4000; index++) {
      this.memory[index] = this.cartridge.rom.getByte(index);
    }
  }

  start(cartridge: Cartridge) {
    this.init();
    this.connectCartridge(cartridge);

    if (this.cartridge && this.cartridge.mbc) {
      this.cartridge.mbc.setupROM();
      this.cartridge.mbc.on("ramWrite", () => {
        this.events.emit("sramWrite");
      });
    }

    if (!this.usedBootROM) {
      this.inBootstrap = false;
      this.setupRAM();
      this.initSkipBootstrap();
    } else {
      this.setupRAM();
      this.initBootstrap();
    }

    // Check for IRQ matching upon initialization:
    this.checkIRQMatching();
  }

  init() {
    this.stateManager.init();
    this.initMemory(); // Write the startup memory.
    this.lcdDevice.init(); // Initialize the graphics.
    this.initSound(); // Sound object initialization.
  }

  setupRAM() {
    this.cartridge.setupRAM();

    // Setup the RAM for GBC mode.
    if (this.cartridge.useGBCMode) {
      this.VRAM = util.getTypedArray(0x2000, 0, "uint8");
      this.GBCMemory = util.getTypedArray(0x7000, 0, "uint8");
    }

    this.jumpCompile();

    this.initializeModeSpecificArrays();
  }

  initMemory() {
    // Initialize the RAM:
    this.memory = util.getTypedArray(0x10000, 0, "uint8"); // TODO: replace with Memory Class
    this.audioController.setMemory(this.memory);
    this.frameBuffer = util.getTypedArray(23040, 0xf8f8f8, "int32");
    this.BGCHRBank1 = util.getTypedArray(0x800, 0, "uint8");
    this.audioController.initMemory();

    this.memoryNew = new Memory(this, this.memory);
  }

  generateCacheArray(tileAmount) {
    const tileArray = [];
    let tileNumber = 0;
    while (tileNumber < tileAmount) {
      tileArray[tileNumber++] = util.getTypedArray(64, 0, "uint8");
    }
    return tileArray;
  }

  initSkipBootstrap() {
    // Fill in the boot ROM set register values
    // Default values to the GB boot ROM values, then fill in the GBC boot ROM values after ROM loading
    var index = 0xff;
    while (index >= 0) {
      if (index >= 0x30 && index < 0x40) {
        this.memoryWrite(0xff00 | index, PostBootRegisterState[index]);
      } else {
        switch (index) {
          case 0x00:
          case 0x01:
          case 0x02:
          case 0x05:
          case 0x07:
          case 0x0f:
          case 0xff:
            this.memoryWrite(0xff00 | index, PostBootRegisterState[index]);
            break;
          default:
            this.memory[0xff00 | index] = PostBootRegisterState[index];
        }
      }
      --index;
    }

    if (this.cartridge.useGBCMode) {
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
    this.registerA = this.cartridge.useGBCMode ? 0x11 : 0x1;
    this.registerB = 0;
    this.registerC = 0x13;
    this.registerD = 0;
    this.registerE = 0xd8;
    this.FZero = true;
    this.FSubtract = false;
    this.FHalfCarry = true;
    this.FCarry = true;
    this.registersHL = 0x014d;
    this.LCDCONTROL = this.LINECONTROL;
    this.IME = false;
    this.IRQLineMatched = 0;
    this.interruptsRequested = 225;
    this.interruptsEnabled = 0;
    this.hdmaRunning = false;
    this.CPUTicks = 12;
    this.STATTracker = 0;
    this.modeSTAT = 1;
    this.spriteCount = 252;
    this.LYCMatchTriggerSTAT = false;
    this.mode2TriggerSTAT = false;
    this.mode1TriggerSTAT = false;
    this.mode0TriggerSTAT = false;
    this.LCDisOn = true;
    this.audioController.channel1FrequencyTracker = 0x2000;
    this.audioController.channel1DutyTracker = 0;
    this.audioController.channel1CachedDuty = dutyLookup[2];
    this.audioController.channel1totalLength = 0;
    this.audioController.channel1envelopeVolume = 0;
    this.audioController.channel1envelopeType = false;
    this.audioController.channel1envelopeSweeps = 0;
    this.audioController.channel1envelopeSweepsLast = 0;
    this.audioController.channel1consecutive = true;
    this.audioController.channel1frequency = 1985;
    this.audioController.channel1SweepFault = true;
    this.audioController.channel1ShadowFrequency = 1985;
    this.audioController.channel1timeSweep = 1;
    this.audioController.channel1lastTimeSweep = 0;
    this.audioController.channel1Swept = false;
    this.audioController.channel1frequencySweepDivider = 0;
    this.audioController.channel1decreaseSweep = false;
    this.audioController.channel2FrequencyTracker = 0x2000;
    this.audioController.channel2DutyTracker = 0;
    this.audioController.channel2CachedDuty = dutyLookup[2];
    this.audioController.channel2totalLength = 0;
    this.audioController.channel2envelopeVolume = 0;
    this.audioController.channel2envelopeType = false;
    this.audioController.channel2envelopeSweeps = 0;
    this.audioController.channel2envelopeSweepsLast = 0;
    this.audioController.channel2consecutive = true;
    this.audioController.channel2frequency = 0;
    this.audioController.channel3canPlay = false;
    this.audioController.channel3totalLength = 0;
    this.audioController.channel3patternType = 4;
    this.audioController.channel3frequency = 0;
    this.audioController.channel3consecutive = true;
    this.audioController.channel3Counter = 0x418;
    this.audioController.channel4FrequencyPeriod = 8;
    this.audioController.channel4totalLength = 0;
    this.audioController.channel4envelopeVolume = 0;
    this.audioController.channel4currentVolume = 0;
    this.audioController.channel4envelopeType = false;
    this.audioController.channel4envelopeSweeps = 0;
    this.audioController.channel4envelopeSweepsLast = 0;
    this.audioController.channel4consecutive = true;
    this.audioController.channel4BitRange = 0x7fff;
    this.audioController.channel4VolumeShifter = 15;
    this.audioController.channel1FrequencyCounter = 0x200;
    this.audioController.channel2FrequencyCounter = 0x200;
    this.audioController.channel3Counter = 0x800;
    this.audioController.channel3FrequencyPeriod = 0x800;
    this.audioController.channel3lastSampleLookup = 0;
    this.audioController.channel4lastSampleLookup = 0;
    this.audioController.VinLeftChannelMasterVolume = 8;
    this.audioController.VinRightChannelMasterVolume = 8;
    this.audioController.leftChannel1 = true;
    this.audioController.leftChannel2 = true;
    this.audioController.leftChannel3 = true;
    this.audioController.leftChannel4 = true;
    this.audioController.rightChannel1 = true;
    this.audioController.rightChannel2 = true;
    this.audioController.rightChannel3 = false;
    this.audioController.rightChannel4 = false;
    this.soundMasterEnabled = true;
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
    this.bgEnabled = true;
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
    this.audioController.leftChannel1 = false;
    this.audioController.leftChannel2 = false;
    this.audioController.leftChannel3 = false;
    this.audioController.leftChannel4 = false;
    this.audioController.rightChannel1 = false;
    this.audioController.rightChannel2 = false;
    this.audioController.rightChannel3 = false;
    this.audioController.rightChannel4 = false;
    this.audioController.channel2frequency = this.audioController.channel1frequency = 0;
    this.audioController.channel4consecutive = this.audioController.channel2consecutive = this.audioController.channel1consecutive = false;
    this.audioController.VinLeftChannelMasterVolume = 8;
    this.audioController.VinRightChannelMasterVolume = 8;
    this.memory[MemoryLayout.JOYPAD_REG] = this.joypad.initialValue;
  }

  disableBootROM() {
    // Remove any traces of the boot ROM from ROM memory.
    this.loadCartridgeRomIntoMemory();

    if (this.usedGBCBootROM) {
      if (!this.cartridge.useGBCMode) {
        // Clean up the post-boot (GB mode only) state:
        this.adjustGBCtoGBMode();
      } else {
        this.recompileBootIOWriteHandling();
      }
    } else {
      this.recompileBootIOWriteHandling();
    }
  }

  setSpeed(speed) {
    this.cpu.setSpeed(speed);
    this.initSound();
  }

  initSound() {
    this.audioController.connectDevice(this.audioDevice);
    this.audioController.setVolume(settings.soundOn ? settings.soundVolume : 0);
    this.audioController.initBuffer();
  }

  writeChannel3RAM(address, data) {
    if (this.audioController.channel3canPlay) {
      this.audioController.runJIT();
      //address = this.audioController.channel3lastSampleLookup >> 1;
    }
    this.memory[0xff30 | address] = data;
    address <<= 1;
    this.audioController.channel3PCM[address] = data >> 4;
    this.audioController.channel3PCM[address | 1] = data & 0xf;
  }

  run() {
    // The preprocessing before the actual iteration loop:
    if ((this.stopEmulator & 2) === 0) {
      if ((this.stopEmulator & 1) === 1) {
        if (!this.CPUStopped) {
          this.stopEmulator = 0;

          this.audioController.adjustUnderrun();

          if (this.cartridge.hasRTC) {
            this.cartridge.mbc.rtc.updateClock();
          }

          if (!this.halt) {
            this.executeIteration();
          } else {
            // Finish the HALT rundown execution.
            this.CPUTicks = 0;
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
          this.audioController.runJIT();
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
      const operationCode = this.memoryRead(this.programCounter);
      //Increment the program counter to the next instruction:
      this.programCounter = this.programCounter + 1 & 0xffff;
      //Check for the program counter quirk:
      if (this.skipPCIncrement) {
        this.programCounter = this.programCounter - 1 & 0xffff;
        this.skipPCIncrement = false;
      }
      //Get how many CPU cycles the current instruction counts for:
      this.CPUTicks = TickTable[operationCode];

      //Execute the current instruction:
      mainInstructions[operationCode].apply(this);

      //Update the state (Inlined updateCoreFull manually here):
      //Update the clocking for the LCD emulation:
      const timedTicks = this.CPUTicks >> this.doubleSpeedShifter;
      this.LCDTicks += timedTicks; //LCD Timing
      this.LCDCONTROL[this.actualScanLine](this); //Scan Line and STAT Mode Control

      //Single-speed relative timing for A/V emulation:
      this.audioController.audioTicks += timedTicks; //Audio Timing
      this.cpu.ticks += timedTicks; //Emulator Timing
      //CPU Timers:
      this.DIVTicks += this.CPUTicks; //DIV Timing
      if (this.TIMAEnabled) {
        //TIMA Timing
        this.timerTicks += this.CPUTicks;
        while (this.timerTicks >= this.TACClocker) {
          this.timerTicks -= this.TACClocker;
          if (++this.memory[0xff05] === 0x100) {
            this.memory[0xff05] = this.memory[0xff06];
            this.interruptsRequested |= 0x4;
            this.checkIRQMatching();
          }
        }
      }

      if (this.serialTimer > 0) {
        // Serial Timing
        // IRQ Counter:
        this.serialTimer -= this.CPUTicks;
        if (this.serialTimer <= 0) {
          this.interruptsRequested |= 0x8;
          this.checkIRQMatching();
        }

        // Bit Shift Counter:
        this.serialShiftTimer -= this.CPUTicks;
        if (this.serialShiftTimer <= 0) {
          this.serialShiftTimer = this.serialShiftTimerAllocated;
          // We could shift in actual link data here if we were to implement such!!!
          this.memory[MemoryLayout.SERIAL_DATA_REG] = this.memory[MemoryLayout.SERIAL_DATA_REG] << 1 & 0xfe | 0x01;
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
      this.audioController.runJIT(); // make sure we at least output once per iteration.
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

  handleSTOP() {
    this.CPUStopped = true; //Stop CPU until joypad input changes.
    this.iterationEndRoutine();
    if (this.cpu.ticks < 0) {
      this.audioController.audioTicks -= this.cpu.ticks;
      this.audioController.runJIT();
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
        this.interruptsRequested |= 0x2;
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
        this.interruptsRequested |= 0x2;
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
            this.interruptsRequested |= 0x2;
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
          this.interruptsRequested |= 0x2;
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
        return 456 * (this.memory[0xff45] - this.actualScanLine);
      }
      return 456 * (154 - this.actualScanLine + this.memory[0xff45]);
    }
    return 456 * (this.actualScanLine === 153 && this.memory[0xff44] === 0 ? 154 : 153 - this.actualScanLine) + 8;
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
        return this.spriteCount + 456 * (154 - this.actualScanLine);
    }
  }

  updateSpriteCount(line) {
    this.spriteCount = 252;
    if (this.cartridge.useGBCMode && this.gfxSpriteShow) {
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
        this.interruptsRequested |= 0x2;
        this.checkIRQMatching();
      }
    } else {
      this.memory[0xff41] &= 0x7b;
    }
  }

  updateCore() {
    //Update the clocking for the LCD emulation:
    this.LCDTicks += this.CPUTicks >> this.doubleSpeedShifter; // LCD Timing
    this.LCDCONTROL[this.actualScanLine](this); //Scan Line and STAT Mode Control
    //Single-speed relative timing for A/V emulation:
    var timedTicks = this.CPUTicks >> this.doubleSpeedShifter; // CPU clocking can be updated from the LCD handling.
    this.audioController.audioTicks += timedTicks; // Audio Timing
    this.cpu.ticks += timedTicks; // CPU Timing
    //CPU Timers:
    this.DIVTicks += this.CPUTicks; // DIV Timing
    if (this.TIMAEnabled) {
      //TIMA Timing
      this.timerTicks += this.CPUTicks;
      while (this.timerTicks >= this.TACClocker) {
        this.timerTicks -= this.TACClocker;
        if (++this.memory[0xff05] === 0x100) {
          this.memory[0xff05] = this.memory[0xff06];
          this.interruptsRequested |= 0x4;
          this.checkIRQMatching();
        }
      }
    }
    if (this.serialTimer > 0) {
      //Serial Timing
      //IRQ Counter:
      this.serialTimer -= this.CPUTicks;
      if (this.serialTimer <= 0) {
        this.interruptsRequested |= 0x8;
        this.checkIRQMatching();
      }
      //Bit Shit Counter:
      this.serialShiftTimer -= this.CPUTicks;
      if (this.serialShiftTimer <= 0) {
        this.serialShiftTimer = this.serialShiftTimerAllocated;
        this.memory[MemoryLayout.SERIAL_DATA_REG] = this.memory[MemoryLayout.SERIAL_DATA_REG] << 1 & 0xfe | 0x01; //We could shift in actual link data here if we were to implement such!!!
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

  initializeLCDController() {
    //Display on hanlding:
    var line = 0;
    while (line < 154) {
      if (line < 143) {
        //We're on a normal scan line:
        this.LINECONTROL[line] = () => {
          if (this.LCDTicks < 80) {
            this.scanLineMode2();
          } else if (this.LCDTicks < 252) {
            this.scanLineMode3();
          } else if (this.LCDTicks < 456) {
            this.scanLineMode0();
          } else {
            //We're on a new scan line:
            this.LCDTicks -= 456;
            if (this.STATTracker != 3) {
              //Make sure the mode 0 handler was run at least once per scan line:
              if (this.STATTracker != 2) {
                if (this.STATTracker === 0 && this.mode2TriggerSTAT) {
                  this.interruptsRequested |= 0x2;
                }
                this.incrementScanLineQueue();
              }
              if (this.hdmaRunning) {
                this.executeHDMA();
              }
              if (this.mode0TriggerSTAT) {
                this.interruptsRequested |= 0x2;
              }
            }

            //Update the scanline registers and assert the LYC counter:
            this.actualScanLine = ++this.memory[0xff44];

            //Perform a LYC counter assert:
            if (this.actualScanLine === this.memory[0xff45]) {
              this.memory[0xff41] |= 0x04;
              if (this.LYCMatchTriggerSTAT) {
                this.interruptsRequested |= 0x2;
              }
            } else {
              this.memory[0xff41] &= 0x7b;
            }
            this.checkIRQMatching();
            //Reset our mode contingency variables:
            this.STATTracker = 0;
            this.modeSTAT = 2;
            this.LINECONTROL[this.actualScanLine].apply(this); //Scan Line and STAT Mode Control.
          }
        };
      } else if (line === 143) {
        //We're on the last visible scan line of the LCD screen:
        this.LINECONTROL[143] = () => {
          if (this.LCDTicks < 80) {
            this.scanLineMode2();
          } else if (this.LCDTicks < 252) {
            this.scanLineMode3();
          } else if (this.LCDTicks < 456) {
            this.scanLineMode0();
          } else {
            //Starting V-Blank:
            //Just finished the last visible scan line:
            this.LCDTicks -= 456;
            if (this.STATTracker != 3) {
              //Make sure the mode 0 handler was run at least once per scan line:
              if (this.STATTracker != 2) {
                if (this.STATTracker === 0 && this.mode2TriggerSTAT) {
                  this.interruptsRequested |= 0x2;
                }
                this.incrementScanLineQueue();
              }
              if (this.hdmaRunning) {
                this.executeHDMA();
              }
              if (this.mode0TriggerSTAT) {
                this.interruptsRequested |= 0x2;
              }
            }
            //Update the scanline registers and assert the LYC counter:
            this.actualScanLine = this.memory[0xff44] = 144;
            //Perform a LYC counter assert:
            if (this.memory[0xff45] === 144) {
              this.memory[0xff41] |= 0x04;
              if (this.LYCMatchTriggerSTAT) {
                this.interruptsRequested |= 0x2;
              }
            } else {
              this.memory[0xff41] &= 0x7b;
            }
            //Reset our mode contingency variables:
            this.STATTracker = 0;
            //Update our state for v-blank:
            this.modeSTAT = 1;
            this.interruptsRequested |= this.mode1TriggerSTAT ? 0x3 : 0x1;
            this.checkIRQMatching();
            //Attempt to blit out to our canvas:
            if (this.drewBlank === 0) {
              //Ensure JIT framing alignment:
              if (this.cpu.totalLinesPassed < 144 || this.cpu.totalLinesPassed === 144 && this.midScanlineOffset > -1) {
                //Make sure our gfx are up-to-date:
                this.graphicsJITVBlank();
                //Draw the frame:
                this.lcdDevice.prepareFrame();
              }
            } else {
              //LCD off takes at least 2 frames:
              --this.drewBlank;
            }
            this.LINECONTROL[144].apply(this); //Scan Line and STAT Mode Control.
          }
        };
      } else if (line < 153) {
        //In VBlank
        this.LINECONTROL[line] = () => {
          if (this.LCDTicks >= 456) {
            //We're on a new scan line:
            this.LCDTicks -= 456;
            this.actualScanLine = ++this.memory[0xff44];
            //Perform a LYC counter assert:
            if (this.actualScanLine === this.memory[0xff45]) {
              this.memory[0xff41] |= 0x04;
              if (this.LYCMatchTriggerSTAT) {
                this.interruptsRequested |= 0x2;
                this.checkIRQMatching();
              }
            } else {
              this.memory[0xff41] &= 0x7b;
            }
            this.LINECONTROL[this.actualScanLine].apply(this); //Scan Line and STAT Mode Control.
          }
        };
      } else {
        //VBlank Ending (We're on the last actual scan line)
        this.LINECONTROL[153] = () => {
          if (this.LCDTicks >= 8) {
            if (this.STATTracker != 4 && this.memory[0xff44] === 153) {
              this.memory[0xff44] = 0; //LY register resets to 0 early.
              //Perform a LYC counter assert:
              if (this.memory[0xff45] === 0) {
                this.memory[0xff41] |= 0x04;
                if (this.LYCMatchTriggerSTAT) {
                  this.interruptsRequested |= 0x2;
                  this.checkIRQMatching();
                }
              } else {
                this.memory[0xff41] &= 0x7b;
              }
              this.STATTracker = 4;
            }
            if (this.LCDTicks >= 456) {
              //We reset back to the beginning:
              this.LCDTicks -= 456;
              this.STATTracker = this.actualScanLine = 0;
              this.LINECONTROL[0].apply(this); //Scan Line and STAT Mode Control.
            }
          }
        };
      }
      ++line;
    }
  }

  executeHDMA() {
    this.DMAWrite(1);
    if (this.halt) {
      if (
        this.LCDTicks - this.spriteCount < (4 >> this.doubleSpeedShifter | 0x20)
      ) {
        //HALT clocking correction:
        this.CPUTicks = 4 + (0x20 + this.spriteCount << this.doubleSpeedShifter);
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

  updateClock() {
    if (this.cartridge.mbc && this.cartridge.mbc.rtc) this.cartridge.mbc.rtc.updateClock();
  }

  renderScanLine(scanlineToRender) {
    this.pixelStart = scanlineToRender * 160;
    if (this.bgEnabled) {
      this.pixelEnd = 160;
      this.renderBGLayer(scanlineToRender);
      this.renderWindowLayer(scanlineToRender);
    } else {
      const pixelLine = (scanlineToRender + 1) * 160;
      const defaultColor = this.cartridge.useGBCMode || this.colorizedGBPalettes ? 0xf8f8f8 : 0xefffde;
      for (let pixelPosition = scanlineToRender * 160 + this.currentX; pixelPosition < pixelLine; pixelPosition++) {
        this.frameBuffer[pixelPosition] = defaultColor;
      }
    }
    this.renderSpriteLayer(scanlineToRender);
    this.currentX = 0;
    this.midScanlineOffset = -1;
  }

  renderMidScanLine() {
    if (this.actualScanLine < 144 && this.modeSTAT === 3) {
      //TODO: Get this accurate:
      if (this.midScanlineOffset === -1) {
        this.midScanlineOffset = this.backgroundX & 0x7;
      }
      if (this.LCDTicks >= 82) {
        this.pixelEnd = this.LCDTicks - 74;
        this.pixelEnd = Math.min(
          this.pixelEnd - this.midScanlineOffset - this.pixelEnd % 0x8,
          160
        );

        if (this.bgEnabled) {
          this.pixelStart = this.lastUnrenderedLine * 160;
          this.renderBGLayer(this.lastUnrenderedLine);
          this.renderWindowLayer(this.lastUnrenderedLine);
          //TODO: Do midscanline JIT for sprites...
        } else {
          var pixelLine = this.lastUnrenderedLine * 160 + this.pixelEnd;
          var defaultColor = this.cartridge.useGBCMode ||
            this.colorizedGBPalettes ?
            0xf8f8f8 :
            0xefffde;
          for (
            var pixelPosition = this.lastUnrenderedLine * 160 + this.currentX; pixelPosition < pixelLine; pixelPosition++
          ) {
            this.frameBuffer[pixelPosition] = defaultColor;
          }
        }
        this.currentX = this.pixelEnd;
      }
    }
  }

  initializeModeSpecificArrays() {
    this.LCDCONTROL = this.LCDisOn ? this.LINECONTROL : this.DISPLAYOFFCONTROL;
    if (this.cartridge.useGBCMode) {
      this.gbcOBJRawPalette = util.getTypedArray(0x40, 0, "uint8");
      this.gbcBGRawPalette = util.getTypedArray(0x40, 0, "uint8");
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
    this.renderPathBuild();
  }

  adjustGBCtoGBMode() {
    console.log("Stepping down from GBC mode.");
    this.VRAM = this.GBCMemory = this.BGCHRCurrentBank = this.BGCHRBank2 = null;
    this.tileCache.length = 0x700;
    if (settings.colorizeGBMode) {
      this.gbBGColorizedPalette = util.getTypedArray(4, 0, "int32");
      this.gbOBJColorizedPalette = util.getTypedArray(8, 0, "int32");
      this.cachedBGPaletteConversion = util.getTypedArray(4, 0, "int32");
      this.cachedOBJPaletteConversion = util.getTypedArray(8, 0, "int32");
      this.BGPalette = this.gbBGColorizedPalette;
      this.OBJPalette = this.gbOBJColorizedPalette;
      this.gbOBJPalette = this.gbBGPalette = null;
      this.getGBCColor();
    } else {
      this.gbOBJPalette = util.getTypedArray(8, 0, "int32");
      this.gbBGPalette = util.getTypedArray(4, 0, "int32");
      this.BGPalette = this.gbBGPalette;
      this.OBJPalette = this.gbOBJPalette;
    }
    this.sortBuffer = util.getTypedArray(0x100, 0, "uint8");
    this.OAMAddressCache = util.getTypedArray(10, 0, "int32");
    this.renderPathBuild();
    this.jumpCompile();
  }

  renderPathBuild() {
    if (!this.cartridge.useGBCMode) {
      this.renderBGLayer = this.renderBGGBLayer;
      this.renderWindowLayer = this.renderWindowGBLayer;
      this.renderSpriteLayer = this.renderSpriteGBLayer;
    } else {
      this.priorityFlaggingPathRebuild();
      this.renderSpriteLayer = this.renderSpriteGBCLayer;
    }
  }

  priorityFlaggingPathRebuild() {
    if (this.hasBGPriority) {
      this.renderBGLayer = this.BGGBCLayerRender;
      this.renderWindowLayer = this.WindowGBCLayerRender;
    } else {
      this.renderBGLayer = this.BGGBCLayerRenderNoPriorityFlagging;
      this.renderWindowLayer = this.WindowGBCLayerRenderNoPriorityFlagging;
    }
  }

  initializeReferencesFromSaveState() {
    this.LCDCONTROL = this.LCDisOn ? this.LINECONTROL : this.DISPLAYOFFCONTROL;
    if (!this.cartridge.useGBCMode) {
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
    this.renderPathBuild();
  }

  adjustRGBTint(value) {
    //Adjustment for the GBC's tinting (According to Gambatte):
    const r = value & 0x1f;
    const g = value >> 5 & 0x1f;
    const b = value >> 10 & 0x1f;
    return r * 13 + g * 2 + b >> 1 << 16 | g * 3 + b << 9 | r * 3 + g * 2 + b * 11 >> 1;
  }

  getGBCColor() {
    //GBC Colorization of DMG ROMs:
    //BG
    for (let counter = 0; counter < 4; counter++) {
      const adjustedIndex = counter << 1;
      //BG
      this.cachedBGPaletteConversion[counter] = this.adjustRGBTint(this.gbcBGRawPalette[adjustedIndex | 1] << 8 | this.gbcBGRawPalette[adjustedIndex]);
      //OBJ 1
      this.cachedOBJPaletteConversion[counter] = this.adjustRGBTint(this.gbcOBJRawPalette[adjustedIndex | 1] << 8 | this.gbcOBJRawPalette[adjustedIndex]);
    }

    //OBJ 2
    for (let counter = 4; counter < 8; counter++) {
      const adjustedIndex = counter << 1;
      this.cachedOBJPaletteConversion[counter] = this.adjustRGBTint(this.gbcOBJRawPalette[adjustedIndex | 1] << 8 | this.gbcOBJRawPalette[adjustedIndex]);
    }

    //Update the palette entries:
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
    //GB colorization:
    this.gbBGColorizedPalette[0] = this.cachedBGPaletteConversion[data & 0x03] | 0x2000000;
    this.gbBGColorizedPalette[1] = this.cachedBGPaletteConversion[data >> 2 & 0x03];
    this.gbBGColorizedPalette[2] = this.cachedBGPaletteConversion[data >> 4 & 0x03];
    this.gbBGColorizedPalette[3] = this.cachedBGPaletteConversion[data >> 6];
  }

  updateGBRegularOBJPalette(index, data) {
    this.gbOBJPalette[index | 1] = this.colors[data >> 2 & 0x03];
    this.gbOBJPalette[index | 2] = this.colors[data >> 4 & 0x03];
    this.gbOBJPalette[index | 3] = this.colors[data >> 6];
  }

  updateGBColorizedOBJPalette(index, data) {
    //GB colorization:
    this.gbOBJColorizedPalette[index | 1] = this.cachedOBJPaletteConversion[index | data >> 2 & 0x03];
    this.gbOBJColorizedPalette[index | 2] = this.cachedOBJPaletteConversion[index | data >> 4 & 0x03];
    this.gbOBJColorizedPalette[index | 3] = this.cachedOBJPaletteConversion[index | data >> 6];
  }

  updateGBCBGPalette(index, data) {
    if (this.gbcBGRawPalette[index] != data) {
      this.midScanLineJIT();
      //Update the color palette for BG tiles since it changed:
      this.gbcBGRawPalette[index] = data;
      if ((index & 0x06) === 0) {
        //Palette 0 (Special tile Priority stuff)
        data = 0x2000000 | this.adjustRGBTint(this.gbcBGRawPalette[index | 1] << 8 | this.gbcBGRawPalette[index & 0x3e]);
        index >>= 1;
        this.gbcBGPalette[index] = data;
        this.gbcBGPalette[0x20 | index] = 0x1000000 | data;
      } else {
        //Regular Palettes (No special crap)
        data = this.adjustRGBTint(this.gbcBGRawPalette[index | 1] << 8 | this.gbcBGRawPalette[index & 0x3e]);
        index >>= 1;
        this.gbcBGPalette[index] = data;
        this.gbcBGPalette[0x20 | index] = 0x1000000 | data;
      }
    }
  }

  updateGBCOBJPalette(index, data) {
    if (this.gbcOBJRawPalette[index] !== data) {
      //Update the color palette for OBJ tiles since it changed:
      this.gbcOBJRawPalette[index] = data;
      if ((index & 0x06) > 0) {
        //Regular Palettes (No special crap)
        this.midScanLineJIT();
        this.gbcOBJPalette[index >> 1] = 0x1000000 | this.adjustRGBTint(this.gbcOBJRawPalette[index | 1] << 8 | this.gbcOBJRawPalette[index & 0x3e]);
      }
    }
  }

  renderBGGBLayer(scanlineToRender) {
    var scrollYAdjusted = this.backgroundY + scanlineToRender & 0xff; //The line of the BG we're at.
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 0xf8) << 2; //The row of cached tiles we're fetching from.
    var scrollXAdjusted = this.backgroundX + this.currentX & 0xff; //The scroll amount of the BG.
    var pixelPosition = this.pixelStart + this.currentX; //Current pixel we're working on.
    var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd); //Make sure we do at most 160 pixels a scanline.
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.BGCHRBank1[tileNumber];
    if (chrCode < this.gfxBackgroundBankOffset) {
      chrCode |= 0x100;
    }
    var tile = this.tileCache[chrCode];
    for (
      var texel = scrollXAdjusted & 0x7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100;
      ++scrollXAdjusted
    ) {
      this.frameBuffer[pixelPosition++] = this.BGPalette[tile[tileYLine | texel++]];
    }
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 0x100 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while (tileNumber < scrollXAdjustedAligned) {
      chrCode = this.BGCHRBank1[++tileNumber];
      if (chrCode < this.gfxBackgroundBankOffset) {
        chrCode |= 0x100;
      }
      tile = this.tileCache[chrCode];
      texel = tileYLine;
      this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
      if (scrollXAdjusted < 0x100) {
        chrCode = this.BGCHRBank1[++tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        tile = this.tileCache[chrCode];
        for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
          this.frameBuffer[pixelPosition++] = this.BGPalette[tile[++texel]];
        }
      }
      scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
      while (tileYDown < scrollXAdjustedAligned) {
        chrCode = this.BGCHRBank1[tileYDown++];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        tile = this.tileCache[chrCode];
        texel = tileYLine;
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
      }
      if (pixelPosition < pixelPositionEnd) {
        chrCode = this.BGCHRBank1[tileYDown];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        tile = this.tileCache[chrCode];
        switch (pixelPositionEnd - pixelPosition) {
          case 7:
            this.frameBuffer[pixelPosition + 6] = this.BGPalette[tile[tileYLine | 6]];
          case 6:
            this.frameBuffer[pixelPosition + 5] = this.BGPalette[tile[tileYLine | 5]];
          case 5:
            this.frameBuffer[pixelPosition + 4] = this.BGPalette[tile[tileYLine | 4]];
          case 4:
            this.frameBuffer[pixelPosition + 3] = this.BGPalette[tile[tileYLine | 3]];
          case 3:
            this.frameBuffer[pixelPosition + 2] = this.BGPalette[tile[tileYLine | 2]];
          case 2:
            this.frameBuffer[pixelPosition + 1] = this.BGPalette[tile[tileYLine | 1]];
          case 1:
            this.frameBuffer[pixelPosition] = this.BGPalette[tile[tileYLine]];
        }
      }
    }
  }

  BGGBCLayerRender(scanlineToRender) {
    var scrollYAdjusted = this.backgroundY + scanlineToRender & 0xff; //The line of the BG we're at.
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 0xf8) << 2; //The row of cached tiles we're fetching from.
    var scrollXAdjusted = this.backgroundX + this.currentX & 0xff; //The scroll amount of the BG.
    var pixelPosition = this.pixelStart + this.currentX; //Current pixel we're working on.
    var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd); //Make sure we do at most 160 pixels a scanline.
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.BGCHRBank1[tileNumber];
    if (chrCode < this.gfxBackgroundBankOffset) {
      chrCode |= 0x100;
    }
    var attrCode = this.BGCHRBank2[tileNumber];
    var tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
    var palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
    for (var texel = scrollXAdjusted & 0x7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
    }
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 0x100 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while (tileNumber < scrollXAdjustedAligned) {
      chrCode = this.BGCHRBank1[++tileNumber];
      if (chrCode < this.gfxBackgroundBankOffset) {
        chrCode |= 0x100;
      }
      attrCode = this.BGCHRBank2[tileNumber];
      tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
      palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
      texel = tileYLine;
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
      if (scrollXAdjusted < 0x100) {
        chrCode = this.BGCHRBank1[++tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.BGCHRBank2[tileNumber];
        tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
        for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[++texel]];
        }
      }
      scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
      while (tileYDown < scrollXAdjustedAligned) {
        chrCode = this.BGCHRBank1[tileYDown];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.BGCHRBank2[tileYDown++];
        tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
        texel = tileYLine;
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
      }
      if (pixelPosition < pixelPositionEnd) {
        chrCode = this.BGCHRBank1[tileYDown];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.BGCHRBank2[tileYDown];
        tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
        switch (pixelPositionEnd - pixelPosition) {
          case 7:
            this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
          case 6:
            this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
          case 5:
            this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
          case 4:
            this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
          case 3:
            this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
          case 2:
            this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
          case 1:
            this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
        }
      }
    }
  }

  BGGBCLayerRenderNoPriorityFlagging(scanlineToRender) {
    var scrollYAdjusted = this.backgroundY + scanlineToRender & 0xff; //The line of the BG we're at.
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 0xf8) << 2; //The row of cached tiles we're fetching from.
    var scrollXAdjusted = this.backgroundX + this.currentX & 0xff; //The scroll amount of the BG.
    var pixelPosition = this.pixelStart + this.currentX; //Current pixel we're working on.
    var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd); //Make sure we do at most 160 pixels a scanline.
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.BGCHRBank1[tileNumber];
    if (chrCode < this.gfxBackgroundBankOffset) {
      chrCode |= 0x100;
    }
    var attrCode = this.BGCHRBank2[tileNumber];
    var tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
    var palette = (attrCode & 0x7) << 2;
    for (var texel = scrollXAdjusted & 0x7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
    }
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 0x100 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while (tileNumber < scrollXAdjustedAligned) {
      chrCode = this.BGCHRBank1[++tileNumber];
      if (chrCode < this.gfxBackgroundBankOffset) {
        chrCode |= 0x100;
      }
      attrCode = this.BGCHRBank2[tileNumber];
      tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
      palette = (attrCode & 0x7) << 2;
      texel = tileYLine;
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
      this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
      if (scrollXAdjusted < 0x100) {
        chrCode = this.BGCHRBank1[++tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.BGCHRBank2[tileNumber];
        tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        palette = (attrCode & 0x7) << 2;
        for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[++texel]];
        }
      }
      scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
      while (tileYDown < scrollXAdjustedAligned) {
        chrCode = this.BGCHRBank1[tileYDown];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.BGCHRBank2[tileYDown++];
        tile = this.tileCache[
          (attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode
        ];
        palette = (attrCode & 0x7) << 2;
        texel = tileYLine;
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
      }
      if (pixelPosition < pixelPositionEnd) {
        chrCode = this.BGCHRBank1[tileYDown];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.BGCHRBank2[tileYDown];
        tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        palette = (attrCode & 0x7) << 2;
        switch (pixelPositionEnd - pixelPosition) {
          case 7:
            this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
          case 6:
            this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
          case 5:
            this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
          case 4:
            this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
          case 3:
            this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
          case 2:
            this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
          case 1:
            this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
        }
      }
    }
  }

  renderWindowGBLayer(scanlineToRender) {
    if (this.gfxWindowDisplay) {
      //Is the window enabled?
      var scrollYAdjusted = scanlineToRender - this.windowY; //The line of the BG we're at.
      if (scrollYAdjusted >= 0) {
        var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
        var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
        var pixelPositionEnd = this.pixelStart + this.pixelEnd;
        if (pixelPosition < pixelPositionEnd) {
          var tileYLine = (scrollYAdjusted & 0x7) << 3;
          var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 0xf8) << 2) + (this.currentX >> 3);
          var chrCode = this.BGCHRBank1[tileNumber];
          if (chrCode < this.gfxBackgroundBankOffset) {
            chrCode |= 0x100;
          }
          var tile = this.tileCache[chrCode];
          var texel = scrollXRangeAdjusted - this.windowX & 0x7;
          scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
          while (texel < scrollXRangeAdjusted) {
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[tileYLine | texel++]];
          }
          scrollXRangeAdjusted = tileNumber +
            (pixelPositionEnd - pixelPosition >> 3);
          while (tileNumber < scrollXRangeAdjusted) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            tile = this.tileCache[chrCode];
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
          }
          if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            tile = this.tileCache[chrCode];
            switch (pixelPositionEnd - pixelPosition) {
              case 7:
                this.frameBuffer[pixelPosition + 6] = this.BGPalette[tile[tileYLine | 6]];
              case 6:
                this.frameBuffer[pixelPosition + 5] = this.BGPalette[tile[tileYLine | 5]];
              case 5:
                this.frameBuffer[pixelPosition + 4] = this.BGPalette[tile[tileYLine | 4]];
              case 4:
                this.frameBuffer[pixelPosition + 3] = this.BGPalette[tile[tileYLine | 3]];
              case 3:
                this.frameBuffer[pixelPosition + 2] = this.BGPalette[tile[tileYLine | 2]];
              case 2:
                this.frameBuffer[pixelPosition + 1] = this.BGPalette[tile[tileYLine | 1]];
              case 1:
                this.frameBuffer[pixelPosition] = this.BGPalette[tile[tileYLine]];
            }
          }
        }
      }
    }
  }

  WindowGBCLayerRender(scanlineToRender) {
    if (this.gfxWindowDisplay) {
      //Is the window enabled?
      var scrollYAdjusted = scanlineToRender - this.windowY; //The line of the BG we're at.
      if (scrollYAdjusted >= 0) {
        var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
        var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
        var pixelPositionEnd = this.pixelStart + this.pixelEnd;
        if (pixelPosition < pixelPositionEnd) {
          var tileYLine = (scrollYAdjusted & 0x7) << 3;
          var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 0xf8) << 2) + (this.currentX >> 3);
          var chrCode = this.BGCHRBank1[tileNumber];
          if (chrCode < this.gfxBackgroundBankOffset) {
            chrCode |= 0x100;
          }
          var attrCode = this.BGCHRBank2[tileNumber];
          var tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
          var palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
          var texel = scrollXRangeAdjusted - this.windowX & 0x7;
          scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
          while (texel < scrollXRangeAdjusted) {
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
          }
          scrollXRangeAdjusted = tileNumber +
            (pixelPositionEnd - pixelPosition >> 3);
          while (tileNumber < scrollXRangeAdjusted) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.BGCHRBank2[tileNumber];
            tile = this.tileCache[
              (attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode
            ];
            palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
          }
          if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.BGCHRBank2[tileNumber];
            tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
            switch (pixelPositionEnd - pixelPosition) {
              case 7:
                this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
              case 6:
                this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
              case 5:
                this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
              case 4:
                this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
              case 3:
                this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
              case 2:
                this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
              case 1:
                this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
            }
          }
        }
      }
    }
  }

  WindowGBCLayerRenderNoPriorityFlagging(scanlineToRender) {
    if (this.gfxWindowDisplay) {
      //Is the window enabled?
      var scrollYAdjusted = scanlineToRender - this.windowY; //The line of the BG we're at.
      if (scrollYAdjusted >= 0) {
        var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
        var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
        var pixelPositionEnd = this.pixelStart + this.pixelEnd;
        if (pixelPosition < pixelPositionEnd) {
          var tileYLine = (scrollYAdjusted & 0x7) << 3;
          var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 0xf8) << 2) + (this.currentX >> 3);
          var chrCode = this.BGCHRBank1[tileNumber];
          if (chrCode < this.gfxBackgroundBankOffset) {
            chrCode |= 0x100;
          }
          var attrCode = this.BGCHRBank2[tileNumber];
          var tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
          var palette = (attrCode & 0x7) << 2;
          var texel = scrollXRangeAdjusted - this.windowX & 0x7;
          scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
          while (texel < scrollXRangeAdjusted) {
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
          }
          scrollXRangeAdjusted = tileNumber + (pixelPositionEnd - pixelPosition >> 3);
          while (tileNumber < scrollXRangeAdjusted) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.BGCHRBank2[tileNumber];
            tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2;
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
          }
          if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.BGCHRBank2[tileNumber];
            tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2;
            switch (pixelPositionEnd - pixelPosition) {
              case 7:
                this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
              case 6:
                this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
              case 5:
                this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
              case 4:
                this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
              case 3:
                this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
              case 2:
                this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
              case 1:
                this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
            }
          }
        }
      }
    }
  }

  renderSpriteGBLayer(scanlineToRender) {
    if (this.gfxSpriteShow) {
      //Are sprites enabled?
      var lineAdjusted = scanlineToRender + 0x10;
      var OAMAddress = 0xfe00;
      var yoffset = 0;
      var xcoord = 1;
      var xCoordStart = 0;
      var xCoordEnd = 0;
      var attrCode = 0;
      var palette = 0;
      var tile = null;
      var data = 0;
      var spriteCount = 0;
      var length = 0;
      var currentPixel = 0;
      var linePixel = 0;
      //Clear our x-coord sort buffer:
      while (xcoord < 168) {
        this.sortBuffer[xcoord++] = 0xff;
      }
      if (this.gfxSpriteNormalHeight) {
        //Draw the visible sprites:
        for (let length = this.findLowestSpriteDrawable(lineAdjusted, 0x7); spriteCount < length; ++spriteCount) {
          OAMAddress = this.OAMAddressCache[spriteCount];
          yoffset = lineAdjusted - this.memory[OAMAddress] << 3;
          attrCode = this.memory[OAMAddress | 3];
          palette = (attrCode & 0x10) >> 2;
          tile = this.tileCache[(attrCode & 0x60) << 4 | this.memory[OAMAddress | 0x2]];
          linePixel = xCoordStart = this.memory[OAMAddress | 1];
          xCoordEnd = Math.min(168 - linePixel, 8);
          xcoord = linePixel > 7 ? 0 : 8 - linePixel;
          for (currentPixel = this.pixelStart + (linePixel > 8 ? linePixel - 8 : 0); xcoord < xCoordEnd; ++xcoord, ++currentPixel, ++linePixel) {
            if (this.sortBuffer[linePixel] > xCoordStart) {
              if (this.frameBuffer[currentPixel] >= 0x2000000) {
                data = tile[yoffset | xcoord];
                if (data > 0) {
                  this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                  this.sortBuffer[linePixel] = xCoordStart;
                }
              } else if (this.frameBuffer[currentPixel] < 0x1000000) {
                data = tile[yoffset | xcoord];
                if (data > 0 && attrCode < 0x80) {
                  this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                  this.sortBuffer[linePixel] = xCoordStart;
                }
              }
            }
          }
        }
      } else {
        //Draw the visible sprites:
        for (let length = this.findLowestSpriteDrawable(lineAdjusted, 0xf); spriteCount < length; ++spriteCount) {
          OAMAddress = this.OAMAddressCache[spriteCount];
          yoffset = lineAdjusted - this.memory[OAMAddress] << 3;
          attrCode = this.memory[OAMAddress | 3];
          palette = (attrCode & 0x10) >> 2;
          if ((attrCode & 0x40) === (0x40 & yoffset)) {
            tile = this.tileCache[(attrCode & 0x60) << 4 | this.memory[OAMAddress | 0x2] & 0xfe];
          } else {
            tile = this.tileCache[(attrCode & 0x60) << 4 | this.memory[OAMAddress | 0x2] | 1];
          }
          yoffset &= 0x3f;
          linePixel = xCoordStart = this.memory[OAMAddress | 1];
          xCoordEnd = Math.min(168 - linePixel, 8);
          xcoord = linePixel > 7 ? 0 : 8 - linePixel;
          for (currentPixel = this.pixelStart + (linePixel > 8 ? linePixel - 8 : 0); xcoord < xCoordEnd; ++xcoord, ++currentPixel, ++linePixel) {
            if (this.sortBuffer[linePixel] > xCoordStart) {
              if (this.frameBuffer[currentPixel] >= 0x2000000) {
                data = tile[yoffset | xcoord];
                if (data > 0) {
                  this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                  this.sortBuffer[linePixel] = xCoordStart;
                }
              } else if (this.frameBuffer[currentPixel] < 0x1000000) {
                data = tile[yoffset | xcoord];
                if (data > 0 && attrCode < 0x80) {
                  this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                  this.sortBuffer[linePixel] = xCoordStart;
                }
              }
            }
          }
        }
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

  renderSpriteGBCLayer(scanlineToRender) {
    if (this.gfxSpriteShow) {
      //Are sprites enabled?
      var OAMAddress = 0xfe00;
      var lineAdjusted = scanlineToRender + 0x10;
      var yoffset = 0;
      var xcoord = 0;
      var endX = 0;
      var xCounter = 0;
      var attrCode = 0;
      var palette = 0;
      var tile = null;
      var data = 0;
      var currentPixel = 0;
      var spriteCount = 0;
      if (this.gfxSpriteNormalHeight) {
        for (; OAMAddress < 0xfea0 && spriteCount < 10; OAMAddress += 4) {
          yoffset = lineAdjusted - this.memory[OAMAddress];
          if ((yoffset & 0x7) === yoffset) {
            xcoord = this.memory[OAMAddress | 1] - 8;
            endX = Math.min(160, xcoord + 8);
            attrCode = this.memory[OAMAddress | 3];
            palette = (attrCode & 7) << 2;
            tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | this.memory[OAMAddress | 2]];
            xCounter = xcoord > 0 ? xcoord : 0;
            xcoord -= yoffset << 3;
            for (currentPixel = this.pixelStart + xCounter; xCounter < endX; ++xCounter, ++currentPixel) {
              if (this.frameBuffer[currentPixel] >= 0x2000000) {
                data = tile[xCounter - xcoord];
                if (data > 0) {
                  this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                }
              } else if (this.frameBuffer[currentPixel] < 0x1000000) {
                data = tile[xCounter - xcoord];
                if (data > 0 && attrCode < 0x80) {
                  //Don't optimize for attrCode, as LICM-capable JITs should optimize its checks.
                  this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                }
              }
            }
            ++spriteCount;
          }
        }
      } else {
        for (; OAMAddress < 0xfea0 && spriteCount < 10; OAMAddress += 4) {
          yoffset = lineAdjusted - this.memory[OAMAddress];
          if ((yoffset & 0xf) === yoffset) {
            xcoord = this.memory[OAMAddress | 1] - 8;
            endX = Math.min(160, xcoord + 8);
            attrCode = this.memory[OAMAddress | 3];
            palette = (attrCode & 7) << 2;
            if ((attrCode & 0x40) === (0x40 & yoffset << 3)) {
              tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | this.memory[OAMAddress | 0x2] & 0xfe];
            } else {
              tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | this.memory[OAMAddress | 0x2] | 1];
            }
            xCounter = xcoord > 0 ? xcoord : 0;
            xcoord -= (yoffset & 0x7) << 3;
            for (currentPixel = this.pixelStart + xCounter; xCounter < endX; ++xCounter, ++currentPixel) {
              if (this.frameBuffer[currentPixel] >= 0x2000000) {
                data = tile[xCounter - xcoord];
                if (data > 0) {
                  this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                }
              } else if (this.frameBuffer[currentPixel] < 0x1000000) {
                data = tile[xCounter - xcoord];
                if (data > 0 && attrCode < 0x80) {
                  //Don't optimize for attrCode, as LICM-capable JITs should optimize its checks.
                  this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                }
              }
            }
            ++spriteCount;
          }
        }
      }
    }
  }

  //Generate only a single tile line for the GB tile cache mode:
  generateGBTileLine(address) {
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
  generateGBCTileLineBank1(address) {
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
  generateGBCTileLineBank2(address) {
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
  generateGBOAMTileLine(address) {
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
    if (this.LCDisOn) {
      this.cpu.totalLinesPassed = 0; //Mark frame for ensuring a JIT pass for the next framebuffer output.
      this.graphicsJITScanlineGroup();
    }
  }

  graphicsJITVBlank() {
    //JIT the graphics to v-blank framing:
    this.cpu.totalLinesPassed += this.queuedScanLines;
    this.graphicsJITScanlineGroup();
  }

  graphicsJITScanlineGroup() {
    //Normal rendering JIT, where we try to do groups of scanlines at once:
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
        this.interruptsRequested -= testbit; //Reset the interrupt request.
        this.IRQLineMatched = 0; //Reset the IRQ assertion.
        //Interrupts have a certain clock cycle length:
        this.CPUTicks = 20;
        //Set the stack pointer to the current program counter value:
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
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
      this.IRQLineMatched = this.interruptsEnabled & this.interruptsRequested & 0x1f;
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
      if (this.LCDisOn) {
        //If the LCD is enabled, then predict the LCD IRQs enabled:
        if ((this.interruptsEnabled & 0x1) === 0x1) {
          currentClocks = 456 * ((this.modeSTAT === 1 ? 298 : 144) - this.actualScanLine) - this.LCDTicks << this.doubleSpeedShifter;
        }
        if ((this.interruptsEnabled & 0x2) === 0x2) {
          if (this.mode0TriggerSTAT) {
            const temp_var = this.clocksUntilMode0() - this.LCDTicks << this.doubleSpeedShifter;
            if (temp_var <= currentClocks || currentClocks === -1) {
              currentClocks = temp_var;
            }
          }
          if (this.mode1TriggerSTAT && (this.interruptsEnabled & 0x1) === 0) {
            const temp_var = 456 * ((this.modeSTAT === 1 ? 298 : 144) - this.actualScanLine) - this.LCDTicks << this.doubleSpeedShifter;
            if (temp_var <= currentClocks || currentClocks === -1) {
              currentClocks = temp_var;
            }
          }
          if (this.mode2TriggerSTAT) {
            const temp_var = (this.actualScanLine >= 143 ? 456 * (154 - this.actualScanLine) : 456) - this.LCDTicks << this.doubleSpeedShifter;
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
      if (this.TIMAEnabled && (this.interruptsEnabled & 0x4) === 0x4) {
        //CPU timer IRQ prediction:
        const temp_var = (0x100 - this.memory[0xff05]) * this.TACClocker - this.timerTicks;
        if (temp_var <= currentClocks || currentClocks === -1) {
          currentClocks = temp_var;
        }
      }
      if (this.serialTimer > 0 && (this.interruptsEnabled & 0x8) === 0x8) {
        //Serial IRQ prediction:
        if (this.serialTimer <= currentClocks || currentClocks === -1) {
          currentClocks = this.serialTimer;
        }
      }
    } else {
      currentClocks = this.remainingClocks;
    }
    var maxClocks = this.cpu.cyclesTotal - this.cpu.ticks << this.doubleSpeedShifter;
    if (currentClocks >= 0) {
      if (currentClocks <= maxClocks) {
        //Exit out of HALT normally:
        this.CPUTicks = Math.max(currentClocks, this.CPUTicks);
        this.updateCoreFull();
        this.halt = false;
        this.CPUTicks = 0;
      } else {
        //Still in HALT, clock only up to the clocks specified per iteration:
        this.CPUTicks = Math.max(maxClocks, this.CPUTicks);
        this.remainingClocks = currentClocks - this.CPUTicks;
      }
    } else {
      //Still in HALT, clock only up to the clocks specified per iteration:
      //Will stay in HALT forever (Stuck in HALT forever), but the APU and LCD are still clocked, so don't pause:
      this.CPUTicks += maxClocks;
    }
  }

  //Memory Reading:
  memoryRead(address) {
    // Act as a wrapper for reading the returns from the compiled jumps to memory.
    if (this.memoryNew.hasReader(address)) return this.memoryNew.read(address);
    return this.memoryReader[address].apply(this, [address]);
  }

  memoryHighRead(address) {
    // Act as a wrapper for reading the returns from the compiled jumps to memory.
    if (this.memoryNew.hasHighReader(address)) return this.memoryNew.readHigh(address);
    return this.memoryHighReader[address].apply(this, [address]);
  }

  memoryReadJumpCompile() {
    // Faster in some browsers, since we are doing less conditionals overall by implementing them in advance.
    for (let index = 0x0000; index <= 0xffff; index++) {
      if (index >= 0xff00) {
        switch (index) {
          case 0xff10:
            this.memoryHighReader[0x10] = this.memoryReader[0xff10] = address => {
              return 0x80 | this.memory[0xff10];
            };
            break;
          case 0xff11:
            this.memoryHighReader[0x11] = this.memoryReader[0xff11] = address => {
              return 0x3f | this.memory[0xff11];
            };
            break;
          case 0xff12:
            this.memoryHighReader[0x12] = this.memoryHighReadNormal;
            this.memoryReader[0xff12] = this.memoryReadNormal;
            break;
          case 0xff13:
            this.memoryHighReader[0x13] = this.memoryReader[0xff13] = this.badMemoryRead;
            break;
          case 0xff14:
            this.memoryHighReader[0x14] = this.memoryReader[0xff14] = address => {
              return 0xbf | this.memory[0xff14];
            };
            break;
          case 0xff15:
            this.memoryHighReader[0x15] = this.badMemoryRead;
            this.memoryReader[0xff15] = this.badMemoryRead;
            break;
          case 0xff16:
            this.memoryHighReader[0x16] = this.memoryReader[0xff16] = address => {
              return 0x3f | this.memory[0xff16];
            };
            break;
          case 0xff17:
            this.memoryHighReader[0x17] = this.memoryHighReadNormal;
            this.memoryReader[0xff17] = this.memoryReadNormal;
            break;
          case 0xff18:
            this.memoryHighReader[0x18] = this.memoryReader[0xff18] = this.badMemoryRead;
            break;
          case 0xff19:
            this.memoryHighReader[0x19] = this.memoryReader[0xff19] = address => {
              return 0xbf | this.memory[0xff19];
            };
            break;
          case 0xff1a:
            this.memoryHighReader[0x1a] = this.memoryReader[0xff1a] = address => {
              return 0x7f | this.memory[0xff1a];
            };
            break;
          case 0xff1b:
            this.memoryHighReader[0x1b] = this.memoryReader[0xff1b] = this.badMemoryRead;
            break;
          case 0xff1c:
            this.memoryHighReader[0x1c] = this.memoryReader[0xff1c] = address => {
              return 0x9f | this.memory[0xff1c];
            };
            break;
          case 0xff1d:
            this.memoryHighReader[0x1d] = this.memoryReader[0xff1d] = this.badMemoryRead;
            break;
          case 0xff1e:
            this.memoryHighReader[0x1e] = this.memoryReader[0xff1e] = address => {
              return 0xbf | this.memory[0xff1e];
            };
            break;
          case 0xff1f:
          case 0xff20:
            this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.badMemoryRead;
            break;
          case 0xff21:
          case 0xff22:
            this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
            this.memoryReader[index] = this.memoryReadNormal;
            break;
          case 0xff23:
            this.memoryHighReader[0x23] = this.memoryReader[0xff23] = address => {
              return 0xbf | this.memory[0xff23];
            };
            break;
          case 0xff24:
          case 0xff25:
            this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
            this.memoryReader[index] = this.memoryReadNormal;
            break;
          case 0xff26:
            this.memoryHighReader[0x26] = this.memoryReader[0xff26] = address => {
              this.audioController.runJIT();
              return 0x70 | this.memory[0xff26];
            };
            break;
          case 0xff27:
          case 0xff28:
          case 0xff29:
          case 0xff2a:
          case 0xff2b:
          case 0xff2c:
          case 0xff2d:
          case 0xff2e:
          case 0xff2f:
            this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.badMemoryRead;
            break;
          case 0xff30:
          case 0xff31:
          case 0xff32:
          case 0xff33:
          case 0xff34:
          case 0xff35:
          case 0xff36:
          case 0xff37:
          case 0xff38:
          case 0xff39:
          case 0xff3a:
          case 0xff3b:
          case 0xff3c:
          case 0xff3d:
          case 0xff3e:
          case 0xff3f:
            this.memoryReader[index] = address => {
              return this.audioController.channel3canPlay ? this.memory[0xff00 | this.audioController.channel3lastSampleLookup >> 1] : this.memory[address];
            };
            this.memoryHighReader[index & 0xff] = address => {
              return this.audioController.channel3canPlay ? this.memory[0xff00 | this.audioController.channel3lastSampleLookup >> 1] : this.memory[0xff00 | address];
            };
            break;
          case 0xff40:
            this.memoryHighReader[0x40] = this.memoryHighReadNormal;
            this.memoryReader[0xff40] = this.memoryReadNormal;
            break;
          case 0xff41:
            this.memoryHighReader[0x41] = this.memoryReader[0xff41] = address => {
              return 0x80 | this.memory[0xff41] | this.modeSTAT;
            };
            break;
          case 0xff42:
            this.memoryHighReader[0x42] = this.memoryReader[0xff42] = address => {
              return this.backgroundY;
            };
            break;
          case 0xff43:
            this.memoryHighReader[0x43] = this.memoryReader[0xff43] = address => {
              return this.backgroundX;
            };
            break;
          case 0xff44:
            this.memoryHighReader[0x44] = this.memoryReader[0xff44] = address => {
              return this.LCDisOn ? this.memory[0xff44] : 0;
            };
            break;
          case 0xff45:
          case 0xff46:
          case 0xff47:
          case 0xff48:
          case 0xff49:
            this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
            this.memoryReader[index] = this.memoryReadNormal;
            break;
          case 0xff4a:
            //WY
            this.memoryHighReader[0x4a] = this.memoryReader[0xff4a] = address => {
              return this.windowY;
            };
            break;
          case 0xff4b:
            this.memoryHighReader[0x4b] = this.memoryHighReadNormal;
            this.memoryReader[0xff4b] = this.memoryReadNormal;
            break;
          case 0xff4c:
            this.memoryHighReader[0x4c] = this.memoryReader[0xff4c] = this.badMemoryRead;
            break;
          case 0xff4d:
            this.memoryHighReader[0x4d] = this.memoryHighReadNormal;
            this.memoryReader[0xff4d] = this.memoryReadNormal;
            break;
          case 0xff4e:
            this.memoryHighReader[0x4e] = this.memoryReader[0xff4e] = this.badMemoryRead;
            break;
          case 0xff4f:
            this.memoryHighReader[0x4f] = this.memoryReader[0xff4f] = address => {
              return this.currVRAMBank;
            };
            break;
          case 0xff50:
          case 0xff51:
          case 0xff52:
          case 0xff53:
          case 0xff54:
            this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
            this.memoryReader[index] = this.memoryReadNormal;
            break;
          case 0xff55:
            if (this.cartridge.useGBCMode) {
              this.memoryHighReader[0x55] = this.memoryReader[0xff55] = address => {
                if (!this.LCDisOn && this.hdmaRunning) {
                  //Undocumented behavior alert: HDMA becomes GDMA when LCD is off (Worms Armageddon Fix).
                  //DMA
                  this.DMAWrite((this.memory[0xff55] & 0x7f) + 1);
                  this.memory[0xff55] = 0xff; //Transfer completed.
                  this.hdmaRunning = false;
                }
                return this.memory[0xff55];
              };
            } else {
              this.memoryReader[0xff55] = this.memoryReadNormal;
              this.memoryHighReader[0x55] = this.memoryHighReadNormal;
            }
            break;
          case 0xff56:
            if (this.cartridge.useGBCMode) {
              this.memoryHighReader[0x56] = this.memoryReader[0xff56] = address => {
                //Return IR "not connected" status:
                return 0x3c | (this.memory[0xff56] >= 0xc0 ? 0x2 | this.memory[0xff56] & 0xc1 : this.memory[0xff56] & 0xc3);
              };
            } else {
              this.memoryReader[0xff56] = this.memoryReadNormal;
              this.memoryHighReader[0x56] = this.memoryHighReadNormal;
            }
            break;
          case 0xff57:
          case 0xff58:
          case 0xff59:
          case 0xff5a:
          case 0xff5b:
          case 0xff5c:
          case 0xff5d:
          case 0xff5e:
          case 0xff5f:
          case 0xff60:
          case 0xff61:
          case 0xff62:
          case 0xff63:
          case 0xff64:
          case 0xff65:
          case 0xff66:
          case 0xff67:
            this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.badMemoryRead;
            break;
          case 0xff68:
          case 0xff69:
          case 0xff6a:
          case 0xff6b:
            this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
            this.memoryReader[index] = this.memoryReadNormal;
            break;
          case 0xff6c:
            if (this.cartridge.useGBCMode) {
              this.memoryHighReader[0x6c] = this.memoryReader[0xff6c] = address => {
                return 0xfe | this.memory[0xff6c];
              };
            } else {
              this.memoryHighReader[0x6c] = this.memoryReader[0xff6c] = this.badMemoryRead;
            }
            break;
          case 0xff6d:
          case 0xff6e:
          case 0xff6f:
            this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.badMemoryRead;
            break;
          case 0xff70:
            if (this.cartridge.useGBCMode) {
              //SVBK
              this.memoryHighReader[0x70] = this.memoryReader[0xff70] = address => {
                return 0x40 | this.memory[0xff70];
              };
            } else {
              this.memoryHighReader[0x70] = this.memoryReader[0xff70] = this.badMemoryRead;
            }
            break;
          case 0xff71:
            this.memoryHighReader[0x71] = this.memoryReader[0xff71] = this.badMemoryRead;
            break;
          case 0xff72:
          case 0xff73:
            this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.memoryReadNormal;
            break;
          case 0xff74:
            if (this.cartridge.useGBCMode) {
              this.memoryHighReader[0x74] = this.memoryReader[0xff74] = this.memoryReadNormal;
            } else {
              this.memoryHighReader[0x74] = this.memoryReader[0xff74] = this.badMemoryRead;
            }
            break;
          case 0xff75:
            this.memoryHighReader[0x75] = this.memoryReader[0xff75] = address => {
              return 0x8f | this.memory[0xff75];
            };
            break;
          case 0xff76:
            //Undocumented realtime PCM amplitude readback:
            this.memoryHighReader[0x76] = this.memoryReader[0xff76] = address => {
              this.audioController.runJIT();
              return this.audioController.channel2envelopeVolume << 4 | this.audioController.channel1envelopeVolume;
            };
            break;
          case 0xff77:
            //Undocumented realtime PCM amplitude readback:
            this.memoryHighReader[0x77] = this.memoryReader[0xff77] = address => {
              this.audioController.runJIT();
              return this.audioController.channel4envelopeVolume << 4 | this.audioController.channel3envelopeVolume;
            };
            break;
          case 0xff78:
          case 0xff79:
          case 0xff7a:
          case 0xff7b:
          case 0xff7c:
          case 0xff7d:
          case 0xff7e:
          case 0xff7f:
            this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.badMemoryRead;
            break;
          case MemoryLayout.INTERRUPT_ENABLE_REG:
            this.memoryHighReader[0xff] = this.memoryReader[MemoryLayout.INTERRUPT_ENABLE_REG] = address => this.interruptsEnabled;
            break;
          default:
            this.memoryReader[index] = this.memoryReadNormal;
            this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
        }
      } else {
        this.memoryReader[index] = this.badMemoryRead;
      }
    }
  }

  memoryReadNormal(address: number) {
    return this.memory[address];
  }

  memoryHighReadNormal(address: number) {
    return this.memory[0xff00 | address];
  }

  memoryReadROM(address: number) {
    return this.cartridge.rom.getByte(
      this.cartridge.mbc.currentROMBank + address
    );
  }

  memoryReadMBC(address) {
    return this.cartridge.mbc.readRAM(address);
  }

  memoryReadMBC7(address) {
    return this.cartridge.mbc.readRAM(address);
  }

  memoryReadMBC3(address) {
    return this.cartridge.mbc.readRAM(address);
  }

  memoryReadGBCMemory(address) {
    return this.GBCMemory[address + this.gbcRamBankPosition];
  }

  memoryReadOAM(address) {
    return this.modeSTAT > 1 ? 0xff : this.memory[address];
  }

  memoryReadECHOGBCMemory(address) {
    return this.GBCMemory[address + this.gbcRamBankPositionECHO];
  }

  memoryReadECHONormal(address) {
    return this.memory[address - 0x2000];
  }

  badMemoryRead(address) {
    return 0xff;
  }

  VRAMDATAReadCGBCPU(address) {
    // CPU Side Reading The VRAM (Optimized for GameBoy Color)
    return this.modeSTAT > 2 ?
      0xff :
      this.currVRAMBank === 0 ?
        this.memory[address] :
        this.VRAM[address & 0x1fff];
  }

  VRAMDATAReadDMGCPU(address) {
    // CPU Side Reading The VRAM (Optimized for classic GameBoy)
    return this.modeSTAT > 2 ? 0xff : this.memory[address];
  }

  VRAMCHRReadCGBCPU(address) {
    // CPU Side Reading the Character Data Map:
    return this.modeSTAT > 2 ? 0xff : this.BGCHRCurrentBank[address & 0x7ff];
  }

  VRAMCHRReadDMGCPU(address) {
    // CPU Side Reading the Character Data Map:
    return this.modeSTAT > 2 ? 0xff : this.BGCHRBank1[address & 0x7ff];
  }

  //Memory Writing:
  memoryWrite(address, data) {
    //Act as a wrapper for writing by compiled jumps to specific memory writing functions.
    this.memoryWriter[address].apply(this, [address, data]);
  }

  //0xFFXX fast path:
  memoryHighWrite(address, data) {
    //Act as a wrapper for writing by compiled jumps to specific memory writing functions.
    this.memoryHighWriter[address].apply(this, [address, data]);
  }

  memoryWriteJumpCompile() {
    // Faster in some browsers, since we are doing less conditionals overall by implementing them in advance.
    for (var index = 0x0000; index <= 0xffff; index++) {
      if (index <= MemoryLayout.CART_ROM_SWITCH_BANK_END) {
        if (this.cartridge.hasMBC1) {
          if (index < 0x2000) {
            this.memoryWriter[index] = this.MBCWriteEnable;
          } else if (index < 0x4000) {
            this.memoryWriter[index] = this.MBC1WriteROMBank;
          } else if (index < 0x6000) {
            this.memoryWriter[index] = this.MBC1WriteRAMBank;
          } else {
            this.memoryWriter[index] = this.MBC1WriteType;
          }
        } else if (this.cartridge.hasMBC2) {
          if (index < 0x1000) {
            this.memoryWriter[index] = this.MBCWriteEnable;
          } else if (index >= 0x2100 && index < 0x2200) {
            this.memoryWriter[index] = this.MBC2WriteROMBank;
          } else {
            this.memoryWriter[index] = this.onIllegalWrite;
          }
        } else if (this.cartridge.hasMBC3) {
          if (index < 0x2000) {
            this.memoryWriter[index] = this.MBCWriteEnable;
          } else if (index < 0x4000) {
            this.memoryWriter[index] = this.MBC3WriteROMBank;
          } else if (index < 0x6000) {
            this.memoryWriter[index] = this.MBC3WriteRAMBank;
          } else {
            this.memoryWriter[index] = this.MBC3WriteRTCLatch;
          }
        } else if (
          this.cartridge.hasMBC5 ||
          this.cartridge.hasRUMBLE ||
          this.cartridge.hasMBC7
        ) {
          if (index < 0x2000) {
            this.memoryWriter[index] = this.MBCWriteEnable;
          } else if (index < 0x3000) {
            this.memoryWriter[index] = this.MBC5WriteROMBankLow;
          } else if (index < 0x4000) {
            this.memoryWriter[index] = this.MBC5WriteROMBankHigh;
          } else if (index < 0x6000) {
            this.memoryWriter[index] = this.cartridge.hasRUMBLE ? this.RUMBLEWriteRAMBank : this.MBC5WriteRAMBank;
          } else {
            this.memoryWriter[index] = this.onIllegalWrite;
          }
        } else if (this.cartridge.hasHuC3) {
          if (index < 0x2000) {
            this.memoryWriter[index] = this.MBCWriteEnable;
          } else if (index < 0x4000) {
            this.memoryWriter[index] = this.MBC3WriteROMBank;
          } else if (index < 0x6000) {
            this.memoryWriter[index] = this.HuC3WriteRAMBank;
          } else {
            this.memoryWriter[index] = this.onIllegalWrite;
          }
        } else {
          this.memoryWriter[index] = this.onIllegalWrite;
        }
      } else if (index <= MemoryLayout.TILE_SET_0_END) {
        this.memoryWriter[index] = this.cartridge.useGBCMode ? this.VRAMGBCDATAWrite : this.VRAMGBDATAWrite;
      } else if (index < 0x9800) {
        this.memoryWriter[index] = this.cartridge.useGBCMode ? this.VRAMGBCDATAWrite : this.VRAMGBDATAUpperWrite;
      } else if (index < 0xa000) {
        this.memoryWriter[index] = this.cartridge.useGBCMode ? this.VRAMGBCCHRMAPWrite : this.VRAMGBCHRMAPWrite;
      } else if (index < 0xc000) {
        if (this.cartridge.mbc && this.cartridge.mbc.ramSize !== 0) {
          if (!this.cartridge.hasMBC3) {
            this.memoryWriter[index] = this.memoryWriteMBCRAM;
          } else {
            //MBC3 RTC + RAM:
            this.memoryWriter[index] = this.memoryWriteMBC3RAM;
          }
        } else {
          this.memoryWriter[index] = this.onIllegalWrite;
        }
      } else if (index < 0xe000) {
        if (this.cartridge.useGBCMode && index >= 0xd000) {
          this.memoryWriter[index] = this.memoryWriteGBCRAM;
        } else {
          this.memoryWriter[index] = this.memoryWriteNormal;
        }
      } else if (index < 0xfe00) {
        if (this.cartridge.useGBCMode && index >= 0xf000) {
          this.memoryWriter[index] = this.memoryWriteECHOGBCRAM;
        } else {
          this.memoryWriter[index] = this.memoryWriteECHONormal;
        }
      } else if (index <= 0xfea0) {
        this.memoryWriter[index] = this.memoryWriteOAMRAM;
      } else if (index < 0xff00) {
        if (this.cartridge.useGBCMode) {
          // Only GBC has access to this RAM.
          this.memoryWriter[index] = this.memoryWriteNormal;
        } else {
          this.memoryWriter[index] = this.onIllegalWrite;
        }
      } else {
        //Start the I/O initialization by filling in the slots as normal memory:
        this.memoryWriter[index] = this.memoryWriteNormal;
        this.memoryHighWriter[index & 0xff] = this.memoryHighWriteNormal;
      }
    }
    this.registerWriteJumpCompile(); // Compile the I/O write functions separately...
  }

  MBCWriteEnable(address, data) {
    this.cartridge.mbc.writeEnable(address, data);
  }

  MBC1WriteROMBank(address, data) {
    this.cartridge.mbc1.writeROMBank(address, data);
  }

  MBC1WriteRAMBank(address, data) {
    this.cartridge.mbc1.writeRAMBank(address, data);
  }

  MBC1WriteType(address, data) {
    this.cartridge.mbc1.writeType(address, data);
  }

  MBC2WriteROMBank(address, data) {
    this.cartridge.mbc2.writeROMBank(address, data);
  }

  MBC3WriteROMBank(address, data) {
    return this.cartridge.mbc3.writeROMBank(address, data);
  }

  MBC3WriteRAMBank(address, data) {
    return this.cartridge.mbc3.writeRAMBank(address, data);
  }

  MBC3WriteRTCLatch(address, data) {
    return this.cartridge.mbc3.rtc.writeLatch(address, data);
  }

  MBC5WriteROMBankLow(address, data) {
    return this.cartridge.mbc5.writeROMBankLow(address, data);
  }

  MBC5WriteROMBankHigh(address, data) {
    return this.cartridge.mbc5.writeROMBankHigh(address, data);
  }

  MBC5WriteRAMBank(address, data) {
    return this.cartridge.mbc5.writeRAMBank(address, data);
  }

  RUMBLEWriteRAMBank(address, data) {
    return this.cartridge.rumble.writeRAMBank(address, data);
  }

  HuC3WriteRAMBank(address, data) {
    //HuC3 RAM bank switching
    this.cartridge.mbc.currentMBCRAMBank = data & 0x03;
    this.cartridge.mbc.currentRAMBankPosition = (this.cartridge.mbc.currentMBCRAMBank << 13) - 0xa000;
  }

  onIllegalWrite(address, data) {
    // throw new Error(`Not allowed to write address 0x${address.toString(16)} with data: ${data.toString(2)}`);
  }

  memoryWriteNormal(address, data) {
    this.memory[address] = data;
  }

  memoryHighWriteNormal(address, data) {
    this.memory[0xff00 | address] = data;
  }

  memoryWriteMBCRAM(address, data) {
    this.cartridge.mbc.writeRAM(address, data);
  }

  memoryWriteMBC3RAM(address, data) {
    return this.cartridge.mbc.writeRAM(address, data);
  }

  memoryWriteGBCRAM(address, data) {
    this.GBCMemory[address + this.gbcRamBankPosition] = data;
  }

  memoryWriteOAMRAM(address, data) {
    if (this.modeSTAT < 2) {
      //OAM RAM cannot be written to in mode 2 & 3
      if (this.memory[address] != data) {
        this.graphicsJIT();
        this.memory[address] = data;
      }
    }
  }

  memoryWriteECHOGBCRAM(address, data) {
    this.GBCMemory[address + this.gbcRamBankPositionECHO] = data;
  }

  memoryWriteECHONormal(address, data) {
    this.memory[address - 0x2000] = data;
  }

  VRAMGBDATAWrite(address, data) {
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

  VRAMGBDATAUpperWrite(address, data) {
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

  VRAMGBCDATAWrite(address, data) {
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

  VRAMGBCHRMAPWrite(address, data) {
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

  VRAMGBCCHRMAPWrite(address, data) {
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

  DMAWrite(tilesToTransfer) {
    if (!this.halt) {
      //Clock the CPU for the DMA transfer (CPU is halted during the transfer):
      this.CPUTicks += 4 | tilesToTransfer << 5 << this.doubleSpeedShifter;
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
          memory[0x8000 | destination] = this.memoryRead(source++);
          memory[0x8001 | destination] = this.memoryRead(source++);
          memory[0x8002 | destination] = this.memoryRead(source++);
          memory[0x8003 | destination] = this.memoryRead(source++);
          memory[0x8004 | destination] = this.memoryRead(source++);
          memory[0x8005 | destination] = this.memoryRead(source++);
          memory[0x8006 | destination] = this.memoryRead(source++);
          memory[0x8007 | destination] = this.memoryRead(source++);
          memory[0x8008 | destination] = this.memoryRead(source++);
          memory[0x8009 | destination] = this.memoryRead(source++);
          memory[0x800a | destination] = this.memoryRead(source++);
          memory[0x800b | destination] = this.memoryRead(source++);
          memory[0x800c | destination] = this.memoryRead(source++);
          memory[0x800d | destination] = this.memoryRead(source++);
          memory[0x800e | destination] = this.memoryRead(source++);
          memory[0x800f | destination] = this.memoryRead(source++);
          this.generateGBCTileBank1(destination);
          destination += 0x10;
        } else {
          destination &= 0x7f0;
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
          this.BGCHRBank1[destination++] = this.memoryRead(source++);
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
          VRAM[destination] = this.memoryRead(source++);
          VRAM[destination | 0x1] = this.memoryRead(source++);
          VRAM[destination | 0x2] = this.memoryRead(source++);
          VRAM[destination | 0x3] = this.memoryRead(source++);
          VRAM[destination | 0x4] = this.memoryRead(source++);
          VRAM[destination | 0x5] = this.memoryRead(source++);
          VRAM[destination | 0x6] = this.memoryRead(source++);
          VRAM[destination | 0x7] = this.memoryRead(source++);
          VRAM[destination | 0x8] = this.memoryRead(source++);
          VRAM[destination | 0x9] = this.memoryRead(source++);
          VRAM[destination | 0xa] = this.memoryRead(source++);
          VRAM[destination | 0xb] = this.memoryRead(source++);
          VRAM[destination | 0xc] = this.memoryRead(source++);
          VRAM[destination | 0xd] = this.memoryRead(source++);
          VRAM[destination | 0xe] = this.memoryRead(source++);
          VRAM[destination | 0xf] = this.memoryRead(source++);
          this.generateGBCTileBank2(destination);
          destination += 0x10;
        } else {
          destination &= 0x7f0;
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
          this.BGCHRBank2[destination++] = this.memoryRead(source++);
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

  registerWriteJumpCompile() {
    //I/O Registers (GB + GBC):
    //JoyPad
    this.memoryHighWriter[0] = this.memoryWriter[MemoryLayout.JOYPAD_REG] = (address, data) => {
      this.memory[MemoryLayout.JOYPAD_REG] = data & 0x30 |
        ((data & 0x20) === 0 ? this.joypad.value >> 4 : 0xf) &
        ((data & 0x10) === 0 ? this.joypad.value & 0xf : 0xf);
    };
    //SB (Serial Transfer Data)
    this.memoryHighWriter[0x1] = this.memoryWriter[MemoryLayout.SERIAL_DATA_REG] = (address, data) => {
      if (this.memory[MemoryLayout.SERIAL_CONTROL_REG] < 0x80) {
        //Cannot write while a serial transfer is active.
        this.memory[MemoryLayout.SERIAL_DATA_REG] = data;
      }
    };
    //SC (Serial Transfer Control):
    this.memoryHighWriter[0x2] = this.memoryHighWriteNormal;
    this.memoryWriter[MemoryLayout.SERIAL_CONTROL_REG] = this.memoryWriteNormal;
    //Unmapped I/O:
    this.memoryHighWriter[0x3] = this.memoryWriter[0xff03] = this.onIllegalWrite;
    //DIV
    this.memoryHighWriter[0x4] = this.memoryWriter[MemoryLayout.DIV_REG] = (address, data) => {
      this.DIVTicks &= 0xff; //Update DIV for realignment.
      this.memory[MemoryLayout.DIV_REG] = 0;
    };
    //TIMA
    this.memoryHighWriter[0x5] = this.memoryWriter[0xff05] = (address, data) => {
      this.memory[0xff05] = data;
    };
    //TMA
    this.memoryHighWriter[0x6] = this.memoryWriter[0xff06] = (address, data) => {
      this.memory[0xff06] = data;
    };
    //TAC
    this.memoryHighWriter[0x7] = this.memoryWriter[0xff07] = (address, data) => {
      this.memory[0xff07] = data & 0x07;
      this.TIMAEnabled = (data & 0x04) === 0x04;
      this.TACClocker = Math.pow(4, (data & 0x3) != 0 ? data & 0x3 : 4) << 2; //TODO: Find a way to not make a conditional in here...
    };
    //Unmapped I/O:
    this.memoryHighWriter[0x8] = this.memoryWriter[0xff08] = this.onIllegalWrite;
    this.memoryHighWriter[0x9] = this.memoryWriter[0xff09] = this.onIllegalWrite;
    this.memoryHighWriter[0xa] = this.memoryWriter[0xff0a] = this.onIllegalWrite;
    this.memoryHighWriter[0xb] = this.memoryWriter[0xff0b] = this.onIllegalWrite;
    this.memoryHighWriter[0xc] = this.memoryWriter[0xff0c] = this.onIllegalWrite;
    this.memoryHighWriter[0xd] = this.memoryWriter[0xff0d] = this.onIllegalWrite;
    this.memoryHighWriter[0xe] = this.memoryWriter[0xff0e] = this.onIllegalWrite;
    //IF (Interrupt Request)
    this.memoryHighWriter[0xf] = this.memoryWriter[0xff0f] = (address, data) => {
      this.interruptsRequested = data;
      this.checkIRQMatching();
    };
    //NR10:
    this.memoryHighWriter[0x10] = this.memoryWriter[0xff10] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        if (this.audioController.channel1decreaseSweep && (data & 0x08) === 0) {
          if (this.audioController.channel1Swept) {
            this.audioController.channel1SweepFault = true;
          }
        }
        this.audioController.channel1lastTimeSweep = (data & 0x70) >> 4;
        this.audioController.channel1frequencySweepDivider = data & 0x07;
        this.audioController.channel1decreaseSweep = (data & 0x08) === 0x08;
        this.memory[0xff10] = data;
        this.audioController.checkChannel1Enable();
      }
    };
    //NR11:
    this.memoryHighWriter[0x11] = this.memoryWriter[0xff11] = (address, data) => {
      if (this.soundMasterEnabled || !this.cartridge.useGBCMode) {
        if (this.soundMasterEnabled) {
          this.audioController.runJIT();
        } else {
          data &= 0x3f;
        }
        this.audioController.channel1CachedDuty = dutyLookup[data >> 6];
        this.audioController.channel1totalLength = 0x40 - (data & 0x3f);
        this.memory[0xff11] = data;
        this.audioController.checkChannel1Enable();
      }
    };
    //NR12:
    this.memoryHighWriter[0x12] = this.memoryWriter[0xff12] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        if (this.audioController.channel1Enabled && this.audioController.channel1envelopeSweeps === 0) {
          //Zombie Volume PAPU Bug:
          if (((this.memory[0xff12] ^ data) & 0x8) === 0x8) {
            if ((this.memory[0xff12] & 0x8) === 0) {
              if ((this.memory[0xff12] & 0x7) === 0x7) {
                this.audioController.channel1envelopeVolume += 2;
              } else {
                ++this.audioController.channel1envelopeVolume;
              }
            }
            this.audioController.channel1envelopeVolume = 16 - this.audioController.channel1envelopeVolume & 0xf;
          } else if ((this.memory[0xff12] & 0xf) === 0x8) {
            this.audioController.channel1envelopeVolume = 1 + this.audioController.channel1envelopeVolume & 0xf;
          }
          this.audioController.cacheChannel1OutputLevel();
        }
        this.audioController.channel1envelopeType = (data & 0x08) === 0x08;
        this.memory[0xff12] = data;
        this.audioController.checkChannel1VolumeEnable();
      }
    };
    //NR13:
    this.memoryHighWriter[0x13] = this.memoryWriter[0xff13] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        this.audioController.channel1frequency = this.audioController.channel1frequency & 0x700 | data;
        this.audioController.channel1FrequencyTracker = 0x800 - this.audioController.channel1frequency << 2;
      }
    };
    //NR14:
    this.memoryHighWriter[0x14] = this.memoryWriter[0xff14] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        this.audioController.channel1consecutive = (data & 0x40) === 0x0;
        this.audioController.channel1frequency = (data & 0x7) << 8 | this.audioController.channel1frequency & 0xff;
        this.audioController.channel1FrequencyTracker = 0x800 - this.audioController.channel1frequency << 2;
        if (data > 0x7f) {
          //Reload 0xFF10:
          this.audioController.channel1timeSweep = this.audioController.channel1lastTimeSweep;
          this.audioController.channel1Swept = false;
          //Reload 0xFF12:
          var nr12 = this.memory[0xff12];
          this.audioController.channel1envelopeVolume = nr12 >> 4;
          this.audioController.cacheChannel1OutputLevel();
          this.audioController.channel1envelopeSweepsLast = (nr12 & 0x7) - 1;
          if (this.audioController.channel1totalLength === 0) {
            this.audioController.channel1totalLength = 0x40;
          }
          if (
            this.audioController.channel1lastTimeSweep > 0 ||
            this.audioController.channel1frequencySweepDivider > 0
          ) {
            this.memory[0xff26] |= 0x1;
          } else {
            this.memory[0xff26] &= 0xfe;
          }
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x1;
          }
          this.audioController.channel1ShadowFrequency = this.audioController.channel1frequency;
          //Reset frequency overflow check + frequency sweep type check:
          this.audioController.channel1SweepFault = false;
          //Supposed to run immediately:
          this.audioController.performChannel1AudioSweepDummy();
        }
        this.audioController.checkChannel1Enable();
        this.memory[0xff14] = data;
      }
    };
    //NR20 (Unused I/O):
    this.memoryHighWriter[0x15] = this.memoryWriter[0xff15] = this.onIllegalWrite;
    //NR21:
    this.memoryHighWriter[0x16] = this.memoryWriter[0xff16] = (address, data) => {
      if (this.soundMasterEnabled || !this.cartridge.useGBCMode) {
        if (this.soundMasterEnabled) {
          this.audioController.runJIT();
        } else {
          data &= 0x3f;
        }
        this.audioController.channel2CachedDuty = dutyLookup[data >> 6];
        this.audioController.channel2totalLength = 0x40 - (data & 0x3f);
        this.memory[0xff16] = data;
        this.audioController.checkChannel2Enable();
      }
    };
    //NR22:
    this.memoryHighWriter[0x17] = this.memoryWriter[0xff17] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        if (this.audioController.channel2Enabled && this.audioController.channel2envelopeSweeps === 0) {
          //Zombie Volume PAPU Bug:
          if (((this.memory[0xff17] ^ data) & 0x8) === 0x8) {
            if ((this.memory[0xff17] & 0x8) === 0) {
              if ((this.memory[0xff17] & 0x7) === 0x7) {
                this.audioController.channel2envelopeVolume += 2;
              } else {
                ++this.audioController.channel2envelopeVolume;
              }
            }
            this.audioController.channel2envelopeVolume = 16 - this.audioController.channel2envelopeVolume & 0xf;
          } else if ((this.memory[0xff17] & 0xf) === 0x8) {
            this.audioController.channel2envelopeVolume = 1 + this.audioController.channel2envelopeVolume & 0xf;
          }
          this.audioController.cacheChannel2OutputLevel();
        }
        this.audioController.channel2envelopeType = (data & 0x08) === 0x08;
        this.memory[0xff17] = data;
        this.audioController.checkChannel2VolumeEnable();
      }
    };
    //NR23:
    this.memoryHighWriter[0x18] = this.memoryWriter[0xff18] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        this.audioController.channel2frequency = this.audioController.channel2frequency & 0x700 | data;
        this.audioController.channel2FrequencyTracker = 0x800 - this.audioController.channel2frequency << 2;
      }
    };
    //NR24:
    this.memoryHighWriter[0x19] = this.memoryWriter[0xff19] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        if (data > 0x7f) {
          //Reload 0xFF17:
          var nr22 = this.memory[0xff17];
          this.audioController.channel2envelopeVolume = nr22 >> 4;
          this.audioController.cacheChannel2OutputLevel();
          this.audioController.channel2envelopeSweepsLast = (nr22 & 0x7) - 1;
          if (this.audioController.channel2totalLength === 0) {
            this.audioController.channel2totalLength = 0x40;
          }
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x2;
          }
        }
        this.audioController.channel2consecutive = (data & 0x40) === 0x0;
        this.audioController.channel2frequency = (data & 0x7) << 8 | this.audioController.channel2frequency & 0xff;
        this.audioController.channel2FrequencyTracker = 0x800 - this.audioController.channel2frequency << 2;
        this.memory[0xff19] = data;
        this.audioController.checkChannel2Enable();
      }
    };
    //NR30:
    this.memoryHighWriter[0x1a] = this.memoryWriter[0xff1a] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        if (!this.audioController.channel3canPlay && data >= 0x80) {
          this.audioController.channel3lastSampleLookup = 0;
          this.audioController.cacheChannel3Update();
        }
        this.audioController.channel3canPlay = data > 0x7f;
        if (this.audioController.channel3canPlay && this.memory[0xff1a] > 0x7f && !this.audioController.channel3consecutive) {
          this.memory[0xff26] |= 0x4;
        }
        this.memory[0xff1a] = data;
        //this.audioController.checkChannel3Enable();
      }
    };
    //NR31:
    this.memoryHighWriter[0x1b] = this.memoryWriter[0xff1b] = (address, data) => {
      if (this.soundMasterEnabled || !this.cartridge.useGBCMode) {
        if (this.soundMasterEnabled) {
          this.audioController.runJIT();
        }
        this.audioController.channel3totalLength = 0x100 - data;
        this.audioController.checkChannel3Enable();
      }
    };
    //NR32:
    this.memoryHighWriter[0x1c] = this.memoryWriter[0xff1c] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        data &= 0x60;
        this.memory[0xff1c] = data;
        this.audioController.channel3patternType = data === 0 ? 4 : (data >> 5) - 1;
      }
    };
    //NR33:
    this.memoryHighWriter[0x1d] = this.memoryWriter[0xff1d] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        this.audioController.channel3frequency = this.audioController.channel3frequency & 0x700 | data;
        this.audioController.channel3FrequencyPeriod = 0x800 - this.audioController.channel3frequency << 1;
      }
    };
    //NR34:
    this.memoryHighWriter[0x1e] = this.memoryWriter[0xff1e] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        if (data > 0x7f) {
          if (this.audioController.channel3totalLength === 0) {
            this.audioController.channel3totalLength = 0x100;
          }
          this.audioController.channel3lastSampleLookup = 0;
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x4;
          }
        }
        this.audioController.channel3consecutive = (data & 0x40) === 0x0;
        this.audioController.channel3frequency = (data & 0x7) << 8 | this.audioController.channel3frequency & 0xff;
        this.audioController.channel3FrequencyPeriod = 0x800 - this.audioController.channel3frequency << 1;
        this.memory[0xff1e] = data;
        this.audioController.checkChannel3Enable();
      }
    };
    //NR40 (Unused I/O):
    this.memoryHighWriter[0x1f] = this.memoryWriter[0xff1f] = this.onIllegalWrite;
    //NR41:
    this.memoryHighWriter[0x20] = this.memoryWriter[0xff20] = (address, data) => {
      if (this.soundMasterEnabled || !this.cartridge.useGBCMode) {
        if (this.soundMasterEnabled) {
          this.audioController.runJIT();
        }
        this.audioController.channel4totalLength = 0x40 - (data & 0x3f);
        this.audioController.checkChannel4Enable();
      }
    };
    //NR42:
    this.memoryHighWriter[0x21] = this.memoryWriter[0xff21] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        if (this.audioController.channel4Enabled && this.audioController.channel4envelopeSweeps === 0) {
          //Zombie Volume PAPU Bug:
          if (((this.memory[0xff21] ^ data) & 0x8) === 0x8) {
            if ((this.memory[0xff21] & 0x8) === 0) {
              if ((this.memory[0xff21] & 0x7) === 0x7) {
                this.audioController.channel4envelopeVolume += 2;
              } else {
                ++this.audioController.channel4envelopeVolume;
              }
            }
            this.audioController.channel4envelopeVolume = 16 - this.audioController.channel4envelopeVolume & 0xf;
          } else if ((this.memory[0xff21] & 0xf) === 0x8) {
            this.audioController.channel4envelopeVolume = 1 + this.audioController.channel4envelopeVolume & 0xf;
          }
          this.audioController.channel4currentVolume = this.audioController.channel4envelopeVolume << this.audioController.channel4VolumeShifter;
        }
        this.audioController.channel4envelopeType = (data & 0x08) === 0x08;
        this.memory[0xff21] = data;
        this.audioController.cacheChannel4Update();
        this.audioController.checkChannel4VolumeEnable();
      }
    };
    //NR43:
    this.memoryHighWriter[0x22] = this.memoryWriter[0xff22] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        this.audioController.channel4FrequencyPeriod = Math.max((data & 0x7) << 4, 8) << (data >> 4);
        var bitWidth = data & 0x8;
        if (bitWidth === 0x8 && this.audioController.channel4BitRange === 0x7fff || bitWidth === 0 && this.audioController.channel4BitRange === 0x7f) {
          this.audioController.channel4lastSampleLookup = 0;
          this.audioController.channel4BitRange = bitWidth === 0x8 ? 0x7f : 0x7fff;
          this.audioController.channel4VolumeShifter = bitWidth === 0x8 ? 7 : 15;
          this.audioController.channel4currentVolume = this.audioController.channel4envelopeVolume << this.audioController.channel4VolumeShifter;
          this.audioController.noiseSampleTable = bitWidth === 0x8 ? this.audioController.LSFR7Table : this.audioController.LSFR15Table;
        }
        this.memory[0xff22] = data;
        this.audioController.cacheChannel4Update();
      }
    };
    //NR44:
    this.memoryHighWriter[0x23] = this.memoryWriter[0xff23] = (address, data) => {
      if (this.soundMasterEnabled) {
        this.audioController.runJIT();
        this.memory[0xff23] = data;
        this.audioController.channel4consecutive = (data & 0x40) === 0x0;
        if (data > 0x7f) {
          var nr42 = this.memory[0xff21];
          this.audioController.channel4envelopeVolume = nr42 >> 4;
          this.audioController.channel4currentVolume = this.audioController.channel4envelopeVolume << this.audioController.channel4VolumeShifter;
          this.audioController.channel4envelopeSweepsLast = (nr42 & 0x7) - 1;
          if (this.audioController.channel4totalLength === 0) {
            this.audioController.channel4totalLength = 0x40;
          }
          if ((data & 0x40) === 0x40) {
            this.memory[0xff26] |= 0x8;
          }
        }
        this.audioController.checkChannel4Enable();
      }
    };
    //NR50:
    this.memoryHighWriter[0x24] = this.memoryWriter[0xff24] = (address, data) => {
      if (this.soundMasterEnabled && this.memory[0xff24] != data) {
        this.audioController.runJIT();
        this.memory[0xff24] = data;
        this.audioController.VinLeftChannelMasterVolume = (data >> 4 & 0x07) + 1;
        this.audioController.VinRightChannelMasterVolume = (data & 0x07) + 1;
        this.audioController.cacheMixerOutputLevel();
      }
    };
    //NR51:
    this.memoryHighWriter[0x25] = this.memoryWriter[0xff25] = (address, data) => {
      if (this.soundMasterEnabled && this.memory[0xff25] != data) {
        this.audioController.runJIT();
        this.memory[0xff25] = data;
        this.audioController.rightChannel1 = (data & 0x01) === 0x01;
        this.audioController.rightChannel2 = (data & 0x02) === 0x02;
        this.audioController.rightChannel3 = (data & 0x04) === 0x04;
        this.audioController.rightChannel4 = (data & 0x08) === 0x08;
        this.audioController.leftChannel1 = (data & 0x10) === 0x10;
        this.audioController.leftChannel2 = (data & 0x20) === 0x20;
        this.audioController.leftChannel3 = (data & 0x40) === 0x40;
        this.audioController.leftChannel4 = data > 0x7f;
        this.audioController.cacheChannel1OutputLevel();
        this.audioController.cacheChannel2OutputLevel();
        this.audioController.cacheChannel3OutputLevel();
        this.audioController.cacheChannel4OutputLevel();
      }
    };
    //NR52:
    this.memoryHighWriter[0x26] = this.memoryWriter[0xff26] = (address, data) => {
      this.audioController.runJIT();
      if (!this.soundMasterEnabled && data > 0x7f) {
        this.memory[0xff26] = 0x80;
        this.soundMasterEnabled = true;
        this.audioController.initStartState();
      } else if (this.soundMasterEnabled && data < 0x80) {
        this.memory[0xff26] = 0;
        this.soundMasterEnabled = false;
        //GBDev wiki says the registers are written with zeros on audio off:
        for (var index = 0xff10; index < 0xff26; index++) {
          this.memoryWriter[index].apply(this, [index, 0]);
        }
      }
    };
    //0xFF27 to 0xFF2F don't do anything...
    this.memoryHighWriter[0x27] = this.memoryWriter[0xff27] = this.onIllegalWrite;
    this.memoryHighWriter[0x28] = this.memoryWriter[0xff28] = this.onIllegalWrite;
    this.memoryHighWriter[0x29] = this.memoryWriter[0xff29] = this.onIllegalWrite;
    this.memoryHighWriter[0x2a] = this.memoryWriter[0xff2a] = this.onIllegalWrite;
    this.memoryHighWriter[0x2b] = this.memoryWriter[0xff2b] = this.onIllegalWrite;
    this.memoryHighWriter[0x2c] = this.memoryWriter[0xff2c] = this.onIllegalWrite;
    this.memoryHighWriter[0x2d] = this.memoryWriter[0xff2d] = this.onIllegalWrite;
    this.memoryHighWriter[0x2e] = this.memoryWriter[0xff2e] = this.onIllegalWrite;
    this.memoryHighWriter[0x2f] = this.memoryWriter[0xff2f] = this.onIllegalWrite;
    //WAVE PCM RAM:
    this.memoryHighWriter[0x30] = this.memoryWriter[0xff30] = (address, data) => {
      this.writeChannel3RAM(0, data);
    };
    this.memoryHighWriter[0x31] = this.memoryWriter[0xff31] = (address, data) => {
      this.writeChannel3RAM(0x1, data);
    };
    this.memoryHighWriter[0x32] = this.memoryWriter[0xff32] = (address, data) => {
      this.writeChannel3RAM(0x2, data);
    };
    this.memoryHighWriter[0x33] = this.memoryWriter[0xff33] = (address, data) => {
      this.writeChannel3RAM(0x3, data);
    };
    this.memoryHighWriter[0x34] = this.memoryWriter[0xff34] = (address, data) => {
      this.writeChannel3RAM(0x4, data);
    };
    this.memoryHighWriter[0x35] = this.memoryWriter[0xff35] = (address, data) => {
      this.writeChannel3RAM(0x5, data);
    };
    this.memoryHighWriter[0x36] = this.memoryWriter[0xff36] = (address, data) => {
      this.writeChannel3RAM(0x6, data);
    };
    this.memoryHighWriter[0x37] = this.memoryWriter[0xff37] = (address, data) => {
      this.writeChannel3RAM(0x7, data);
    };
    this.memoryHighWriter[0x38] = this.memoryWriter[0xff38] = (address, data) => {
      this.writeChannel3RAM(0x8, data);
    };
    this.memoryHighWriter[0x39] = this.memoryWriter[0xff39] = (address, data) => {
      this.writeChannel3RAM(0x9, data);
    };
    this.memoryHighWriter[0x3a] = this.memoryWriter[0xff3a] = (address, data) => {
      this.writeChannel3RAM(0xa, data);
    };
    this.memoryHighWriter[0x3b] = this.memoryWriter[0xff3b] = (address, data) => {
      this.writeChannel3RAM(0xb, data);
    };
    this.memoryHighWriter[0x3c] = this.memoryWriter[0xff3c] = (address, data) => {
      this.writeChannel3RAM(0xc, data);
    };
    this.memoryHighWriter[0x3d] = this.memoryWriter[0xff3d] = (address, data) => {
      this.writeChannel3RAM(0xd, data);
    };
    this.memoryHighWriter[0x3e] = this.memoryWriter[0xff3e] = (address, data) => {
      this.writeChannel3RAM(0xe, data);
    };
    this.memoryHighWriter[0x3f] = this.memoryWriter[0xff3f] = (address, data) => {
      this.writeChannel3RAM(0xf, data);
    };
    //SCY
    this.memoryHighWriter[0x42] = this.memoryWriter[0xff42] = (address, data) => {
      if (this.backgroundY != data) {
        this.midScanLineJIT();
        this.backgroundY = data;
      }
    };
    //SCX
    this.memoryHighWriter[0x43] = this.memoryWriter[0xff43] = (address, data) => {
      if (this.backgroundX != data) {
        this.midScanLineJIT();
        this.backgroundX = data;
      }
    };
    //LY
    this.memoryHighWriter[0x44] = this.memoryWriter[0xff44] = (address, data) => {
      //Read Only:
      if (this.LCDisOn) {
        //Gambatte says to do this:
        this.modeSTAT = 2;
        this.midScanlineOffset = -1;
        this.cpu.totalLinesPassed = this.currentX = this.queuedScanLines = this.lastUnrenderedLine = this.LCDTicks = this.STATTracker = this.actualScanLine = this.memory[0xff44] = 0;
      }
    };
    //LYC
    this.memoryHighWriter[0x45] = this.memoryWriter[0xff45] = (address, data) => {
      if (this.memory[0xff45] != data) {
        this.memory[0xff45] = data;
        if (this.LCDisOn) {
          this.matchLYC(); //Get the compare of the first scan line.
        }
      }
    };
    //WY
    this.memoryHighWriter[0x4a] = this.memoryWriter[0xff4a] = (address, data) => {
      if (this.windowY != data) {
        this.midScanLineJIT();
        this.windowY = data;
      }
    };
    //WX
    this.memoryHighWriter[0x4b] = this.memoryWriter[0xff4b] = (address, data) => {
      if (this.memory[0xff4b] != data) {
        this.midScanLineJIT();
        this.memory[0xff4b] = data;
        this.windowX = data - 7;
      }
    };
    this.memoryHighWriter[0x72] = this.memoryWriter[0xff72] = (address, data) => {
      this.memory[0xff72] = data;
    };
    this.memoryHighWriter[0x73] = this.memoryWriter[0xff73] = (address, data) => {
      this.memory[0xff73] = data;
    };
    this.memoryHighWriter[0x75] = this.memoryWriter[0xff75] = (address, data) => {
      this.memory[0xff75] = data;
    };
    this.memoryHighWriter[0x76] = this.memoryWriter[0xff76] = this.onIllegalWrite;
    this.memoryHighWriter[0x77] = this.memoryWriter[0xff77] = this.onIllegalWrite;
    this.memoryHighWriter[0xff] = this.memoryWriter[MemoryLayout.INTERRUPT_ENABLE_REG] = (address, data) => {
      this.interruptsEnabled = data;
      this.checkIRQMatching();
    };
    this.recompileModelSpecificIOWriteHandling();
    this.recompileBootIOWriteHandling();
  }

  recompileModelSpecificIOWriteHandling() {
    if (this.cartridge.useGBCMode) {
      // GameBoy Color Specific I/O:
      // SC (Serial Transfer Control Register)
      this.memoryHighWriter[0x2] = this.memoryWriter[MemoryLayout.SERIAL_CONTROL_REG] = (address, data) => {
        if ((data & 0x1) === 0x1) {
          // Internal clock:
          this.memory[MemoryLayout.SERIAL_CONTROL_REG] = data & 0x7f;
          this.serialTimer = (data & 0x2) === 0 ? 4096 : 128; //Set the Serial IRQ counter.
          this.serialShiftTimer = this.serialShiftTimerAllocated = (data & 0x2) === 0 ? 512 : 16; //Set the transfer data shift counter.
        } else {
          // External clock:
          this.memory[MemoryLayout.SERIAL_CONTROL_REG] = data;
          this.serialShiftTimer = this.serialShiftTimerAllocated = this.serialTimer = 0; //Zero the timers, since we're emulating as if nothing is connected.
        }
      };
      this.memoryHighWriter[0x40] = this.memoryWriter[0xff40] = (address, data) => {
        if (this.memory[0xff40] != data) {
          this.midScanLineJIT();
          var temp_var = data > 0x7f;
          if (temp_var != this.LCDisOn) {
            // When the display mode changes...
            this.LCDisOn = temp_var;
            this.memory[0xff41] &= 0x78;
            this.midScanlineOffset = -1;
            this.cpu.totalLinesPassed = this.currentX = this.queuedScanLines = this.lastUnrenderedLine = this.STATTracker = this.LCDTicks = this.actualScanLine = this.memory[0xff44] = 0;
            if (this.LCDisOn) {
              this.modeSTAT = 2;
              this.matchLYC(); // Get the compare of the first scan line.
              this.LCDCONTROL = this.LINECONTROL;
            } else {
              this.modeSTAT = 0;
              this.LCDCONTROL = this.DISPLAYOFFCONTROL;
              this.lcdDevice.DisplayShowOff();
            }
            this.interruptsRequested &= 0xfd;
          }
          this.gfxWindowCHRBankPosition = (data & 0x40) === 0x40 ? 0x400 : 0;
          this.gfxWindowDisplay = (data & 0x20) === 0x20;
          this.gfxBackgroundBankOffset = (data & 0x10) === 0x10 ? 0 : 0x80;
          this.gfxBackgroundCHRBankPosition = (data & 0x08) === 0x08 ? 0x400 : 0;
          this.gfxSpriteNormalHeight = (data & 0x04) === 0;
          this.gfxSpriteShow = (data & 0x02) === 0x02;
          this.hasBGPriority = (data & 0x01) === 0x01;
          this.priorityFlaggingPathRebuild(); // Special case the priority flagging as an optimization.
          this.memory[0xff40] = data;
        }
      };
      this.memoryHighWriter[0x41] = this.memoryWriter[0xff41] = (address, data) => {
        this.LYCMatchTriggerSTAT = (data & 0x40) === 0x40;
        this.mode2TriggerSTAT = (data & 0x20) === 0x20;
        this.mode1TriggerSTAT = (data & 0x10) === 0x10;
        this.mode0TriggerSTAT = (data & 0x08) === 0x08;
        this.memory[0xff41] = data & 0x78;
      };
      this.memoryHighWriter[0x46] = this.memoryWriter[0xff46] = (address, data) => {
        this.memory[0xff46] = data;
        if (data < 0xe0) {
          data <<= 8;
          address = 0xfe00;
          var stat = this.modeSTAT;
          this.modeSTAT = 0;
          var newData = 0;
          do {
            newData = this.memoryRead(data++);
            if (newData != this.memory[address]) {
              // JIT the graphics render queue:
              this.modeSTAT = stat;
              this.graphicsJIT();
              this.modeSTAT = 0;
              this.memory[address++] = newData;
              break;
            }
          } while (++address < 0xfea0);
          if (address < 0xfea0) {
            do {
              this.memory[address++] = this.memoryRead(data++);
              this.memory[address++] = this.memoryRead(data++);
              this.memory[address++] = this.memoryRead(data++);
              this.memory[address++] = this.memoryRead(data++);
            } while (address < 0xfea0);
          }
          this.modeSTAT = stat;
        }
      };
      //KEY1
      this.memoryHighWriter[0x4d] = this.memoryWriter[0xff4d] = (address, data) => {
        this.memory[0xff4d] = data & 0x7f | this.memory[0xff4d] & 0x80;
      };
      this.memoryHighWriter[0x4f] = this.memoryWriter[0xff4f] = (address, data) => {
        this.currVRAMBank = data & 0x01;
        if (this.currVRAMBank > 0) {
          this.BGCHRCurrentBank = this.BGCHRBank2;
        } else {
          this.BGCHRCurrentBank = this.BGCHRBank1;
        }

        //Only writable by GBC.
      };
      this.memoryHighWriter[0x51] = this.memoryWriter[0xff51] = (address, data) => {
        if (!this.hdmaRunning) {
          this.memory[0xff51] = data;
        }
      };
      this.memoryHighWriter[0x52] = this.memoryWriter[0xff52] = (address, data) => {
        if (!this.hdmaRunning) {
          this.memory[0xff52] = data & 0xf0;
        }
      };
      this.memoryHighWriter[0x53] = this.memoryWriter[0xff53] = (address, data) => {
        if (!this.hdmaRunning) {
          this.memory[0xff53] = data & 0x1f;
        }
      };
      this.memoryHighWriter[0x54] = this.memoryWriter[0xff54] = (address, data) => {
        if (!this.hdmaRunning) {
          this.memory[0xff54] = data & 0xf0;
        }
      };
      this.memoryHighWriter[0x55] = this.memoryWriter[0xff55] = (address, data) => {
        if (!this.hdmaRunning) {
          if ((data & 0x80) === 0) {
            //DMA
            this.DMAWrite((data & 0x7f) + 1);
            this.memory[0xff55] = 0xff; //Transfer completed.
          } else {
            //H-Blank DMA
            this.hdmaRunning = true;
            this.memory[0xff55] = data & 0x7f;
          }
        } else if ((data & 0x80) === 0) {
          //Stop H-Blank DMA
          this.hdmaRunning = false;
          this.memory[0xff55] |= 0x80;
        } else {
          this.memory[0xff55] = data & 0x7f;
        }
      };
      this.memoryHighWriter[0x68] = this.memoryWriter[0xff68] = (address, data) => {
        this.memory[0xff69] = this.gbcBGRawPalette[data & 0x3f];
        this.memory[0xff68] = data;
      };
      this.memoryHighWriter[0x69] = this.memoryWriter[0xff69] = (address, data) => {
        this.updateGBCBGPalette(this.memory[0xff68] & 0x3f, data);
        if (this.memory[0xff68] > 0x7f) {
          // high bit = autoincrement
          var next = this.memory[0xff68] + 1 & 0x3f;
          this.memory[0xff68] = next | 0x80;
          this.memory[0xff69] = this.gbcBGRawPalette[next];
        } else {
          this.memory[0xff69] = data;
        }
      };
      this.memoryHighWriter[0x6a] = this.memoryWriter[0xff6a] = (address, data) => {
        this.memory[0xff6b] = this.gbcOBJRawPalette[data & 0x3f];
        this.memory[0xff6a] = data;
      };
      this.memoryHighWriter[0x6b] = this.memoryWriter[0xff6b] = (address, data) => {
        this.updateGBCOBJPalette(this.memory[0xff6a] & 0x3f, data);
        if (this.memory[0xff6a] > 0x7f) {
          // high bit = autoincrement
          var next = this.memory[0xff6a] + 1 & 0x3f;
          this.memory[0xff6a] = next | 0x80;
          this.memory[0xff6b] = this.gbcOBJRawPalette[next];
        } else {
          this.memory[0xff6b] = data;
        }
      };
      //SVBK
      this.memoryHighWriter[0x70] = this.memoryWriter[0xff70] = (address, data) => {
        var addressCheck = this.memory[0xff51] << 8 | this.memory[0xff52]; //Cannot change the RAM bank while WRAM is the source of a running HDMA.
        if (!this.hdmaRunning || addressCheck < 0xd000 || addressCheck >= 0xe000) {
          this.gbcRamBank = Math.max(data & 0x07, 1); //Bank range is from 1-7
          this.gbcRamBankPosition = (this.gbcRamBank - 1 << 12) - 0xd000;
          this.gbcRamBankPositionECHO = this.gbcRamBankPosition - 0x2000;
        }
        this.memory[0xff70] = data; //Bit 6 cannot be written to.
      };
      this.memoryHighWriter[0x74] = this.memoryWriter[0xff74] = (address, data) => {
        this.memory[0xff74] = data;
      };
    } else {
      //Fill in the GameBoy Color I/O registers as normal RAM for GameBoy compatibility:
      //SC (Serial Transfer Control Register)
      this.memoryHighWriter[0x2] = this.memoryWriter[MemoryLayout.SERIAL_CONTROL_REG] = (address, data) => {
        if ((data & 0x1) === 0x1) {
          //Internal clock:
          this.memory[MemoryLayout.SERIAL_CONTROL_REG] = data & 0x7f;
          this.serialTimer = 4096; //Set the Serial IRQ counter.
          this.serialShiftTimer = this.serialShiftTimerAllocated = 512; //Set the transfer data shift counter.
        } else {
          //External clock:
          this.memory[MemoryLayout.SERIAL_CONTROL_REG] = data;
          this.serialShiftTimer = this.serialShiftTimerAllocated = this.serialTimer = 0; //Zero the timers, since we're emulating as if nothing is connected.
        }
      };
      this.memoryHighWriter[0x40] = this.memoryWriter[0xff40] = (address, data) => {
        if (this.memory[0xff40] != data) {
          this.midScanLineJIT();
          var temp_var = data > 0x7f;
          if (temp_var != this.LCDisOn) {
            //When the display mode changes...
            this.LCDisOn = temp_var;
            this.memory[0xff41] &= 0x78;
            this.midScanlineOffset = -1;
            this.cpu.totalLinesPassed = this.currentX = this.queuedScanLines = this.lastUnrenderedLine = this.STATTracker = this.LCDTicks = this.actualScanLine = this.memory[0xff44] = 0;
            if (this.LCDisOn) {
              this.modeSTAT = 2;
              this.matchLYC(); //Get the compare of the first scan line.
              this.LCDCONTROL = this.LINECONTROL;
            } else {
              this.modeSTAT = 0;
              this.LCDCONTROL = this.DISPLAYOFFCONTROL;
              this.lcdDevice.DisplayShowOff();
            }
            this.interruptsRequested &= 0xfd;
          }
          this.gfxWindowCHRBankPosition = (data & 0x40) === 0x40 ? 0x400 : 0;
          this.gfxWindowDisplay = (data & 0x20) === 0x20;
          this.gfxBackgroundBankOffset = (data & 0x10) === 0x10 ? 0 : 0x80;
          this.gfxBackgroundCHRBankPosition = (data & 0x08) === 0x08 ? 0x400 : 0;
          this.gfxSpriteNormalHeight = (data & 0x04) === 0;
          this.gfxSpriteShow = (data & 0x02) === 0x02;
          this.bgEnabled = (data & 0x01) === 0x01;
          this.memory[0xff40] = data;
        }
      };
      this.memoryHighWriter[0x41] = this.memoryWriter[0xff41] = (address, data) => {
        this.LYCMatchTriggerSTAT = (data & 0x40) === 0x40;
        this.mode2TriggerSTAT = (data & 0x20) === 0x20;
        this.mode1TriggerSTAT = (data & 0x10) === 0x10;
        this.mode0TriggerSTAT = (data & 0x08) === 0x08;
        this.memory[0xff41] = data & 0x78;
        if ((!this.usedBootROM || !this.usedGBCBootROM) && this.LCDisOn && this.modeSTAT < 2) {
          this.interruptsRequested |= 0x2;
          this.checkIRQMatching();
        }
      };
      this.memoryHighWriter[0x46] = this.memoryWriter[0xff46] = (address, data) => {
        this.memory[0xff46] = data;
        if (data > 0x7f && data < 0xe0) {
          //DMG cannot DMA from the ROM banks.
          data <<= 8;
          address = 0xfe00;
          var stat = this.modeSTAT;
          this.modeSTAT = 0;
          var newData = 0;
          do {
            newData = this.memoryRead(data++);
            if (newData != this.memory[address]) {
              //JIT the graphics render queue:
              this.modeSTAT = stat;
              this.graphicsJIT();
              this.modeSTAT = 0;
              this.memory[address++] = newData;
              break;
            }
          } while (++address < 0xfea0);
          if (address < 0xfea0) {
            do {
              this.memory[address++] = this.memoryRead(data++);
              this.memory[address++] = this.memoryRead(data++);
              this.memory[address++] = this.memoryRead(data++);
              this.memory[address++] = this.memoryRead(data++);
            } while (address < 0xfea0);
          }
          this.modeSTAT = stat;
        }
      };
      this.memoryHighWriter[0x47] = this.memoryWriter[0xff47] = (address, data) => {
        if (this.memory[0xff47] != data) {
          this.midScanLineJIT();
          this.updateGBBGPalette(data);
          this.memory[0xff47] = data;
        }
      };
      this.memoryHighWriter[0x48] = this.memoryWriter[0xff48] = (address, data) => {
        if (this.memory[0xff48] != data) {
          this.midScanLineJIT();
          this.updateGBOBJPalette(0, data);
          this.memory[0xff48] = data;
        }
      };
      this.memoryHighWriter[0x49] = this.memoryWriter[0xff49] = (address, data) => {
        if (this.memory[0xff49] != data) {
          this.midScanLineJIT();
          this.updateGBOBJPalette(4, data);
          this.memory[0xff49] = data;
        }
      };
      this.memoryHighWriter[0x4d] = this.memoryWriter[0xff4d] = (address, data) => {
        this.memory[0xff4d] = data;
      };
      this.memoryHighWriter[0x4f] = this.memoryWriter[0xff4f] = this.onIllegalWrite; //Not writable in DMG mode.
      this.memoryHighWriter[0x55] = this.memoryWriter[0xff55] = this.onIllegalWrite;
      this.memoryHighWriter[0x68] = this.memoryWriter[0xff68] = this.onIllegalWrite;
      this.memoryHighWriter[0x69] = this.memoryWriter[0xff69] = this.onIllegalWrite;
      this.memoryHighWriter[0x6a] = this.memoryWriter[0xff6a] = this.onIllegalWrite;
      this.memoryHighWriter[0x6b] = this.memoryWriter[0xff6b] = this.onIllegalWrite;
      this.memoryHighWriter[0x6c] = this.memoryWriter[0xff6c] = this.onIllegalWrite;
      this.memoryHighWriter[0x70] = this.memoryWriter[0xff70] = this.onIllegalWrite;
      this.memoryHighWriter[0x74] = this.memoryWriter[0xff74] = this.onIllegalWrite;
    }
  }

  recompileBootIOWriteHandling() {
    //Boot I/O Registers:
    if (this.inBootstrap) {
      this.memoryHighWriter[0x50] = this.memoryWriter[0xff50] = (address, data) => {
        console.log("Boot ROM reads blocked: Bootstrap process has ended.", 0);
        this.inBootstrap = false;
        this.disableBootROM(); //Fill in the boot ROM ranges with ROM  bank 0 ROM ranges
        this.memory[0xff50] = data; //Bits are sustained in memory?
      };
      if (this.cartridge.useGBCMode) {
        this.memoryHighWriter[0x6c] = this.memoryWriter[0xff6c] = (address, data) => {
          if (this.inBootstrap) {
            this.cartridge.setGBCMode(data);
          }
          this.memory[0xff6c] = data;
        };
      }
    } else {
      //Lockout the ROMs from accessing the BOOT ROM control register:
      this.memoryHighWriter[0x50] = this.memoryWriter[0xff50] = this.onIllegalWrite;
    }
  };
}