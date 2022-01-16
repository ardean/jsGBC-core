import MBC from "./MBC";
import ROM from "../ROM";
import MBC1 from "./MBC1";
import MBC2 from "./MBC2";
import MBC3 from "./MBC3";
import MBC5 from "./MBC5";
import MBC7 from "./MBC7";
import RUMBLE from "./RUMBLE";
import GameBoy from "../GameBoy";
import settings from "../settings";

const gameAndWatchGameCode = "Game and Watch 50";

export default class Cartridge {
  hasMbc1: boolean = false; // does the cartridge use MBC1?
  hasMbc2: boolean = false; // does the cartridge use MBC2?
  hasMbc3: boolean = false; // does the cartridge use MBC3?
  hasMbc5: boolean = false; // does the cartridge use MBC5?
  hasMbc7: boolean = false; // does the cartridge use MBC7?
  hasRam: boolean = false; // does the cartridge use save RAM?
  hasRumble: boolean = false; // does the cartridge have Rumble addressing? (modified MBC5)
  hasCamera: boolean = false; // is the cartridge a GameBoy Camera?
  hasTama5: boolean = false; // does the cartridge use TAMA5? (Tamagotchi Cartridge)
  hasHuc3: boolean = false; // does the cartridge use HuC3? (Hudson Soft / modified MBC3)
  hasHuc1: boolean = false; // does the cartridge use HuC1 (Hudson Soft / modified MBC1)?
  hasMmmO1: boolean = false;
  hasRtc: boolean = false; // does the cartridge have a RTC?
  hasBattery: boolean = false;

  gameboy: GameBoy;
  rom: ROM;
  useGbcMode: boolean;

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

  connect(gameboy: GameBoy) {
    this.gameboy = gameboy;
  }

