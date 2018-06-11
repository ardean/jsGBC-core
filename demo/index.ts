import { GameBoy, util } from "../src";

const keyMap = {
  13: "start",
  16: "select",
  38: "up",
  87: "up",
  39: "right",
  68: "right",
  40: "down",
  83: "down",
  37: "left",
  65: "left",
  76: "a",
  86: "a",
  88: "b",
  75: "b",
  49: "save",
  48: "load",
  80: "speed"
};

const canvas = document.querySelector(".lcd");

const gameboy = new GameBoy({
  lcd: { canvas }
});

(window as any).gameboy = gameboy;

window.addEventListener("keydown", ({ keyCode }) => {
  if (keyMap[keyCode]) {
    gameboy.actionDown(keyMap[keyCode]);
  }
});
window.addEventListener("keyup", ({ keyCode }) => {
  if (keyMap[keyCode]) {
    gameboy.actionUp(keyMap[keyCode]);
  }
});

const selectRomElement = document.querySelector<HTMLInputElement>(".rom-select");
selectRomElement.addEventListener("change", async () => {
  const file = selectRomElement.files[0];
  const rom = await util.readCartridgeROM(file, file.name);
  if (rom) {
    gameboy.replaceCartridge(rom);
  }
});

document
  .querySelector(".download-battery-file-text")
  .addEventListener("click", () => {
    util.saveAs(gameboy.getBatteryFileArrayBuffer(), gameboy.core.cartridge.name + ".sav");
  });

const uploadBatteryFileElement = document.querySelector<HTMLInputElement>(".upload-battery-file");
uploadBatteryFileElement.addEventListener("change", async () => {
  const battery = await util.readBlob(uploadBatteryFileElement.files[0]);
  await gameboy.loadBatteryFileArrayBuffer(battery);
});

document.querySelector<HTMLElement>(".loading").style.display = "none";