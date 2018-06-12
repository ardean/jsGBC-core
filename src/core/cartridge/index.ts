import settings from "../../settings";
import ROM from "../ROM";
import MBC from "./mbc";
import MBC1 from "./mbc1";
import MBC2 from "./mbc2";
import MBC3 from "./mbc3";
import MBC5 from "./mbc5";
import MBC7 from "./mbc7";
import RUMBLE from "./RUMBLE";
import GameBoyCore from "../GameBoyCore";

const GAME_AND_WATCH_ID = "Game and Watch 50";

export default class Cartridge {
  hasMBC1: boolean = false; // does the cartridge use MBC1?
  hasMBC2: boolean = false; // does the cartridge use MBC2?
  hasMBC3: boolean = false; // does the cartridge use MBC3?
  hasMBC5: boolean = false; // does the cartridge use MBC5?
  hasMBC7: boolean = false; // does the cartridge use MBC7?
  hasSRAM: boolean = false; // does the cartridge use save RAM?
  hasRUMBLE: boolean = false; // does the cartridge have Rumble addressing? (modified MBC5)
  hasCamera: boolean = false; // is the cartridge a GameBoy Camera?
  hasTAMA5: boolean = false; // does the cartridge use TAMA5? (Tamagotchi Cartridge)
  hasHuC3: boolean = false; // does the cartridge use HuC3? (Hudson Soft / modified MBC3)
  hasHuC1: boolean = false; // does the cartridge use HuC1 (Hudson Soft / modified MBC1)?
  hasMMMO1: boolean = false;
  hasRTC: boolean = false; // does the cartridge have a RTC?
  hasBattery: boolean = false;

  gameboy: GameBoyCore;
  rom: ROM;
  useGBCMode: boolean;

  name: string;
  gameCode: string;
  colorCompatibilityByte: number;
  type: number;
  typeName: string;
  romSizeType: number;
  ramSizeType: number;
  hasNewLicenseCode: boolean;
  licenseCode: number;

  mbc: MBC;
  mbc1: MBC1;
  mbc2: MBC2;
  mbc3: MBC3;
  mbc5: MBC5;
  mbc7: MBC7;
  rumble: RUMBLE;

  constructor(rom: ROM | Uint8Array | ArrayBuffer) {
    this.rom = rom instanceof ROM ? rom : new ROM(rom);
  }

  connect(gameboy: GameBoyCore) {
    this.gameboy = gameboy;
  }

  interpret() {
    this.name = this.rom.getString(0x134, 0x13e);
    this.gameCode = this.rom.getString(0x13f, 0x142);
    this.colorCompatibilityByte = this.rom.getByte(0x143);
    this.type = this.rom.getByte(0x147);
    this.setTypeName();

    if (this.name) {
      console.log("Game Title: " + this.name);
    }
    if (this.gameCode) {
      console.log("Game Code: " + this.gameCode);
    }
    if (this.colorCompatibilityByte) {
      console.log("Color Compatibility Byte: " + this.colorCompatibilityByte);
    }
    if (this.type) {
      console.log("Cartridge Type: " + this.type);
    }
    if (this.typeName) {
      console.log("Cartridge Type Name: " + this.typeName);
    }

    this.romSizeType = this.rom.getByte(0x148);
    this.ramSizeType = this.rom.getByte(0x149);

    // Check the GB/GBC mode byte:
    if (!this.gameboy.usedBootROM) {
      switch (this.colorCompatibilityByte) {
        case 0x00: // GB only
          this.useGBCMode = false;
          break;
        case 0x32: // Exception to the GBC identifying code:
          if (!settings.gbHasPriority && this.name + this.gameCode + this.colorCompatibilityByte === GAME_AND_WATCH_ID) {
            this.useGBCMode = true;
            console.log("Created a boot exception for Game and Watch Gallery 2 (GBC ID byte is wrong on the cartridge).");
          } else {
            this.useGBCMode = false;
          }
          break;
        case 0x80: //Both GB + GBC modes
          this.useGBCMode = !settings.gbHasPriority;
          break;
        case 0xc0: //Only GBC mode
          this.useGBCMode = true;
          break;
        default:
          this.useGBCMode = false;
          console.warn("Unknown GameBoy game type code #" + this.colorCompatibilityByte + ", defaulting to GB mode (Old games don't have a type code).");
      }
    } else {
      console.log("used boot rom");
      this.useGBCMode = this.gameboy.usedGBCBootROM; // Allow the GBC boot ROM to run in GBC mode...
    }

    const oldLicenseCode = this.rom.getByte(0x14b);
    const newLicenseCode = this.rom.getByte(0x144) & 0xff00 | this.rom.getByte(0x145) & 0xff;
    if (oldLicenseCode !== 0x33) {
      this.hasNewLicenseCode = false;
      this.licenseCode = oldLicenseCode;
    } else {
      this.hasNewLicenseCode = true;
      this.licenseCode = newLicenseCode;
    }
  }

