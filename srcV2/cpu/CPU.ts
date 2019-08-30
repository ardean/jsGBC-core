import APU from "../sound/APU";
import tickMap from "./tickMap";
import * as util from "../util";
import LCD from "../graphics/LCD";
import { EventEmitter } from "events";
import instructionSet from "./instructionSet";
import InterruptEnable from "../memory/InterruptEnable";
import InterruptRequest from "../memory/InterruptRequest";
import MemoryManagementUnit from "../memory/MemoryManagementUnit";

interface Breakpoint {
  address: number;
}

const MAX_TICKS = 69905;

export default class CPU extends EventEmitter {
  programCounter: number = 0;
  stackPointer: number = 0;

  private _aRegister: number = 0;
  bRegister: number = 0;
  cRegister: number = 0;
  dRegister: number = 0;
  eRegister: number = 0;
  hlRegisters: number = 0;

  subtractFlag: boolean = false;
  halfCarryFlag: boolean = false;
  carryFlag: boolean = false;
  _zeroFlag: boolean = false;

  lcd: LCD;
  apu: APU;

  debug: boolean = false;

  breakpoints: Breakpoint[] = [];

  get aRegister() {
    return this._aRegister;
  }

  set aRegister(value: number) {
    if (this._aRegister === value) return;
    this._aRegister = value;
    this.emit("aRegisterChange", value);
  }

  get zeroFlag() {
    return this._zeroFlag;
  }

  set zeroFlag(value: boolean) {
    if (this._zeroFlag === value) return;
    this._zeroFlag = value;
    this.emit("zeroFlagChange", value);
  }

  constructor(
    public memory: MemoryManagementUnit,
    private interruptRequest: InterruptRequest,
    private interruptEnable: InterruptEnable
  ) {
    super();
  }

  setLCD(lcd: LCD) {
    this.lcd = lcd;
  }

  setAPU(apu: APU) {
    this.apu = apu;
  }

  tick() {
    let interruptTicks = 0;
    let ticks = 0;

    while (ticks < MAX_TICKS) {
      const instructionCode = this.memory.read(this.programCounter);
      this.incrementProgramCounter();

      if (this.debug) console.log(`execute instruction code: ${util.formatHex(instructionCode)}`);

      const instruction = instructionSet[instructionCode];
      if (!instruction) throw new Error(`instruction_not_yet_implemented - ${util.formatHex(instructionCode)}`);
      instruction(this);

      const instructionTicks = tickMap[instructionCode] + interruptTicks;
      if (this.lcd) this.lcd.tick(instructionTicks);
      if (this.apu) this.apu.tick(instructionTicks);

      interruptTicks = this.handleInterrupts();

      ticks += instructionTicks;
    }
  }

  handleInterrupts() {
    if (!this.interruptRequest.interruptMasterEnabled) return 0;

    console.log("interrupt master is enabled!");

    const interrupts = this.interruptEnable.interruptEnabled & this.interruptRequest.interruptRequested;
    if (interrupts === 0) return 0;

    console.log("interrupts found!", util.formatHex(interrupts));

    return 20;
  }

  incrementProgramCounter() {
    this.programCounter = (this.programCounter + 1) & 0xFFFF;
  }

  enableDebug() {
    this.debug = true;
    console.info("enabled CPU debug");
  }

  disableDebug() {
    this.debug = false;
    console.info("disabled CPU debug");
  }
}