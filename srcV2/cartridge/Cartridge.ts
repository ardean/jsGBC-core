import MBC from "./MBC";
import ROM from "../memory/ROM";
import MBC1 from "./MBC1";
import MBC2 from "./MBC2";
import MBC3 from "./MBC3";
import MBC5 from "./MBC5";
import MBC7 from "./MBC7";

export default class Cartridge {
  rom: ROM;
  name: string;
  gameCode: string;
  colorCompatibilityByte: number;
  type: number;
  romSizeType: number;
  ramSizeType: number;

  mbc: MBC;
  sram: boolean;
  battery: boolean;
  mmmo1: boolean;
  rtc: boolean;
  rumble: boolean;
  camera: boolean;
  tama5: boolean;
  huc3: boolean;
  huc1: boolean;

  constructor(rom: ROM) {
    this.rom = rom;

    this.name = this.rom.readString(0x134, 0x13e);
    this.gameCode = this.rom.readString(0x13f, 0x142);
    this.colorCompatibilityByte = this.rom.readByte(0x143);
    this.type = this.rom.readByte(0x147);
    this.romSizeType = this.rom.readByte(0x148);
    this.ramSizeType = this.rom.readByte(0x149);

    switch (this.type) {
      case 0x00:
        this.mbc = null;
        break;
      case 0x01:
        this.mbc = new MBC1();
        break;
      case 0x02:
        this.mbc = new MBC1();
        this.sram = true;
        break;
      case 0x03:
        this.mbc = new MBC1();
        this.sram = true;
        this.battery = true;
        break;
      case 0x05:
        this.mbc = new MBC2();
        break;
      case 0x06:
        this.mbc = new MBC2();
        this.battery = true;
        break;
      case 0x08:
        this.mbc = null;
        this.sram = true;
        break;
      case 0x09:
        this.mbc = null;
        this.sram = true;
        this.battery = true;
        break;
      case 0x0b:
        this.mmmo1 = true;
        break;
      case 0x0c:
        this.mmmo1 = true;
        this.sram = true;
        break;
      case 0x0d:
        this.mmmo1 = true;
        this.sram = true;
        this.battery = true;
        break;
      case 0x0f:
        this.mbc = new MBC3();
        this.rtc = true;
        this.battery = true;
        break;
      case 0x10:
        this.mbc = new MBC3();
        this.rtc = true;
        this.battery = true;
        this.sram = true;
        break;
      case 0x11:
        this.mbc = new MBC3();
        break;
      case 0x12:
        this.mbc = new MBC3();
        this.sram = true;
        break;
      case 0x13:
        this.mbc = new MBC3();
        this.sram = true;
        this.battery = true;
        break;
      case 0x19:
        this.mbc = new MBC5();
        break;
      case 0x1a:
        this.mbc = new MBC5();
        this.sram = true;
        break;
      case 0x1b:
        this.mbc = new MBC5();
        this.sram = true;
        this.battery = true;
        break;
      case 0x1c:
        this.rumble = true;
        break;
      case 0x1d:
        this.rumble = true;
        this.sram = true;
        break;
      case 0x1e:
        this.rumble = true;
        this.sram = true;
        this.battery = true;
        break;
      case 0x1f:
        this.camera = true;
        break;
      case 0x22:
        this.mbc = new MBC7();
        this.sram = true;
        this.battery = true;
        break;
      case 0xfd:
        this.tama5 = true;
        break;
      case 0xfe:
        this.huc3 = true;
        break;
      case 0xff:
        this.huc1 = true;
        break;
      default:
        throw new Error("unknown_cartridge_type");
    }
  }
}