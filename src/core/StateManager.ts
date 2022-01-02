import GameBoyCore from "./GameBoyCore";
import initialState from "./initialState";
import { toTypedArray, concatArrayBuffers } from "../util";

export default class StateManager {
  gameboy: GameBoyCore;

  constructor(gameboy) {
    this.gameboy = gameboy;
  }

  init() {
    this.loadOld(initialState.slice(0));
  }

  get() {
    const gameboy = this.gameboy;
    if (!gameboy.cartridge) return null;

    return concatArrayBuffers(
      gameboy.memory.buffer.slice(0),
      gameboy.VRAM.buffer.slice(0)
    );

    // return [
    //   gameboy.isBootingRom,
    //   gameboy.registerA,
    //   gameboy.FZero,
    //   gameboy.FSubtract,
    //   gameboy.FHalfCarry,
    //   gameboy.FCarry,
    //   gameboy.registerB,
    //   gameboy.registerC,
    //   gameboy.registerD,
    //   gameboy.registerE,
    //   gameboy.registersHL,
    //   gameboy.stackPointer,
    //   gameboy.programCounter,
    //   gameboy.halt,
    //   gameboy.IME,
    //   gameboy.hdmaRunning,
    //   gameboy.currentInstructionCycleCount,
    //   gameboy.doubleSpeedShifter,
    //   // fromTypedArray(gameboy.memory),
    //   // fromTypedArray(gameboy.VRAM),
    //   gameboy.currVRAMBank,
    //   fromTypedArray(gameboy.GBCMemory),
    //   gameboy.gbcRamBank,
    //   gameboy.gbcRamBankPosition,
    //   gameboy.ROMBank1Offset,
    //   gameboy.cartridge.mbc.currentROMBank,
    //   gameboy.modeSTAT,
    //   gameboy.LYCMatchTriggerSTAT,
    //   gameboy.mode2TriggerSTAT,
    //   gameboy.mode1TriggerSTAT,
    //   gameboy.mode0TriggerSTAT,
    //   gameboy.gpu.lcdEnabled,
    //   gameboy.gfxWindowCHRBankPosition,
    //   gameboy.gfxWindowDisplay,
    //   gameboy.gfxSpriteShow,
    //   gameboy.gfxSpriteNormalHeight,
    //   gameboy.gfxBackgroundCHRBankPosition,
    //   gameboy.gfxBackgroundBankOffset,
    //   gameboy.TIMAEnabled,
    //   gameboy.DIVTicks,
    //   gameboy.LCDTicks,
    //   gameboy.timerTicks,
    //   gameboy.TACClocker,
    //   gameboy.serialTimer,
    //   gameboy.serialShiftTimer,
    //   gameboy.serialShiftTimerAllocated,
    //   gameboy.IRQEnableDelay,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.lastTime,
    //   gameboy.drewBlank,
    //   fromTypedArray(gameboy.frameBuffer),
    //   gameboy.bgEnabled,
    //   gameboy.audioController.channel1FrequencyTracker,
    //   gameboy.channel1FrequencyCounter,
    //   gameboy.channel1totalLength,
    //   gameboy.channel1EnvelopeVolume,
    //   gameboy.channel1EnvelopeType,
    //   gameboy.channel1EnvelopeSweeps,
    //   gameboy.channel1EnvelopeSweepsLast,
    //   gameboy.channel1consecutive,
    //   gameboy.channel1frequency,
    //   gameboy.channel1SweepFault,
    //   gameboy.channel1ShadowFrequency,
    //   gameboy.channel1timeSweep,
    //   gameboy.channel1lastTimeSweep,
    //   gameboy.channel1Swept,
    //   gameboy.channel1frequencySweepDivider,
    //   gameboy.channel1decreaseSweep,
    //   gameboy.channel2FrequencyTracker,
    //   gameboy.channel2FrequencyCounter,
    //   gameboy.channel2totalLength,
    //   gameboy.channel2EnvelopeVolume,
    //   gameboy.channel2EnvelopeType,
    //   gameboy.channel2EnvelopeSweeps,
    //   gameboy.channel2EnvelopeSweepsLast,
    //   gameboy.channel2consecutive,
    //   gameboy.channel2frequency,
    //   gameboy.channel3canPlay,
    //   gameboy.channel3totalLength,
    //   gameboy.channel3patternType,
    //   gameboy.channel3frequency,
    //   gameboy.channel3consecutive,
    //   fromTypedArray(gameboy.channel3PCM),
    //   gameboy.audioController.channel4FrequencyPeriod,
    //   gameboy.audioController.channel4lastSampleLookup,
    //   gameboy.channel4totalLength,
    //   gameboy.channel4EnvelopeVolume,
    //   gameboy.channel4currentVolume,
    //   gameboy.channel4EnvelopeType,
    //   gameboy.channel4EnvelopeSweeps,
    //   gameboy.channel4EnvelopeSweepsLast,
    //   gameboy.channel4consecutive,
    //   gameboy.channel4BitRange,
    //   gameboy.audioController.enabled,
    //   gameboy.audioController.VinLeftChannelMasterVolume,
    //   gameboy.audioController.VinRightChannelMasterVolume,
    //   gameboy.leftChannel1,
    //   gameboy.leftChannel2,
    //   gameboy.leftChannel3,
    //   gameboy.leftChannel4,
    //   gameboy.rightChannel1,
    //   gameboy.rightChannel2,
    //   gameboy.rightChannel3,
    //   gameboy.rightChannel4,
    //   gameboy.channel1currentSampleLeft,
    //   gameboy.channel1currentSampleRight,
    //   gameboy.channel2currentSampleLeft,
    //   gameboy.channel2currentSampleRight,
    //   gameboy.channel3currentSampleLeft,
    //   gameboy.channel3currentSampleRight,
    //   gameboy.channel4currentSampleLeft,
    //   gameboy.channel4currentSampleRight,
    //   gameboy.channel1currentSampleLeftSecondary,
    //   gameboy.channel1currentSampleRightSecondary,
    //   gameboy.channel2currentSampleLeftSecondary,
    //   gameboy.channel2currentSampleRightSecondary,
    //   gameboy.channel3currentSampleLeftSecondary,
    //   gameboy.channel3currentSampleRightSecondary,
    //   gameboy.channel4currentSampleLeftSecondary,
    //   gameboy.channel4currentSampleRightSecondary,
    //   gameboy.channel1currentSampleLeftTrimary,
    //   gameboy.channel1currentSampleRightTrimary,
    //   gameboy.channel2currentSampleLeftTrimary,
    //   gameboy.channel2currentSampleRightTrimary,
    //   gameboy.audioController.mixerOutputCache,
    //   gameboy.audioController.channel1DutyTracker,
    //   gameboy.audioController.channel1CachedDuty,
    //   gameboy.audioController.channel2DutyTracker,
    //   gameboy.audioController.channel2CachedDuty,
    //   gameboy.audioController.channel1Enabled,
    //   gameboy.audioController.channel2Enabled,
    //   gameboy.audioController.channel3Enabled,
    //   gameboy.audioController.channel4Enabled,
    //   gameboy.audioController.sequencerClocks,
    //   gameboy.audioController.sequencePosition,
    //   gameboy.channel3Counter,
    //   gameboy.audioController.channel4Counter,
    //   gameboy.audioController.cachedChannel3Sample,
    //   gameboy.audioController.cachedChannel4Sample,
    //   gameboy.channel3FrequencyPeriod,
    //   gameboy.channel3lastSampleLookup,
    //   gameboy.actualScanLine,
    //   gameboy.lastUnrenderedLine,
    //   gameboy.queuedScanLines,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.RTCisLatched,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.latchedSeconds,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.latchedMinutes,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.latchedHours,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.latchedLDays,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.latchedHDays,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.RTCSeconds,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.RTCMinutes,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.RTCHours,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.RTCDays,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.RTCDayOverFlow,
    //   gameboy.cartridge.hasRTC &&
    //   gameboy.cartridge.mbc3.rtc.RTCHALT,
    //   gameboy.usedBootROM,
    //   gameboy.skipPCIncrement,
    //   gameboy.STATTracker,
    //   gameboy.gbcRamBankPositionECHO,
    //   gameboy.windowY,
    //   gameboy.windowX,
    //   fromTypedArray(gameboy.gbcOBJRawPalette),
    //   fromTypedArray(gameboy.gbcBGRawPalette),
    //   fromTypedArray(gameboy.gbOBJPalette),
    //   fromTypedArray(gameboy.gbBGPalette),
    //   fromTypedArray(gameboy.gbcOBJPalette),
    //   fromTypedArray(gameboy.gbcBGPalette),
    //   fromTypedArray(gameboy.gbBGColorizedPalette),
    //   fromTypedArray(gameboy.gbOBJColorizedPalette),
    //   fromTypedArray(gameboy.cachedBGPaletteConversion),
    //   fromTypedArray(gameboy.cachedOBJPaletteConversion),
    //   fromTypedArray(gameboy.BGCHRBank1),
    //   fromTypedArray(gameboy.BGCHRBank2),
    //   gameboy.haltPostClocks,
    //   gameboy.interruptRequestedFlags,
    //   gameboy.interruptEnabledFlags,
    //   gameboy.remainingClocks,
    //   gameboy.colorizedGBPalettes,
    //   gameboy.backgroundY,
    //   gameboy.backgroundX,
    //   gameboy.cpu.stopped,
    //   gameboy.audioController.audioClocksUntilNextEvent,
    //   gameboy.audioController.audioClocksUntilNextEventCounter
    // ];
  }

