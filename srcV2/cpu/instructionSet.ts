import CPU from "./CPU";
import * as util from "../util";
import subinstructionSet from "./subinstructionSet";

export default {
  0x00: (cpu: CPU) => {
    if (cpu.debug) console.info(`NOP`);
  },

  0x01: (cpu: CPU) => {
    cpu.cRegister = cpu.memory.read(cpu.programCounter);
    cpu.bRegister = cpu.memory.read(cpu.programCounter + 1 & 0xFFFF);
    cpu.programCounter = cpu.programCounter + 2 & 0xFFFF;

    if (cpu.debug) console.info(`LD BC, ${util.formatHex(cpu.programCounter)}`);
  },

  0x04: (cpu: CPU) => {
    cpu.bRegister = cpu.bRegister + 1 & 0xFF;
    cpu.zeroFlag = cpu.bRegister === 0;
    cpu.halfCarryFlag = (cpu.bRegister & 0xF) === 0;
    cpu.subtractFlag = false;

    if (cpu.debug) console.info(`INC B`);
  },

  0x05: (cpu: CPU) => {
    cpu.bRegister = cpu.bRegister - 1 & 0xFF;
    cpu.zeroFlag = cpu.bRegister === 0;
    cpu.halfCarryFlag = (cpu.bRegister & 0xF) === 0xF;
    cpu.subtractFlag = true;

    if (cpu.debug) console.info(`DEC B`);
  },

  0x06: (cpu: CPU) => {
    cpu.bRegister = cpu.memory.read(cpu.programCounter);
    cpu.incrementProgramCounter();

    if (cpu.debug) console.info(`LD B, ${util.formatHex(cpu.bRegister)}`);
  },

  0x0B: (cpu: CPU) => {
    const value = (cpu.bRegister << 8 | cpu.cRegister) - 1 & 0xFFFF;
    cpu.bRegister = value >> 8;
    cpu.cRegister = value & 0xFF;

    if (cpu.debug) console.info(`DEC BC`);
  },

  0x0C: (cpu: CPU) => {
    cpu.cRegister = cpu.cRegister + 1 & 0xFF;
    cpu.zeroFlag = cpu.cRegister === 0;
    cpu.halfCarryFlag = (cpu.cRegister & 0xF) === 0;
    cpu.subtractFlag = false;

    if (cpu.debug) console.info(`INC C`);
  },

  0x0D: (cpu: CPU) => {
    cpu.cRegister = cpu.cRegister - 1 & 0xFF;
    cpu.zeroFlag = cpu.cRegister === 0;
    cpu.halfCarryFlag = (cpu.cRegister & 0xF) === 0xF;
    cpu.subtractFlag = true;

    if (cpu.debug) console.info(`DEC C`);
  },

  0x0E: (cpu: CPU) => {
    cpu.cRegister = cpu.memory.read(cpu.programCounter);
    cpu.incrementProgramCounter();

    if (cpu.debug) console.info(`LD C, ${util.formatHex(cpu.programCounter)}`);
  },

  0x11: (cpu: CPU) => {
    cpu.eRegister = cpu.memory.read(cpu.programCounter);
    cpu.incrementProgramCounter();
    cpu.dRegister = cpu.memory.read(cpu.programCounter);
    cpu.incrementProgramCounter();

    if (cpu.debug) console.info(`LD DE, ${util.formatHex(cpu.programCounter)}`);
  },

  0x12: (cpu: CPU) => {
    cpu.memory.write(cpu.dRegister << 8 | cpu.eRegister, cpu.aRegister);

    if (cpu.debug) console.info(`LD (DE), A`);
  },

  0x13: (cpu: CPU) => {
    const deValue = (cpu.dRegister << 8 | cpu.eRegister) + 1;
    cpu.dRegister = deValue >> 8 & 0xFF;
    cpu.eRegister = deValue & 0xFF;

    if (cpu.debug) console.info(`INC DE`);
  },

  0x14: (cpu: CPU) => {
    cpu.dRegister = cpu.dRegister + 1 & 0xff;
    cpu.zeroFlag = cpu.dRegister === 0;
    cpu.halfCarryFlag = (cpu.dRegister & 0xf) === 0;
    cpu.subtractFlag = false;

    if (cpu.debug) console.log(`INC D`);
  },

  0x15: (cpu: CPU) => {
    cpu.dRegister = cpu.dRegister - 1 & 0xFF;
    cpu.zeroFlag = cpu.dRegister === 0;
    cpu.halfCarryFlag = (cpu.dRegister & 0xF) === 0xF;
    cpu.subtractFlag = true;

    if (cpu.debug) console.info(`DEC D`);
  },

  0x16: (cpu: CPU) => {
    cpu.dRegister = cpu.memory.read(cpu.programCounter);
    cpu.incrementProgramCounter();

    if (cpu.debug) console.info(`LD D, ${util.formatHex(cpu.programCounter)}`);
  },

  0x17: (cpu: CPU) => {
    const carryFlag = cpu.carryFlag ? 1 : 0;
    cpu.carryFlag = cpu.aRegister > 0x7f;
    cpu.aRegister = cpu.aRegister << 1 & 0xFF | carryFlag;
    cpu.zeroFlag = cpu.subtractFlag = cpu.halfCarryFlag = false;

    if (cpu.debug) console.info(`RLA`);
  },

  0x18: (cpu: CPU) => {
    cpu.programCounter = cpu.programCounter + (cpu.memory.read(cpu.programCounter) << 24 >> 24) + 1 & 0xFFFF;

    if (cpu.debug) console.info(`JR ${util.formatHex(cpu.programCounter)}`);
  },

  0x1A: (cpu: CPU) => {
    cpu.aRegister = cpu.memory.read(cpu.dRegister << 8 | cpu.eRegister);

    if (cpu.debug) console.info(`LD A, (DE)`);
  },

  0x1C: (cpu: CPU) => {
    cpu.eRegister = cpu.eRegister + 1 & 0xFF;
    cpu.zeroFlag = cpu.eRegister === 0;
    cpu.halfCarryFlag = (cpu.eRegister & 0xF) === 0;
    cpu.subtractFlag = false;

    if (cpu.debug) console.info(`INC E`);
  },

  0x1D: (cpu: CPU) => {
    cpu.eRegister = cpu.eRegister - 1 & 0xFF;
    cpu.zeroFlag = cpu.eRegister === 0;
    cpu.halfCarryFlag = (cpu.eRegister & 0xF) === 0xF;
    cpu.subtractFlag = true;

    if (cpu.debug) console.info(`DEC E`);
  },

  0x1E: (cpu: CPU) => {
    cpu.eRegister = cpu.memory.read(cpu.programCounter);
    cpu.incrementProgramCounter();

    if (cpu.debug) console.info(`LD E, ${util.formatHex(cpu.programCounter)}`);
  },

  0x20: (cpu: CPU) => {
    if (!cpu.zeroFlag) {
      cpu.programCounter = cpu.programCounter + (cpu.memory.read(cpu.programCounter) << 24 >> 24) + 1 & 0xFFFF;
      // cpu.CPUTicks += 4;
    } else {
      cpu.incrementProgramCounter();
    }

    if (cpu.debug) console.info(`JR NZ, ${!cpu.zeroFlag ? util.formatHex(cpu.programCounter) : "did not jump"}`);
  },

  0x21: (cpu: CPU) => {
    cpu.hlRegisters = cpu.memory.read(cpu.programCounter + 1 & 0xFFFF) << 8 | cpu.memory.read(cpu.programCounter);
    cpu.programCounter = cpu.programCounter + 2 & 0xFFFF;

    if (cpu.debug) console.info(`LD HL, ${util.formatHex(cpu.hlRegisters)}`);
  },

  0x22: (cpu: CPU) => {
    cpu.memory.write(cpu.hlRegisters, cpu.aRegister);
    cpu.hlRegisters = cpu.hlRegisters + 1 & 0xFFFF;

    if (cpu.debug) console.info(`LDI (HL), A`);
  },

  0x23: (cpu: CPU) => {
    cpu.hlRegisters = cpu.hlRegisters + 1 & 0xFFFF;

    if (cpu.debug) console.info(`INC HL`);
  },

  0x24: (cpu: CPU) => {
    const H = (cpu.hlRegisters >> 8) + 1 & 0xFF;
    cpu.zeroFlag = H === 0;
    cpu.halfCarryFlag = (H & 0xF) === 0;
    cpu.subtractFlag = false;
    cpu.hlRegisters = H << 8 | cpu.hlRegisters & 0xFF;

    if (cpu.debug) console.info(`INC H`);
  },

  0x28: (cpu: CPU) => {
    if (cpu.zeroFlag) {
      cpu.programCounter = cpu.programCounter + (cpu.memory.read(cpu.programCounter) << 24 >> 24) + 1 & 0xFFFF;
      // cpu.CPUTicks += 4;
    } else {
      cpu.incrementProgramCounter();
    }

    if (cpu.debug) console.info(`JR Z, ${util.formatHex(cpu.programCounter)}`);
  },

  0x2A: (cpu: CPU) => {
    cpu.aRegister = cpu.memory.read(cpu.hlRegisters);
    cpu.hlRegisters = cpu.hlRegisters + 1 & 0xFFFF;

    if (cpu.debug) console.info(`LDI A, (HL)`);
  },

  0x2E: (cpu: CPU) => {
    cpu.hlRegisters = cpu.hlRegisters & 0xFF00 | cpu.memory.read(cpu.programCounter);
    cpu.incrementProgramCounter();

    if (cpu.debug) console.info(`LD L, ${util.formatHex(cpu.programCounter)}`);
  },

  0x31: (cpu: CPU) => {
    cpu.stackPointer = cpu.memory.read(cpu.programCounter + 1 & 0xFFFF) << 8 | cpu.memory.read(cpu.programCounter);
    cpu.programCounter = cpu.programCounter + 2 & 0xFFFF;

    if (cpu.debug) console.info(`LD SP, ${util.formatHex(cpu.stackPointer)}`);
  },

  0x32: (cpu: CPU) => {
    cpu.memory.write(cpu.hlRegisters, cpu.aRegister);
    cpu.hlRegisters = cpu.hlRegisters - 1 & 0xFFFF;

    if (cpu.debug) console.info(`LDD (HL), A`);
  },

  0x36: (cpu: CPU) => {
    cpu.memory.write(cpu.hlRegisters, cpu.memory.read(cpu.programCounter));
    cpu.programCounter = cpu.programCounter + 1 & 0xFFFF;
  },

  0x3D: (cpu: CPU) => {
    cpu.aRegister = cpu.aRegister - 1 & 0xFF;
    cpu.zeroFlag = cpu.aRegister === 0;
    cpu.halfCarryFlag = (cpu.aRegister & 0xF) === 0xF;
    cpu.subtractFlag = true;

    if (cpu.debug) console.info(`DEC A`);
  },

  0x3E: (cpu: CPU) => {
    cpu.aRegister = cpu.memory.read(cpu.programCounter);
    cpu.incrementProgramCounter();

    if (cpu.debug) console.info(`LD A, ${util.formatHex(cpu.aRegister)}`);
  },

  0x47: (cpu: CPU) => {
    cpu.bRegister = cpu.aRegister;

    if (cpu.debug) console.info(`LD B, A`);
  },

  0x4F: (cpu: CPU) => {
    cpu.cRegister = cpu.aRegister;

    if (cpu.debug) console.info(`LD C, A`);
  },

  0x57: (cpu: CPU) => {
    cpu.dRegister = cpu.aRegister;

    if (cpu.debug) console.info(`LD D, A`);
  },

  0x67: (cpu: CPU) => {
    cpu.hlRegisters = cpu.aRegister << 8 | cpu.hlRegisters & 0xFF;

    if (cpu.debug) console.info(`LD H, A`);
  },

  0x77: (cpu: CPU) => {
    cpu.memory.write(cpu.hlRegisters, cpu.aRegister);

    if (cpu.debug) console.info(`LD (HL), A`);
  },

  0x78: (cpu: CPU) => {
    cpu.aRegister = cpu.bRegister;

    if (cpu.debug) console.info(`LD A, B`);
  },

  0x7B: (cpu: CPU) => {
    cpu.aRegister = cpu.eRegister;

    if (cpu.debug) console.info(`LD A, E`);
  },

  0x7C: (cpu: CPU) => {
    cpu.aRegister = cpu.hlRegisters >> 8;

    if (cpu.debug) console.info(`LD A, H`);
  },

  0x7D: (cpu: CPU) => {
    cpu.aRegister = cpu.hlRegisters & 0xFF;

    if (cpu.debug) console.info(`LD A, L`);
  },

  0x86: (cpu: CPU) => {
    const dirtySum = cpu.aRegister + cpu.memory.read(cpu.hlRegisters);
    cpu.halfCarryFlag = (dirtySum & 0xF) < (cpu.aRegister & 0xF);
    cpu.carryFlag = dirtySum > 0xFF;
    cpu.aRegister = dirtySum & 0xFF;
    cpu.zeroFlag = cpu.aRegister === 0;
    cpu.subtractFlag = false;

    if (cpu.debug) console.info(`ADD A, (HL)`);
  },

  0x90: (cpu: CPU) => {
    const dirtySum = cpu.aRegister - cpu.bRegister;
    cpu.halfCarryFlag = (cpu.aRegister & 0xF) < (dirtySum & 0xF);
    cpu.carryFlag = dirtySum < 0;
    cpu.aRegister = dirtySum & 0xFF;
    cpu.zeroFlag = dirtySum === 0;
    cpu.subtractFlag = true;

    if (cpu.debug) console.info(`SUB A, B`);
  },

  0xAF: (cpu: CPU) => {
    cpu.aRegister = 0;
    cpu.zeroFlag = true;
    cpu.subtractFlag = cpu.halfCarryFlag = cpu.carryFlag = false;

    if (cpu.debug) console.info(`XOR A`);
  },

  0xBE: (cpu: CPU) => {
    const dirtySum = cpu.aRegister - cpu.memory.read(cpu.hlRegisters);
    cpu.halfCarryFlag = (dirtySum & 0xF) > (cpu.aRegister & 0xF);
    cpu.carryFlag = dirtySum < 0;
    cpu.zeroFlag = dirtySum === 0;
    cpu.subtractFlag = true;

    if (cpu.debug) console.info(`CP (HL)`);
  },

  0xC1: (cpu: CPU) => {
    cpu.cRegister = cpu.memory.read(cpu.stackPointer);
    cpu.bRegister = cpu.memory.read(cpu.stackPointer + 1 & 0xFFFF);
    cpu.stackPointer = cpu.stackPointer + 2 & 0xFFFF;

    if (cpu.debug) console.info(`POP BC`);
  },

  0xC3: (cpu: CPU) => {
    cpu.programCounter = cpu.memory.read(cpu.programCounter + 1 & 0xFFFF) << 8 | cpu.memory.read(cpu.programCounter);

    if (cpu.debug) console.info(`JP ${util.formatHex(cpu.programCounter)}`);
  },

  0xC5: (cpu: CPU) => {
    cpu.stackPointer = cpu.stackPointer - 1 & 0xFFFF;
    cpu.memory.write(cpu.stackPointer, cpu.bRegister);
    cpu.stackPointer = cpu.stackPointer - 1 & 0xFFFF;
    cpu.memory.write(cpu.stackPointer, cpu.cRegister);

    if (cpu.debug) console.info(`PUSH BC`);
  },

  0xC9: (cpu: CPU) => {
    cpu.programCounter = cpu.memory.read(cpu.stackPointer + 1 & 0xFFFF) << 8 | cpu.memory.read(cpu.stackPointer);
    cpu.stackPointer = cpu.stackPointer + 2 & 0xFFFF;

    if (cpu.debug) console.info(`RET`);
  },

  0xCB: (cpu: CPU) => {
    const subinstructionCode = cpu.memory.read(cpu.programCounter);
    cpu.incrementProgramCounter();

    // cpu.ticks += SecondaryTickTable[operationCode];

    if (cpu.debug) console.log(`execute subinstruction code: ${util.formatHex(subinstructionCode)}`);

    const subinstruction = subinstructionSet[subinstructionCode];
    if (!subinstruction) throw new Error(`subinstruction_not_yet_implemented - ${util.formatHex(subinstructionCode)}`);
    subinstruction(cpu);
  },

  0xCD: (cpu: CPU) => {
    const programCounter = cpu.memory.read(cpu.programCounter + 1 & 0xFFFF) << 8 | cpu.memory.read(cpu.programCounter);
    cpu.programCounter = cpu.programCounter + 2 & 0xFFFF;
    cpu.stackPointer = cpu.stackPointer - 1 & 0xFFFF;
    cpu.memory.write(cpu.stackPointer, cpu.programCounter >> 8);
    cpu.stackPointer = cpu.stackPointer - 1 & 0xFFFF;
    cpu.memory.write(cpu.stackPointer, cpu.programCounter & 0xFF);
    cpu.programCounter = programCounter;

    if (cpu.debug) console.info(`CALL ${util.formatHex(programCounter)}`);
  },

  0xE0: (cpu: CPU) => {
    cpu.memory.writeHigh(cpu.memory.read(cpu.programCounter), cpu.aRegister);
    cpu.incrementProgramCounter();

    if (cpu.debug) console.info(`LDH ${util.formatHex(cpu.memory.read(cpu.programCounter))}, A`);
  },

  0xE2: (cpu: CPU) => {
    cpu.memory.writeHigh(cpu.cRegister, cpu.aRegister);

    if (cpu.debug) console.info(`LD (0xFF00 | C), A`);
  },

  0xEA: (cpu: CPU) => {
    const address = cpu.memory.read(cpu.programCounter + 1 & 0xFFFF) << 8 | cpu.memory.read(cpu.programCounter);
    cpu.memory.write(
      address,
      cpu.aRegister
    );
    cpu.programCounter = cpu.programCounter + 2 & 0xFFFF;

    if (cpu.debug) console.info(`LD ${util.formatHex(address)}, A`);
  },

  0xF0: (cpu: CPU) => {
    cpu.aRegister = cpu.memory.readHigh(cpu.memory.read(cpu.programCounter));
    cpu.incrementProgramCounter();

    if (cpu.debug) console.info(`LDH A, ${util.formatHex(cpu.aRegister)}`);
  },

  0xF3: (cpu: CPU) => {
    // TODO: better
    cpu.lcd.interruptRequest.interruptMasterEnabled = false;
    // cpu.lcd.interruptRequest.IRQEnableDelay = 0;

    if (cpu.debug) console.info(`DI`);
  },

  0xFE: (cpu: CPU) => {
    const dirtySum = cpu.aRegister - cpu.memory.read(cpu.programCounter);
    cpu.incrementProgramCounter();
    cpu.halfCarryFlag = (dirtySum & 0xF) > (cpu.aRegister & 0xF);
    cpu.carryFlag = dirtySum < 0;
    cpu.zeroFlag = dirtySum === 0;
    cpu.subtractFlag = true;

    if (cpu.debug) console.info(`CP ${util.formatHex(cpu.programCounter)}`);
  }
};