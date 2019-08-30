import CPU from "./cpu/CPU";
import APU from "./sound/APU";
import ROM from "./memory/ROM";
import LCD from "./graphics/LCD";
import Range from "./memory/Range";
import ROMBank from "./memory/ROMBank";
import HighRAM from "./memory/HighRAM";
import VideoRAM from "./memory/VideoRAM";
import ROMRange from "./memory/ROMRange";
import LCDRange from "./memory/LCDRange";
import GPU, { Canvas } from "./graphics/GPU";
import SoundRange from "./memory/SoundRange";
import Cartridge from "./cartridge/Cartridge";
import DisableBIOS from "./memory/DisableBIOS";
import InterruptEnable from "./memory/InterruptEnable";
import InterruptRequest from "./memory/InterruptRequest";
import TimerDividerRange from "./memory/TimerDividerRange";
import SerialTransferRange from "./memory/SerialTransferRange";
import MemoryManagementUnit from "./memory/MemoryManagementUnit";

const requestFrame = typeof window !== "undefined" && window.requestAnimationFrame ?
  window.requestAnimationFrame :
  (fn: (now: number) => void) => setTimeout(() => fn((typeof performance !== "undefined" ? performance : Date).now()), 0);

interface Options {
  bios?: ROM;
  cartridge?: Cartridge;
  canvas?: Canvas;
}

export default class GameBoy {
  bios?: ROM;
  cartridge?: Cartridge;
  canvas?: Canvas;

  mmu: MemoryManagementUnit;
  cpu: CPU;
  gpu?: GPU;
  lcd?: LCD;
  apu: APU;

  constructor(options: Options) {
    this.bios = options.bios;
    this.cartridge = options.cartridge;
    this.canvas = options.canvas;
  }

  flashBios(bios: ROM) {
    this.bios = bios;
  }

  insertCartridge(cartridge: Cartridge) {
    this.cartridge = cartridge;
  }

  turnOn() {
    const bios = new ROMRange(0x0000, 0x00FF, this.bios);
    const romBank0 = new ROMBank(0x0000, 0x3FFF, this.cartridge.rom);
    const romBankN = new ROMBank(0x4000, 0x7FFF, this.cartridge.rom, 1);
    const videoRAM = new VideoRAM(0x8000, 0x9FFF);

    const workRAM0 = new Range(0xC000, 0xCFFF);
    const workRAMN = new Range(0xD000, 0xDFFF);

    const serialTransferRange = new SerialTransferRange(0xFF01, 0xFF02);
    const timerDividerRange = new TimerDividerRange(0xFF04, 0xFF07);
    const interruptRequest = new InterruptRequest(0xFF0F, 0xFF0F);
    const soundRange = new SoundRange(0xFF10, 0xFF26);
    const lcdRange = new LCDRange(0xFF40, 0xFF4B);
    const disableBIOS = new DisableBIOS(0xFF50, 0xFF50);

    const highRAM = new HighRAM(0xFF80, 0xFFFE);
    const interruptEnable = new InterruptEnable(0xFFFF, 0xFFFF);

    const memoryRanges: Range[] = [
      bios,
      romBank0,
      romBankN,
      videoRAM,

      workRAM0,
      workRAMN,

      serialTransferRange,

      timerDividerRange,

      interruptRequest,
      soundRange,
      lcdRange,
      disableBIOS,

      highRAM,
      interruptEnable
    ];

    this.mmu = new MemoryManagementUnit(memoryRanges);

    disableBIOS.onBIOSDisabled = () => {
      this.mmu.removeRange(bios);
      this.mmu.removeRange(disableBIOS);
      disableBIOS.onBIOSDisabled = null;
      console.info(`disabled BIOS`);
    };

    soundRange.onChannel1LengthChange = (length: number) => {
      const channel = this.apu.channels[0];
      channel.setLength(length);
      console.info(`channel 1 length changed: ${length}`);
    };

    soundRange.onChannel1EnvelopeChange = (sign: number, volume: number, step: number) => {
      const channel = this.apu.channels[0];
      channel.envelopeSign = sign;
      channel.setEnvelopeVolume(volume);
      channel.envelopeStep = step;
      console.info(`channel 1 envelope changed: ${sign}, ${volume}, ${step}`);
    };

    soundRange.onChannel1FrequencyChange = (frequency: number, lengthCheck: boolean, restart: boolean) => {
      const channel = this.apu.channels[0];
      channel.setFrequency(frequency);
      console.info(`channel 1 frequency changed to ${frequency}`);

      if (lengthCheck) {
        channel.lengthCheck = true;
      }

      if (restart) {
        channel.play(); // TODO: restart
        console.log("restart channel 1");
      }
    };

    soundRange.onChannel2LengthChange = (length: number) => {
      const channel = this.apu.channels[1];
      channel.setLength(length);
    };

    soundRange.onChannel2EnvelopeChange = (sign: number, volume: number, step: number) => {
      const channel = this.apu.channels[1];
      channel.envelopeSign = sign;
      channel.setEnvelopeVolume(volume);
      channel.envelopeStep = step;
      console.info(`channel 2 envelope changed: ${sign}, ${volume}, ${step}`);
    };

    soundRange.onChannel2FrequencyChange = (frequency: number, lengthCheck: boolean, restart: boolean) => {
      const channel = this.apu.channels[1];
      channel.setFrequency(frequency);
      console.info(`channel 2 frequency changed to ${frequency}`);

      if (lengthCheck) {
        channel.lengthCheck = true;
      }

      if (restart) {
        channel.play(); // TODO: restart
        console.log("restart channel 2");
      }
    };

    this.cpu = new CPU(this.mmu, interruptRequest, interruptEnable);
    serialTransferRange.cpu = this.cpu; // TODO: TEMP

    this.apu = new APU();
    this.cpu.setAPU(this.apu);
    this.apu.connect();

    if (this.canvas) {
      this.gpu = new GPU(lcdRange, videoRAM, this.canvas);
      this.lcd = new LCD(lcdRange, interruptRequest, this.gpu);
      this.cpu.setLCD(this.lcd);
    }

    const run = (now: number) => {
      this.cpu.tick();
      requestFrame(run);
    };
    requestFrame(run);
  }
}