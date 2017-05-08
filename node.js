const { GameBoy } = require("./dist/jsgbc-core.min");
const Canvas = require("canvas");
const fs = require("fs");

const canvas = new Canvas();
const gameboy = new GameBoy({
  lcd: {
    canvas,
    offscreenCanvas: new Canvas()
  },
  isSoundEnabled: false // required for now
});

const buffer = fs.readFileSync("rom.gbc");
gameboy.replaceCartridge(buffer);

setTimeout(() => {
  const data = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync("lcd.png", data, "base64");
}, 20 * 1000);
