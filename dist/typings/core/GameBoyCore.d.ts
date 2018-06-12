import * as util from "../util";
import AudioDevice from "./audio/device";
import AudioController from "./audio/controller";
import LcdDevice from "./lcd/device";
import LcdController from "./lcd/controller";
import StateManager from "./state-manager";
import Joypad from "./Joypad";
import { EventEmitter } from "events";
import Memory from "./memory/index";
import CPU from "./cpu";
import { GameBoy } from "..";
import Cartridge from "./cartridge";
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
    constructor({ audio: audioOptions, api, lcd: lcdOptions }: any);
    loadState(state: any): void;
    jumpCompile(): void;
    connectCartridge(cartridge: Cartridge): void;
    onRUMBLE(): void;
    loadCartridgeRomIntoMemory(): void;
    start(cartridge: Cartridge): void;
    init(): void;
    setupRAM(): void;
    initMemory(): void;
    generateCacheArray(tileAmount: any): any[];
    initSkipBootstrap(): void;
    initBootstrap(): void;
    disableBootROM(): void;
    setSpeed(speed: any): void;
    initSound(): void;
    writeChannel3RAM(address: any, data: any): void;
    run(): void;
    executeIteration(): void;
    iterationEndRoutine(): void;
    handleSTOP(): void;
    recalculateIterationClockLimit(): void;
    scanLineMode2(): void;
    scanLineMode3(): void;
    scanLineMode0(): void;
    clocksUntilLYCMatch(): number;
    clocksUntilMode0(): number;
    updateSpriteCount(line: any): void;
    matchLYC(): void;
    updateCore(): void;
    updateCoreFull(): void;
    initializeLCDController(): void;
    executeHDMA(): void;
    updateClock(): void;
    renderScanLine(scanlineToRender: any): void;
    renderMidScanLine(): void;
    initializeModeSpecificArrays(): void;
    adjustGBCtoGBMode(): void;
    renderPathBuild(): void;
    priorityFlaggingPathRebuild(): void;
    initializeReferencesFromSaveState(): void;
    adjustRGBTint(value: any): number;
    getGBCColor(): void;
    updateGBRegularBGPalette(data: any): void;
    updateGBColorizedBGPalette(data: any): void;
    updateGBRegularOBJPalette(index: any, data: any): void;
    updateGBColorizedOBJPalette(index: any, data: any): void;
    updateGBCBGPalette(index: any, data: any): void;
    updateGBCOBJPalette(index: any, data: any): void;
    renderBGGBLayer(scanlineToRender: any): void;
    BGGBCLayerRender(scanlineToRender: any): void;
    BGGBCLayerRenderNoPriorityFlagging(scanlineToRender: any): void;
    renderWindowGBLayer(scanlineToRender: any): void;
    WindowGBCLayerRender(scanlineToRender: any): void;
    WindowGBCLayerRenderNoPriorityFlagging(scanlineToRender: any): void;
    renderSpriteGBLayer(scanlineToRender: any): void;
    findLowestSpriteDrawable(scanlineToRender: any, drawableRange: any): number;
    renderSpriteGBCLayer(scanlineToRender: any): void;
    generateGBTileLine(address: any): void;
    generateGBCTileLineBank1(address: any): void;
    generateGBCTileBank1(vramAddress: any): void;
    generateGBCTileLineBank2(address: any): void;
    generateGBCTileBank2(vramAddress: any): void;
    generateGBOAMTileLine(address: any): void;
    graphicsJIT(): void;
    graphicsJITVBlank(): void;
    graphicsJITScanlineGroup(): void;
    incrementScanLineQueue(): void;
    midScanLineJIT(): void;
    launchIRQ(): void;
    checkIRQMatching(): void;
    calculateHALTPeriod(): void;
    memoryRead(address: any): any;
    memoryHighRead(address: any): any;
    memoryReadJumpCompile(): void;
    memoryReadNormal(address: any): any;
    memoryHighReadNormal(address: any): any;
    memoryReadROM(address: any): number;
    memoryReadMBC(address: any): any;
    memoryReadMBC7(address: any): any;
    memoryReadMBC3(address: any): any;
    memoryReadGBCMemory(address: any): number;
    memoryReadOAM(address: any): any;
    memoryReadECHOGBCMemory(address: any): number;
    memoryReadECHONormal(address: any): any;
    badMemoryRead(address: any): number;
    VRAMDATAReadCGBCPU(address: any): any;
    VRAMDATAReadDMGCPU(address: any): any;
    VRAMCHRReadCGBCPU(address: any): any;
    VRAMCHRReadDMGCPU(address: any): number;
    memoryWrite(address: any, data: any): void;
    memoryHighWrite(address: any, data: any): void;
    memoryWriteJumpCompile(): void;
    MBCWriteEnable(address: any, data: any): void;
    MBC1WriteROMBank(address: any, data: any): void;
    MBC1WriteRAMBank(address: any, data: any): void;
    MBC1WriteType(address: any, data: any): void;
    MBC2WriteROMBank(address: any, data: any): void;
    MBC3WriteROMBank(address: any, data: any): void;
    MBC3WriteRAMBank(address: any, data: any): void;
    MBC3WriteRTCLatch(address: any, data: any): void;
    MBC5WriteROMBankLow(address: any, data: any): void;
    MBC5WriteROMBankHigh(address: any, data: any): void;
    MBC5WriteRAMBank(address: any, data: any): void;
    RUMBLEWriteRAMBank(address: any, data: any): void;
    HuC3WriteRAMBank(address: any, data: any): void;
    onIllegalWrite(address: any, data: any): void;
    memoryWriteNormal(address: any, data: any): void;
    memoryHighWriteNormal(address: any, data: any): void;
    memoryWriteMBCRAM(address: any, data: any): void;
    memoryWriteMBC3RAM(address: any, data: any): void;
    memoryWriteGBCRAM(address: any, data: any): void;
    memoryWriteOAMRAM(address: any, data: any): void;
    memoryWriteECHOGBCRAM(address: any, data: any): void;
    memoryWriteECHONormal(address: any, data: any): void;
    VRAMGBDATAWrite(address: any, data: any): void;
    VRAMGBDATAUpperWrite(address: any, data: any): void;
    VRAMGBCDATAWrite(address: any, data: any): void;
    VRAMGBCHRMAPWrite(address: any, data: any): void;
    VRAMGBCCHRMAPWrite(address: any, data: any): void;
    DMAWrite(tilesToTransfer: any): void;
    registerWriteJumpCompile(): void;
    recompileModelSpecificIOWriteHandling(): void;
    recompileBootIOWriteHandling(): void;
}