  setGBCMode(data) {
    this.useGBCMode = (data & 0x1) === 0;
    // Exception to the GBC identifying code:
    if (this.name + this.gameCode + this.colorCompatibilityByte === GAME_AND_WATCH_ID) {
      this.useGBCMode = true;
      console.log("Created a boot exception for Game and Watch Gallery 2 (GBC ID byte is wrong on the cartridge).");
    }
    console.log("Booted to GBC Mode: " + this.useGBCMode);
  }

  setTypeName() {
    switch (this.type) {
      case 0x00:
        this.typeName = "ROM";
        break;
      case 0x01:
        this.hasMBC1 = true;
        this.typeName = "MBC1";
        break;
      case 0x02:
        this.hasMBC1 = true;
        this.hasSRAM = true;
        this.typeName = "MBC1 + SRAM";
        break;
      case 0x03:
        this.hasMBC1 = true;
        this.hasSRAM = true;
        this.hasBattery = true;
        this.typeName = "MBC1 + SRAM + Battery";
        break;
      case 0x05:
        this.hasMBC2 = true;
        this.typeName = "MBC2";
        break;
      case 0x06:
        this.hasMBC2 = true;
        this.hasBattery = true;
        this.typeName = "MBC2 + Battery";
        break;
      case 0x08:
        this.hasSRAM = true;
        this.typeName = "ROM + SRAM";
        break;
      case 0x09:
        this.hasSRAM = true;
        this.hasBattery = true;
        this.typeName = "ROM + SRAM + Battery";
        break;
      case 0x0b:
        this.hasMMMO1 = true;
        this.typeName = "MMMO1";
        break;
      case 0x0c:
        this.hasMMMO1 = true;
        this.hasSRAM = true;
        this.typeName = "MMMO1 + SRAM";
        break;
      case 0x0d:
        this.hasMMMO1 = true;
        this.hasSRAM = true;
        this.hasBattery = true;
        this.typeName = "MMMO1 + SRAM + Battery";
        break;
      case 0x0f:
        this.hasMBC3 = true;
        this.hasRTC = true;
        this.hasBattery = true;
        this.typeName = "MBC3 + RTC + Battery";
        break;
      case 0x10:
        this.hasMBC3 = true;
        this.hasRTC = true;
        this.hasBattery = true;
        this.hasSRAM = true;
        this.typeName = "MBC3 + RTC + Battery + SRAM";
        break;
      case 0x11:
        this.hasMBC3 = true;
        this.typeName = "MBC3";
        break;
      case 0x12:
        this.hasMBC3 = true;
        this.hasSRAM = true;
        this.typeName = "MBC3 + SRAM";
        break;
      case 0x13:
        this.hasMBC3 = true;
        this.hasSRAM = true;
        this.hasBattery = true;
        this.typeName = "MBC3 + SRAM + Battery";
        break;
      case 0x19:
        this.hasMBC5 = true;
        this.typeName = "MBC5";
        break;
      case 0x1a:
        this.hasMBC5 = true;
        this.hasSRAM = true;
        this.typeName = "MBC5 + SRAM";
        break;
      case 0x1b:
        this.hasMBC5 = true;
        this.hasSRAM = true;
        this.hasBattery = true;
        this.typeName = "MBC5 + SRAM + Battery";
        break;
      case 0x1c:
        this.hasRUMBLE = true;
        this.typeName = "RUMBLE";
        break;
      case 0x1d:
        this.hasRUMBLE = true;
        this.hasSRAM = true;
        this.typeName = "RUMBLE + SRAM";
        break;
      case 0x1e:
        this.hasRUMBLE = true;
        this.hasSRAM = true;
        this.hasBattery = true;
        this.typeName = "RUMBLE + SRAM + Battery";
        break;
      case 0x1f:
        this.hasCamera = true;
        this.typeName = "GameBoy Camera";
        break;
      case 0x22:
        this.hasMBC7 = true;
        this.hasSRAM = true;
        this.hasBattery = true;
        this.typeName = "MBC7 + SRAM + Battery";
        break;
      case 0xfd:
        this.hasTAMA5 = true;
        this.typeName = "TAMA5";
        break;
      case 0xfe:
        this.hasHuC3 = true;
        this.typeName = "HuC3";
        break;
      case 0xff:
        this.hasHuC1 = true;
        this.typeName = "HuC1";
        break;
      default:
        throw new Error("Unknown Cartridge Type");
    }

    if (this.hasMBC1) this.mbc1 = new MBC1(this);
    if (this.hasMBC2) this.mbc2 = new MBC2(this);
    if (this.hasMBC3) this.mbc3 = new MBC3(this);
    if (this.hasMBC5) this.mbc5 = new MBC5(this);
    if (this.hasMBC7) this.mbc7 = new MBC7(this);
    if (this.hasRUMBLE) this.mbc5 = this.rumble = new RUMBLE(this);

    this.mbc =
      this.mbc1 ||
      this.mbc2 ||
      this.mbc3 ||
      this.mbc5 ||
      this.mbc7 ||
      this.rumble ||
      null;
  }

  setupRAM() {
    if (this.mbc) this.mbc.setupRAM();

    this.gameboy.api.loadSRAM();
    this.gameboy.api.loadRTC();
  }
}
