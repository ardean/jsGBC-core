import GameBoyCore from "./GameBoyCore";
import { JOYPAD_REG } from "./memory/Layout";

export default class Joypad {
  initialValue: number = 0xf; // for memory
  value: number = 0xff; // Joypad State (two four-bit states actually)

  constructor(
    private gameboy: GameBoyCore
  ) { }

  down(key: number) {
    this.value &= 0xff ^ 1 << key;
    if (
      this.gameboy.cartridge &&
      !this.gameboy.cartridge.useGbcMode &&
      (!this.gameboy.usedBootRom || !this.gameboy.usedGbcBootRom)
    ) {
      this.gameboy.interruptsRequested |= 0x10; // A real GBC doesn't set this!
      this.gameboy.remainingClocks = 0;
      this.gameboy.checkIRQMatching();
    }

    this.writeMemory(JOYPAD_REG, this.gameboy.memory[JOYPAD_REG]);
  }

  up(key: number) {
    this.value |= 1 << key;
    this.writeMemory(JOYPAD_REG, this.gameboy.memory[JOYPAD_REG]);
  }

  writeMemory = (address: number, data: number) => {
    this.gameboy.memory[address] = (
      (data & 0x30) +
      (
        (
          (data & 0x20) === 0 ?
            this.value >> 4 :
            0xf
        ) &
        (
          (data & 0x10) === 0 ?
            this.value & 0xf :
            0xf
        )
      )
    );

    this.gameboy.cpu.stopped = false;
  };
}
