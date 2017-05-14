import settings from "../../settings.js";
import ROM from "../rom.js";
import MBC1 from "./mbc1.js";
import MBC2 from "./mbc2.js";
import MBC3 from "./mbc3.js";
import MBC5 from "./mbc5.js";
import MBC7 from "./mbc7.js";

export default class Cartridge {
  constructor(rom) {
    this.rom = rom instanceof ROM ? rom : new ROM(rom);

    this.hasMBC1 = false; // Does the cartridge use MBC1?
    this.hasMBC2 = false; // Does the cartridge use MBC2?
    this.hasMBC3 = false; // Does the cartridge use MBC3?
    this.hasMBC5 = false; // Does the cartridge use MBC5?
    this.hasMBC7 = false; // Does the cartridge use MBC7?
    this.hasSRAM = false; // Does the cartridge use save RAM?
    this.cMMMO1 = false; // ...
    this.hasBattery = false;
    this.cRUMBLE = false; // Does the cartridge use the RUMBLE addressing (modified MBC5)?
    this.cCamera = false; // Is the cartridge actually a GameBoy Camera?
    this.cTAMA5 = false; // Does the cartridge use TAMA5? (Tamagotchi Cartridge)
    this.cHuC3 = false; // Does the cartridge use HuC3 (Hudson Soft / modified MBC3)?
    this.cHuC1 = false; // Does the cartridge use HuC1 (Hudson Soft / modified MBC1)?
    this.hasRTC = false; // Does the cartridge have an RTC?
  }

  connect(gameboy) {
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
        if (!settings.gbHasPriority && this.name + this.gameCode + this.colorCompatibilityByte === "Game and Watch 50") {
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
    if (this.name + this.gameCode + this.colorCompatibilityByte === "Game and Watch 50") {
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
      this.cMMMO1 = true;
      this.typeName = "MMMO1";
      break;
    case 0x0c:
      this.cMMMO1 = true;
      this.hasSRAM = true;
      this.typeName = "MMMO1 + SRAM";
      break;
    case 0x0d:
      this.cMMMO1 = true;
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
      this.cRUMBLE = true;
      this.typeName = "RUMBLE";
      break;
    case 0x1d:
      this.cRUMBLE = true;
      this.hasSRAM = true;
      this.typeName = "RUMBLE + SRAM";
      break;
    case 0x1e:
      this.cRUMBLE = true;
      this.hasSRAM = true;
      this.hasBattery = true;
      this.typeName = "RUMBLE + SRAM + Battery";
      break;
    case 0x1f:
      this.cCamera = true;
      this.typeName = "GameBoy Camera";
      break;
    case 0x22:
      this.hasMBC7 = true;
      this.hasSRAM = true;
      this.hasBattery = true;
      this.typeName = "MBC7 + SRAM + Battery";
      break;
    case 0xfd:
      this.cTAMA5 = true;
      this.typeName = "TAMA5";
      break;
    case 0xfe:
      this.cHuC3 = true;
      this.typeName = "HuC3";
      break;
    case 0xff:
      this.cHuC1 = true;
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

    this.mbc = this.mbc1 ||
      this.mbc2 ||
      this.mbc3 ||
      this.mbc5 ||
      this.mbc7 ||
      null;
  }

  setupRAM() {
    this.mbc.setupRAM();

    this.gameboy.api.loadSRAM();
    this.gameboy.api.loadRTC();
  }
}
