import * as util from "./util";
import ROM from "../srcV2/memory/ROM";
import GameBoy from "../srcV2/GameBoy";
import * as gameboyUtil from "../srcV2/util";
import Cartridge from "../srcV2/cartridge/Cartridge";

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
  const canvas = document.querySelector<HTMLCanvasElement>(".lcd");
  const gameboy = new GameBoy({
    canvas
  });

  const selectBiosElement = document.querySelector<HTMLInputElement>(".bios-select");
  selectBiosElement.addEventListener("change", async () => {
    const file = selectBiosElement.files[0];
    if (!file) return;

    const buffer = await util.blobToUint8Array(file);
    const bios = new ROM(buffer);
    gameboy.flashBios(bios);
  });

  const selectRomElement = document.querySelector<HTMLInputElement>(".rom-select");
  selectRomElement.addEventListener("change", async () => {
    const file = selectRomElement.files[0];
    if (!file) return;

    const buffer = await util.blobToUint8Array(file);
    const rom = new ROM(buffer);
    const cartridge = new Cartridge(rom);
    gameboy.insertCartridge(cartridge);
  });

  document.querySelector<HTMLButtonElement>(".start-button")
    .addEventListener("click", () => {
      gameboy.turnOn();

      const aRegisterInput = document.querySelector<HTMLInputElement>(".a-register-input");
      aRegisterInput.value = gameboyUtil.formatHex(gameboy.cpu.aRegister);
      gameboy.cpu.on("aRegisterChange", (value: number) => {
        aRegisterInput.value = gameboyUtil.formatHex(value);
      });

      const zeroFlagCheckbox = document.querySelector<HTMLInputElement>(".zero-flag-checkbox");
      zeroFlagCheckbox.checked = gameboy.cpu.zeroFlag;
      gameboy.cpu.on("zeroFlagChange", (value: boolean) => {
        zeroFlagCheckbox.checked = value;
      });
    });
};