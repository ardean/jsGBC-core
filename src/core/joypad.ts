import GameBoyCore from "./GameBoyCore";
import { JOYPAD_REG } from "./memory/Layout";

export default class Joypad {
  initialValue: number = 0xf; // for memory
  value: number = 0xff; // Joypad State (two four-bit states actually)
  gameboy: GameBoyCore;

  constructor(gameboy) {
    this.gameboy = gameboy;
  }

  down(key) {
    this.value &= 0xff ^ 1 << key;
    if (
      this.gameboy.cartridge &&
      !this.gameboy.cartridge.useGBCMode &&
      (!this.gameboy.usedBootROM || !this.gameboy.usedGBCBootROM)
    ) {
      this.gameboy.interruptsRequested |= 0x10; // A real GBC doesn't set this!
      this.gameboy.remainingClocks = 0;
      this.gameboy.checkIRQMatching();
    }

    this.writeToMemory();
  }

  up(key) {
    this.value |= 1 << key;
    this.writeToMemory();
  }

  writeToMemory() {
    const currentValue = this.gameboy.memory[JOYPAD_REG];

    this.gameboy.memory[JOYPAD_REG] = (currentValue & 0x30) + (((currentValue & 0x20) === 0 ? this.value >> 4 : 0xf) & ((currentValue & 0x10) === 0 ? this.value & 0xf : 0xf));
    this.gameboy.CPUStopped = false;
  }
}