  load(state) {
    let index = 0;
    const gameboy = this.gameboy;

  }

  loadOld(state) {
    let index = 0;
    const gameboy = this.gameboy;

    gameboy.isBootingRom = state[index++];
    gameboy.registerA = state[index++];
    gameboy.FZero = state[index++];
    gameboy.FSubtract = state[index++];
    gameboy.FHalfCarry = state[index++];
    gameboy.FCarry = state[index++];
    gameboy.registerB = state[index++];
    gameboy.registerC = state[index++];
    gameboy.registerD = state[index++];
    gameboy.registerE = state[index++];
    gameboy.registersHL = state[index++];
    gameboy.stackPointer = state[index++];
    gameboy.programCounter = state[index++];
    gameboy.halt = state[index++];
    gameboy.IME = state[index++];
    gameboy.hdmaRunning = state[index++];
    gameboy.currentInstructionCycleCount = state[index++];
    gameboy.doubleSpeedShifter = state[index++];
    gameboy.memory = toTypedArray(state[index++], "uint8");
    gameboy.VRAM = toTypedArray(state[index++], "uint8");
    gameboy.currVRAMBank = state[index++];
    gameboy.GBCMemory = toTypedArray(state[index++], "uint8");
    gameboy.gbcRamBank = state[index++];
    gameboy.gbcRamBankPosition = state[index++];
    gameboy.ROMBank1Offset = state[index++];
    if (gameboy.cartridge?.mbc) {
      gameboy.cartridge.mbc.currentRomBank = state[index++];
    } else {
      index++;
    }
    gameboy.modeSTAT = state[index++];
    gameboy.LYCMatchTriggerSTAT = state[index++];
    gameboy.mode2TriggerSTAT = state[index++];
    gameboy.mode1TriggerSTAT = state[index++];
    gameboy.mode0TriggerSTAT = state[index++];
    gameboy.gpu.lcdEnabled = state[index++];
    gameboy.gfxWindowCHRBankPosition = state[index++];
    gameboy.gfxWindowDisplay = state[index++];
    gameboy.gfxSpriteShow = state[index++];
    gameboy.gfxSpriteNormalHeight = state[index++];
    gameboy.gfxBackgroundCHRBankPosition = state[index++];
    gameboy.gfxBackgroundBankOffset = state[index++];
    gameboy.TIMAEnabled = state[index++];
    gameboy.DIVTicks = state[index++];
    gameboy.LCDTicks = state[index++];
    gameboy.timerTicks = state[index++];
    gameboy.TACClocker = state[index++];
    gameboy.serialTimer = state[index++];
    gameboy.serialShiftTimer = state[index++];
    gameboy.serialShiftTimerAllocated = state[index++];
    gameboy.IRQEnableDelay = state[index++];
    if (gameboy.cartridge?.hasRTC) {
      gameboy.cartridge.mbc3.rtc.lastTime = state[index++];
    } else {
      index++;
    }
    gameboy.drewBlank = state[index++];
    gameboy.frameBuffer = toTypedArray(state[index++], "int32");
    gameboy.backgroundEnabled = state[index++];
    gameboy.audioController.channel1.frequencyTracker = state[index++];
    gameboy.audioController.channel1.frequencyCounter = state[index++];
    gameboy.audioController.channel1.totalLength = state[index++];
    gameboy.audioController.channel1.envelopeVolume = state[index++];
    gameboy.audioController.channel1.envelopeType = state[index++];
    gameboy.audioController.channel1.envelopeSweeps = state[index++];
    gameboy.audioController.channel1.envelopeSweepsLast = state[index++];
    gameboy.audioController.channel1.consecutive = state[index++];
    gameboy.audioController.channel1.frequency = state[index++];
    gameboy.audioController.channel1.sweepFault = state[index++];
    gameboy.audioController.channel1.shadowFrequency = state[index++];
    gameboy.audioController.channel1.timeSweep = state[index++];
    gameboy.audioController.channel1.lastTimeSweep = state[index++];
    gameboy.audioController.channel1.swept = state[index++];
    gameboy.audioController.channel1.frequencySweepDivider = state[index++];
    gameboy.audioController.channel1.decreaseSweep = state[index++];
    gameboy.audioController.channel2FrequencyTracker = state[index++];
    gameboy.audioController.channel2FrequencyCounter = state[index++];
    gameboy.audioController.channel2TotalLength = state[index++];
    gameboy.audioController.channel2EnvelopeVolume = state[index++];
    gameboy.audioController.channel2EnvelopeType = state[index++];
    gameboy.audioController.channel2EnvelopeSweeps = state[index++];
    gameboy.audioController.channel2EnvelopeSweepsLast = state[index++];
    gameboy.audioController.channel2Consecutive = state[index++];
    gameboy.audioController.channel2Frequency = state[index++];
    gameboy.audioController.channel3CanPlay = state[index++];
    gameboy.audioController.channel3TotalLength = state[index++];
    gameboy.audioController.channel3PatternType = state[index++];
    gameboy.audioController.channel3frequency = state[index++];
    gameboy.audioController.channel3Consecutive = state[index++];
    gameboy.audioController.channel3PCM = toTypedArray(state[index++], "int8");
    gameboy.audioController.channel4FrequencyPeriod = state[index++];
    gameboy.audioController.channel4LastSampleLookup = state[index++];
    gameboy.audioController.channel4TotalLength = state[index++];
    gameboy.audioController.channel4EnvelopeVolume = state[index++];
    gameboy.audioController.channel4CurrentVolume = state[index++];
    gameboy.audioController.channel4EnvelopeType = state[index++];
    gameboy.audioController.channel4EnvelopeSweeps = state[index++];
    gameboy.audioController.channel4EnvelopeSweepsLast = state[index++];
    gameboy.audioController.channel4Consecutive = state[index++];
    gameboy.audioController.channel4BitRange = state[index++];
    gameboy.audioController.enabled = state[index++];
    gameboy.audioController.cartridgeLeftChannelInputVolume = state[index++];
    gameboy.audioController.cartridgeRightChannelInputVolume = state[index++];
    gameboy.audioController.channel1.leftChannelEnabled = state[index++];
    gameboy.audioController.leftChannel2 = state[index++];
    gameboy.audioController.leftChannel3 = state[index++];
    gameboy.audioController.leftChannel4 = state[index++];
    gameboy.audioController.channel1.rightChannelEnabled = state[index++];
    gameboy.audioController.rightChannel2 = state[index++];
    gameboy.audioController.rightChannel3 = state[index++];
    gameboy.audioController.rightChannel4 = state[index++];
    gameboy.audioController.channel1.currentSampleLeft = state[index++];
    gameboy.audioController.channel1.currentSampleRight = state[index++];
    gameboy.audioController.channel2CurrentSampleLeft = state[index++];
    gameboy.audioController.channel2CurrentSampleRight = state[index++];
    gameboy.audioController.channel3CurrentSampleLeft = state[index++];
    gameboy.audioController.channel3CurrentSampleRight = state[index++];
    gameboy.audioController.channel4CurrentSampleLeft = state[index++];
    gameboy.audioController.channel4CurrentSampleRight = state[index++];
    gameboy.audioController.channel1.currentSampleLeftSecondary = state[index++];
    gameboy.audioController.channel1.currentSampleRightSecondary = state[index++];
    gameboy.audioController.channel2CurrentSampleLeftSecondary = state[index++];
    gameboy.audioController.channel2CurrentSampleRightSecondary = state[index++];
    gameboy.audioController.channel3CurrentSampleLeftSecondary = state[index++];
    gameboy.audioController.channel3CurrentSampleRightSecondary = state[index++];
    gameboy.audioController.channel4CurrentSampleLeftSecondary = state[index++];
    gameboy.audioController.channel4CurrentSampleRightSecondary = state[index++];
    gameboy.audioController.channel1.currentSampleLeftTrimary = state[index++];
    gameboy.audioController.channel1.currentSampleRightTrimary = state[index++];
    gameboy.audioController.channel2CurrentSampleLeftTrimary = state[index++];
    gameboy.audioController.channel2CurrentSampleRightTrimary = state[index++];
    gameboy.audioController.mixerOutputCache = state[index++];
    gameboy.audioController.channel1.dutyTracker = state[index++];
    gameboy.audioController.channel1.cachedDuty = state[index++];
    gameboy.audioController.channel2DutyTracker = state[index++];
    gameboy.audioController.channel2CachedDuty = state[index++];
    gameboy.audioController.channel1.enabled = state[index++];
    gameboy.audioController.channel2Enabled = state[index++];
    gameboy.audioController.channel3Enabled = state[index++];
    gameboy.audioController.channel4Enabled = state[index++];
    gameboy.audioController.sequencerClocks = state[index++];
    gameboy.audioController.sequencePosition = state[index++];
    gameboy.audioController.channel3Counter = state[index++];
    gameboy.audioController.channel4Counter = state[index++];
    gameboy.audioController.cachedChannel3Sample = state[index++];
    gameboy.audioController.cachedChannel4Sample = state[index++];
    gameboy.audioController.channel3FrequencyPeriod = state[index++];
    gameboy.audioController.channel3LastSampleLookup = state[index++];
    gameboy.actualScanLine = state[index++];
    gameboy.lastUnrenderedLine = state[index++];
    gameboy.queuedScanLines = state[index++];
    if (gameboy.cartridge?.hasRTC) {
      gameboy.cartridge.mbc3.rtc.RTCisLatched = state[index++];
      gameboy.cartridge.mbc3.rtc.latchedSeconds = state[index++];
      gameboy.cartridge.mbc3.rtc.latchedMinutes = state[index++];
      gameboy.cartridge.mbc3.rtc.latchedHours = state[index++];
      gameboy.cartridge.mbc3.rtc.latchedLDays = state[index++];
      gameboy.cartridge.mbc3.rtc.latchedHDays = state[index++];
      gameboy.cartridge.mbc3.rtc.RTCSeconds = state[index++];
      gameboy.cartridge.mbc3.rtc.RTCMinutes = state[index++];
      gameboy.cartridge.mbc3.rtc.RTCHours = state[index++];
      gameboy.cartridge.mbc3.rtc.RTCDays = state[index++];
      gameboy.cartridge.mbc3.rtc.RTCDayOverFlow = state[index++];
      gameboy.cartridge.mbc3.rtc.RTCHalt = state[index++];
    } else {
      index += 12;
    }
    gameboy.usedBootRom = state[index++];
    gameboy.skipPCIncrement = state[index++];
    gameboy.STATTracker = state[index++];
    gameboy.gbcRamBankPositionECHO = state[index++];
    gameboy.windowY = state[index++];
    gameboy.windowX = state[index++];
    gameboy.gbcOBJRawPalette = toTypedArray(state[index++], "uint8");
    gameboy.gbcBGRawPalette = toTypedArray(state[index++], "uint8");
    gameboy.gbOBJPalette = toTypedArray(state[index++], "int32");
    gameboy.gbBGPalette = toTypedArray(state[index++], "int32");
    gameboy.gbcOBJPalette = toTypedArray(state[index++], "int32");
    gameboy.gbcBGPalette = toTypedArray(state[index++], "int32");
    gameboy.gbBGColorizedPalette = toTypedArray(state[index++], "int32");
    gameboy.gbOBJColorizedPalette = toTypedArray(state[index++], "int32");
    gameboy.cachedBGPaletteConversion = toTypedArray(
      state[index++],
      "int32"
    );
    gameboy.cachedOBJPaletteConversion = toTypedArray(
      state[index++],
      "int32"
    );
    gameboy.BGCHRBank1 = toTypedArray(state[index++], "uint8");
    gameboy.BGCHRBank2 = toTypedArray(state[index++], "uint8");
    gameboy.haltPostClocks = state[index++];
    gameboy.interruptRequestedFlags = state[index++];
    gameboy.interruptEnabledFlags = state[index++];
    gameboy.checkIRQMatching();
    gameboy.remainingClocks = state[index++];
    gameboy.colorizedGBPalettes = state[index++];
    gameboy.backgroundY = state[index++];
    gameboy.backgroundX = state[index++];
    gameboy.cpu.stopped = state[index++];
    gameboy.audioController.audioClocksUntilNextEvent = state[index++];
    gameboy.audioController.audioClocksUntilNextEventCounter = state[index];
  }
}
