import GameBoy from "./GameBoy";
import { joypadAddress } from "./memory/Layout";

const initialValue = 0xF;

export default class Joypad {
  value: number = 0xFF;

  constructor(
    private gameboy: GameBoy
  ) { }

  init() {
    this.gameboy.memory[joypadAddress] = initialValue;
  }

  down(key: number) {
    this.value &= 0xff ^ 1 << key;

    if (
      this.gameboy.cartridge &&
      !this.gameboy.cartridge.useGbcMode &&
      (
        !this.gameboy.usedBootRom ||
        !this.gameboy.usedGbcBootRom
      )
    ) {
      this.gameboy.interruptRequestedFlags |= 1 << 4; // A real GBC doesn't set this!
      this.gameboy.remainingClocks = 0;
      this.gameboy.checkIrqMatching();
    }

    this.writeMemory(joypadAddress, this.gameboy.memory[joypadAddress]);

    this.gameboy.cpu.stopped = false;
  }

  up(key: number) {
    this.value |= 1 << key;
    this.writeMemory(joypadAddress, this.gameboy.memory[joypadAddress]);

    this.gameboy.cpu.stopped = false;
  }

  writeMemory = (address: number, data: number) => {
    const switchBits = data & 0b110000;

    const hasDirectionKeys = (data & 0x10) === 0;
    const directionNibble = this.value & 0xF;

    const hasButtonKeys = (data & 0x20) === 0;
    const buttonNibble = (this.value >> 4) & 0xF;

    this.gameboy.memory[address] = (
      switchBits +
      (
        (
          hasButtonKeys ?
            buttonNibble :
            0xF
        ) &
        (
          hasDirectionKeys ?
            directionNibble :
            0xF
        )
      )
    );
  };

  readMemory = () => (
    0b11000000 |
    this.gameboy.memoryNew.readDirectly(joypadAddress)
  );
}
