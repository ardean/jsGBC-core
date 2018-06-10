const { GameBoy } = require("../dist/jsgbc-core");
const Canvas = require("canvas");
const fs = require("fs");
const { AudioContext } = require("web-audio-api");
const Speaker = require("speaker");

const context = new AudioContext();

context.outStream = new Speaker({
  channels: context.format.numberOfChannels,
  bitDepth: context.format.bitDepth,
  sampleRate: context.sampleRate
});

const canvas = new Canvas();
const gameboy = new GameBoy({
  audio: { context },
  lcd: {
    canvas,
    offscreenCanvas: new Canvas()
  },
  isSoundEnabled: true
});

const buffer = fs.readFileSync("rom.gbc");
gameboy.replaceCartridge(buffer);

// setTimeout(() => {
//   const data = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
//   fs.writeFileSync("lcd.png", data, "base64");
// }, 20 * 1000);
