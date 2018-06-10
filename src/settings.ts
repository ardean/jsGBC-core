export default {
  soundOn: true, // Turn on sound.
  bootBootRomFirst: true, // Boot with boot ROM first?
  gbHasPriority: false, // Give priority to GameBoy mode
  soundVolume: 0.7, // Volume level set.
  colorizeGBMode: true, // Colorize GB mode?
  runInterval: 8, // Interval for the emulator loop.
  minAudioBufferSpanAmountOverXInterpreterIterations: 10, // Audio buffer minimum span amount over x interpreter iterations.
  maxAudioBufferSpanAmountOverXInterpreterIterations: 20, // Audio buffer maximum span amount over x interpreter iterations.
  alwaysAllowRWtoBanks: false, // Override MBC RAM disabling and always allow reading and writing to the banks.
  forceGBBootRom: false, // Use the GameBoy boot ROM instead of the GameBoy Color boot ROM.
  // User controlled channel enables.
  enabledChannels: [true, true, true, true]
};
