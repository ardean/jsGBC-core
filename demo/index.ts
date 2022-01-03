import { GameBoy, util } from "../src";

const keyMap = {
  "Enter": "Start",
  "Shift": "Select",
  "ArrowUp": "Up",
  "w": "Up",
  "ArrowRight": "Right",
  "d": "Right",
  "ArrowDown": "Down",
  "s": "Down",
  "ArrowLeft": "Left",
  "a": "Left",
  "l": "A",
  "v": "A",
  "x": "B",
  "k": "B",
  "1": "Save",
  "0": "Load",
  "p": "Speed"
};

const canvas = document.querySelector(".lcd");

const gameboy = new GameBoy({
  lcd: { canvas }
});

(window as any).gameboy = gameboy;

window.addEventListener("keydown", ({ key }) => {
  if (keyMap[key]) {
    gameboy.actionDown(keyMap[key]);
  }
});
window.addEventListener("keyup", ({ key }) => {
  if (keyMap[key]) {
    gameboy.actionUp(keyMap[key]);
  }
});

const selectGbcBootRomElement = document.querySelector<HTMLInputElement>(".gbc-boot-rom-select");
selectGbcBootRomElement.addEventListener("change", async () => {
  const file = selectGbcBootRomElement.files[0];
  if (!file) return;

  const rom = await util.readFirstMatchingExtension(file, file.name, ["bin"]);
  if (!rom) return;

  gameboy.setGbcBootRom(rom);
});

const selectGbBootRomElement = document.querySelector<HTMLInputElement>(".gb-boot-rom-select");
selectGbBootRomElement.addEventListener("change", async () => {
  const file = selectGbBootRomElement.files[0];
  if (!file) return;

  const rom = await util.readFirstMatchingExtension(file, file.name, ["bin"]);
  if (!rom) return;

  gameboy.setGbBootRom(rom);
});

const selectRomElement = document.querySelector<HTMLInputElement>(".rom-select");
selectRomElement.addEventListener("change", async () => {
  const file = selectRomElement.files[0];
  if (!file) return;

  const rom = await util.readFirstMatchingExtension(file, file.name, ["gbc", "gb"]);
  if (!rom) return;

  gameboy.replaceCartridge(rom);
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