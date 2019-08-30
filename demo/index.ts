import keyMap from "./keyMap";
import { GameBoy, util } from "../src";
import * as MemoryLayout from "../src/core/memory/Layout";

window.addEventListener("load", () => {
  const overlay = document.querySelector<HTMLDivElement>(".overlay");
  const overlayTitle = overlay.querySelector<HTMLHeadingElement>("h1");
  overlayTitle.textContent = "Click to start";

  const onInteract = () => {
    overlay.style.display = "none";
    window.removeEventListener("click", onInteract);
    init();
  };

  window.addEventListener("click", onInteract);
});

const init = () => {
  const canvas1 = document.querySelector(".lcd1");
  const canvas2 = document.querySelector(".lcd2");

  const gameboy1 = new GameBoy({
    lcd: { canvas: canvas1 }
  });

  const gameboy2 = new GameBoy({
    lcd: { canvas: canvas2 }
  });

  (window as any).gameboy1 = gameboy1;
  (window as any).gameboy2 = gameboy2;

  gameboy1.on("serialData", data => {
    console.log("send", data);
    const response = gameboy2.transferSerial(data);
    console.log("retrieve", response);
    gameboy1.core.memoryWrite(MemoryLayout.SERIAL_DATA_REG, response);
  });

  let activeGameboy = gameboy1;
  let both = false;

  window.addEventListener("keydown", ({ keyCode }) => {
    if (keyMap[keyCode]) {
      if (both) {
        gameboy1.actionDown(keyMap[keyCode]);
        gameboy2.actionDown(keyMap[keyCode]);
      } else activeGameboy.actionDown(keyMap[keyCode]);
    }
  });
  window.addEventListener("keyup", ({ keyCode }) => {
    if (keyMap[keyCode]) {
      if (both) {
        gameboy1.actionUp(keyMap[keyCode]);
        gameboy2.actionUp(keyMap[keyCode]);
      } else activeGameboy.actionUp(keyMap[keyCode]);
    }
  });

  const selectRomElement = document.querySelector<HTMLInputElement>(".rom-select");
  selectRomElement.addEventListener("change", async () => {
    const file = selectRomElement.files[0];
    if (!file) return;

    const rom = await util.readCartridgeROM(file, file.name);
    if (rom) {
      if (both) {
        gameboy1.replaceCartridge(rom);
        gameboy2.replaceCartridge(rom);
      } else activeGameboy.replaceCartridge(rom);
    }

    selectRomElement.value = "";
  });

  document
    .querySelector(".download-battery-file-text")
    .addEventListener("click", () => {
      if (both) {
        util.saveAs(gameboy1.getBatteryFileArrayBuffer(), gameboy1.core.cartridge.name + ".sav");
        util.saveAs(gameboy2.getBatteryFileArrayBuffer(), gameboy2.core.cartridge.name + ".sav");
      } else util.saveAs(activeGameboy.getBatteryFileArrayBuffer(), activeGameboy.core.cartridge.name + ".sav");
    });

  const uploadBatteryFileElement = document.querySelector<HTMLInputElement>(".upload-battery-file");
  uploadBatteryFileElement.addEventListener("change", async () => {
    const file = uploadBatteryFileElement.files[0];
    if (!file) return;

    const battery = await util.readBlob(file);

    if (both) {
      await gameboy1.loadBatteryFileArrayBuffer(battery);
      await gameboy2.loadBatteryFileArrayBuffer(battery);
    } else await activeGameboy.loadBatteryFileArrayBuffer(battery);

    uploadBatteryFileElement.value = "";
  });

  const switchGameboy = document.querySelector<HTMLInputElement>(".switch-gameboy");
  switchGameboy.addEventListener("change", () => {
    switch (switchGameboy.value) {
      case "gameboy1":
        activeGameboy = gameboy1;
        both = false;
        break;
      case "gameboy2":
        activeGameboy = gameboy2;
        both = false;
        break;
      case "both":
        both = true;
        break;
    }
  });
};