  disconnect() {
    this.gameboy = undefined;
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
    if (!this.gameboy.usedBootRom) {
      switch (this.colorCompatibilityByte) {
        case 0x00: // GB only
          this.useGbcMode = false;
          break;
        case 0x32: // Exception to the GBC identifying code:
          if (!settings.hasGameBoyPriority && this.name + this.gameCode + this.colorCompatibilityByte === gameAndWatchGameCode) {
            this.useGbcMode = true;
            console.log("Created a boot exception for Game and Watch Gallery 2 (GBC ID byte is wrong on the cartridge).");
          } else {
            this.useGbcMode = false;
          }
          break;
        case 0x80: // Both GB + GBC modes
          this.useGbcMode = !settings.hasGameBoyPriority;
          break;
        case 0xc0: // Only GBC mode
          this.useGbcMode = true;
          break;
        default:
          this.useGbcMode = false;
          console.warn("Unknown GameBoy game type code #" + this.colorCompatibilityByte + ", defaulting to GB mode (Old games don't have a type code).");
      }
    } else {
      console.log("used boot rom");
      this.useGbcMode = this.gameboy.usedGbcBootRom; // Allow the GBC boot ROM to run in GBC mode...
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

  setGbcMode(data: number) {
    this.useGbcMode = (data & 0x1) === 0;
    // Exception to the GBC identifying code:
    if (this.name + this.gameCode + this.colorCompatibilityByte === gameAndWatchGameCode) {
      this.useGbcMode = true;
      console.log("Created a boot exception for Game and Watch Gallery 2 (GBC ID byte is wrong on the cartridge).");
    }
    console.log("Booted to GBC Mode: " + this.useGbcMode);
  }

  setTypeName() {
    switch (this.type) {
      case 0x00:
        this.typeName = "ROM";
        break;
      case 0x01:
        this.hasMbc1 = true;
        this.typeName = "MBC1";
        break;
      case 0x02:
        this.hasMbc1 = true;
        this.hasRam = true;
        this.typeName = "MBC1 + SRAM";
        break;
      case 0x03:
        this.hasMbc1 = true;
        this.hasRam = true;
        this.hasBattery = true;
        this.typeName = "MBC1 + SRAM + Battery";
        break;
      case 0x05:
        this.hasMbc2 = true;
        this.typeName = "MBC2";
        break;
      case 0x06:
        this.hasMbc2 = true;
        this.hasBattery = true;
        this.typeName = "MBC2 + Battery";
        break;
      case 0x08:
        this.hasRam = true;
        this.typeName = "ROM + SRAM";
        break;
      case 0x09:
        this.hasRam = true;
        this.hasBattery = true;
        this.typeName = "ROM + SRAM + Battery";
        break;
      case 0x0b:
        this.hasMmmO1 = true;
        this.typeName = "MMMO1";
        break;
      case 0x0c:
        this.hasMmmO1 = true;
        this.hasRam = true;
        this.typeName = "MMMO1 + SRAM";
        break;
      case 0x0d:
        this.hasMmmO1 = true;
        this.hasRam = true;
        this.hasBattery = true;
        this.typeName = "MMMO1 + SRAM + Battery";
        break;
      case 0x0f:
        this.hasMbc3 = true;
        this.hasRtc = true;
        this.hasBattery = true;
        this.typeName = "MBC3 + RTC + Battery";
        break;
      case 0x10:
        this.hasMbc3 = true;
        this.hasRtc = true;
        this.hasBattery = true;
        this.hasRam = true;
        this.typeName = "MBC3 + RTC + Battery + SRAM";
        break;
      case 0x11:
        this.hasMbc3 = true;
        this.typeName = "MBC3";
        break;
      case 0x12:
        this.hasMbc3 = true;
        this.hasRam = true;
        this.typeName = "MBC3 + SRAM";
        break;
      case 0x13:
        this.hasMbc3 = true;
        this.hasRam = true;
        this.hasBattery = true;
        this.typeName = "MBC3 + SRAM + Battery";
        break;
      case 0x19:
        this.hasMbc5 = true;
        this.typeName = "MBC5";
        break;
      case 0x1a:
        this.hasMbc5 = true;
        this.hasRam = true;
        this.typeName = "MBC5 + SRAM";
        break;
      case 0x1b:
        this.hasMbc5 = true;
        this.hasRam = true;
        this.hasBattery = true;
        this.typeName = "MBC5 + SRAM + Battery";
        break;
      case 0x1c:
        this.hasRumble = true;
        this.typeName = "RUMBLE";
        break;
      case 0x1d:
        this.hasRumble = true;
        this.hasRam = true;
        this.typeName = "RUMBLE + SRAM";
        break;
      case 0x1e:
        this.hasRumble = true;
        this.hasRam = true;
        this.hasBattery = true;
        this.typeName = "RUMBLE + SRAM + Battery";
        break;
      case 0x1f:
        this.hasCamera = true;
        this.typeName = "GameBoy Camera";
        break;
      case 0x22:
        this.hasMbc7 = true;
        this.hasRam = true;
        this.hasBattery = true;
        this.typeName = "MBC7 + SRAM + Battery";
        break;
      case 0xfd:
        this.hasTama5 = true;
        this.typeName = "TAMA5";
        break;
      case 0xfe:
        this.hasHuc3 = true;
        this.typeName = "HuC3";
        break;
      case 0xff:
        this.hasHuc1 = true;
        this.typeName = "HuC1";
        break;
      default:
        throw new Error("Unknown Cartridge Type");
    }

    if (this.hasMbc1) this.mbc1 = new MBC1(this);
    if (this.hasMbc2) this.mbc2 = new MBC2(this);
    if (this.hasMbc3) this.mbc3 = new MBC3(this);
    if (this.hasMbc5) this.mbc5 = new MBC5(this);
    if (this.hasMbc7) this.mbc7 = new MBC7(this);
    if (this.hasRumble) this.mbc5 = this.rumble = new RUMBLE(this);

    this.mbc = (
      this.mbc1 ||
      this.mbc2 ||
      this.mbc3 ||
      this.mbc5 ||
      this.mbc7 ||
      this.rumble ||
      undefined
    );
  }

  setupRAM() {
    if (this.mbc) this.mbc.setupRAM();

    this.gameboy.loadRam();
    this.gameboy.loadRtc();
  }
}
