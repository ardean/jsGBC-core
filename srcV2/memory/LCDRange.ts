import Range from "./Range";
import * as util from "../util";
import * as addresses from "./addresses";
import { GRAY_SHADES } from "../graphics/colors";

export type Mode = 0 | 1 | 2 | 3;

export default class LCDRange extends Range {
  backgroundEnabled: boolean = false;
  spritesEnabled: boolean = false;
  spritesLargeHeight: boolean = false;
  backgroundMapIndex: number = 0;
  bankOffset: number = 0;
  windowEnabled: boolean = false;
  windowBankPosition: number = 0;
  enabled: boolean = false;

  mode: Mode = 0;
  interruptMode00: boolean = false;
  interruptMode01: boolean = false;
  interruptMode10: boolean = false;
  coincidence: boolean = false;

  yLine: number = 0;
  yLineCompare: number = 0;

  backgroundY: number = 0;
  backgroundX: number = 0;
  backgroundPalette: number[][];

  read(address: number) {
    const absoluteAddress = this.start + address;

    if (absoluteAddress === addresses.LCD_Y_LINE) {
      return this.readYLine();
    } else if (absoluteAddress === addresses.LCD_Y_LINE_COMPARE) {
      return this.readYLineCompare();
    } else if (absoluteAddress === addresses.LCD_BACKGROUND_Y) {
      return this.readBackgroundY();
    } else console.log(`reading LCD range! ${util.formatHex(absoluteAddress)} => ${util.formatHex(super.read(address))}`);
  }

  readYLine() {
    return this.yLine;
  }

  readYLineCompare() {
    return this.yLineCompare;
  }

  readBackgroundY() {
    return this.backgroundY;
  }

  write(address: number, value: number) {
    const absoluteAddress = this.start + address;

    if (absoluteAddress === addresses.LCD_CONTROL) {
      this.writeControl(value);
    } else if (absoluteAddress === addresses.LCD_STATUS) {
      this.writeStatus(address, value);
    } else if (absoluteAddress === addresses.LCD_Y_LINE) {
      this.clearYLine();
    } else if (absoluteAddress === addresses.LCD_Y_LINE_COMPARE) {
      this.writeYLineCompare(value);
    } else if (absoluteAddress === addresses.LCD_BACKGROUND_Y) {
      this.writeBackgroundY(value);
    } else if (absoluteAddress === addresses.LCD_BACKGROUND_X) {
      this.writeBackgroundX(value);
    } else if (absoluteAddress === addresses.LCD_BACKGROUND_COLORS) {
      this.writeBackgroundColors(address, value);
    } else console.log(`unknown write to LCD register ${util.formatHex(value)} => ${util.formatHex(address)}`);
  }

  writeControl(value: number) {
    this.backgroundEnabled = (value & 1) === 1;
    this.spritesEnabled = ((value >> 1) & 1) === 1;
    this.spritesLargeHeight = ((value >> 2) & 1) === 1;
    this.backgroundMapIndex = (value >> 3) & 1;
    this.bankOffset = (value >> 4) & 1;
    this.windowEnabled = ((value >> 5) & 1) === 1;
    this.windowBankPosition = ((value >> 6) & 1) === 1 ? 0x400 : 0;

    const enabled = (value >> 7) === 1;
    if (enabled !== this.enabled) {
      this.enabled = enabled;
      console.log(`set LCD ${enabled ? "ON" : "OFF"}!`);
    }
  }

  writeStatus(address: number, value: number) {
    this.mode = (value & 0b11) as Mode;

    this.interruptMode00 = ((value >> 3) & 1) === 1;
    this.interruptMode01 = ((value >> 4) & 1) === 1;
    this.interruptMode10 = ((value >> 5) & 1) === 1;

    this.coincidence = ((value >> 6) & 1) === 1;

    super.write(address, value);
  }

  clearYLine() {
    this.yLine = 0;
  }

  writeYLineCompare(value: number) {
    this.yLineCompare = value;
  }

  writeBackgroundY(value: number) {
    if (this.backgroundY !== value) {
      this.backgroundY = value;
    }
  }

  writeBackgroundX(value: number) {
    if (this.backgroundX !== value) {
      this.backgroundX = value;
    }
  }

  writeBackgroundColors(address: number, value: number) {
    if (super.read(address) !== value) {
      this.backgroundPalette = this.createPalette(value);

      super.write(address, value);
    }
  }



  createPalette(palette: number) {
    return [
      GRAY_SHADES[palette & 3],
      GRAY_SHADES[palette >> 2 & 3],
      GRAY_SHADES[palette >> 4 & 3],
      GRAY_SHADES[palette >> 6 & 3]
    ];
  }
}