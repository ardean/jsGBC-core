const { GameBoy } = require("./dist/jsgbc-core.min");
const Canvas = require("canvas");
const fs = require("fs");
const AudioContext = require("web-audio-api/lib/AudioContext.js");
const Speaker = require("speaker");

const audioContext = new AudioContext();

audioContext.outStream = new Speaker({
  channels: audioContext.format.numberOfChannels,
  bitDepth: audioContext.format.bitDepth,
  sampleRate: audioContext.sampleRate
});

const canvas = new Canvas();
const gameboy = new GameBoy({
  audioContext,
  lcd: {
    canvas,
    offscreenCanvas: new Canvas()
  },
  isSoundEnabled: true // required for now
});

const buffer = fs.readFileSync("rom.gbc");
gameboy.replaceCartridge(buffer);

setTimeout(() => {
  const data = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync("lcd.png", data, "base64");
}, 20 * 1000);
