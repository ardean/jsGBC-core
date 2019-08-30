import CPU from "./CPU";

export default {
  0x11: (cpu: CPU) => {
    const newCarryFlag = cpu.cRegister > 0x7f;
    cpu.cRegister = cpu.cRegister << 1 & 0xff | (cpu.carryFlag ? 1 : 0);
    cpu.carryFlag = newCarryFlag;
    cpu.halfCarryFlag = cpu.subtractFlag = false;
    cpu.zeroFlag = cpu.cRegister === 0;

    if (cpu.debug) console.info(`RL C`);
  },

  0x7C: (cpu: CPU) => {
    cpu.halfCarryFlag = true;
    cpu.subtractFlag = false;
    cpu.zeroFlag = (cpu.hlRegisters & 0x8000) === 0;

    if (cpu.debug) console.info(`BIT 7, H`);
  }
};