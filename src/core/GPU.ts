import GameBoyCore from "./GameBoyCore";

export const totalScanlineCount = 154;

export default class GPU {
  lcdEnabled: boolean = false;
  scanlineProcessors: (() => void)[] = [];

  constructor(
    private gameboy: GameBoyCore
  ) {
    this.disableLCD();
  }

  runScanline(lineNumber: number) {
    this.scanlineProcessors[lineNumber]();
  }

  disableLCD() {
    for (let line = 0; line < totalScanlineCount; ++line) {
      this.scanlineProcessors[line] = () => { };
    }

    this.lcdEnabled = false;
  }

  enableLCD() {
    for (let line = 0; line < totalScanlineCount; ++line) {
      if (line < 143) {
        // We're on a normal scan line:
        this.scanlineProcessors[line] = this.runVisibleScanline;
      } else if (line === 143) {
        // We're on the last visible scan line of the LCD screen:
        this.scanlineProcessors[143] = this.runLastVisibleScanline;
      } else if (line < 153) {
        // In VBlank
        this.scanlineProcessors[line] = this.runVBlankScanline;
      } else {
        // VBlank Ending (We're on the last actual scan line)
        this.scanlineProcessors[153] = this.runLastVBlankScanline;
      }
    }

    this.lcdEnabled = true;
  }

  runVisibleScanline = () => {
    if (this.gameboy.LCDTicks < 80) {
      this.gameboy.scanLineMode2();
    } else if (this.gameboy.LCDTicks < 252) {
      this.gameboy.scanLineMode3();
    } else if (this.gameboy.LCDTicks < 456) {
      this.gameboy.scanLineMode0();
    } else {
      //We're on a new scan line:
      this.gameboy.LCDTicks -= 456;
      if (this.gameboy.STATTracker !== 3) {
        //Make sure the mode 0 handler was run at least once per scan line:
        if (this.gameboy.STATTracker !== 2) {
          if (this.gameboy.STATTracker === 0 && this.gameboy.mode2TriggerSTAT) {
            this.gameboy.interruptsRequested |= 0x2;
          }
          this.gameboy.incrementScanLineQueue();
        }
        if (this.gameboy.hdmaRunning) {
          this.gameboy.executeHDMA();
        }
        if (this.gameboy.mode0TriggerSTAT) {
          this.gameboy.interruptsRequested |= 0x2;
        }
      }

      //Update the scanline registers and assert the LYC counter:
      this.gameboy.actualScanLine = ++this.gameboy.memory[0xff44];

      //Perform a LYC counter assert:
      if (this.gameboy.actualScanLine === this.gameboy.memory[0xff45]) {
        this.gameboy.memory[0xff41] |= 0x04;
        if (this.gameboy.LYCMatchTriggerSTAT) {
          this.gameboy.interruptsRequested |= 0x2;
        }
      } else {
        this.gameboy.memory[0xff41] &= 0x7b;
      }
      this.gameboy.checkIRQMatching();
      //Reset our mode contingency variables:
      this.gameboy.STATTracker = 0;
      this.gameboy.modeSTAT = 2;
      this.scanlineProcessors[this.gameboy.actualScanLine].apply(this.gameboy); //Scan Line and STAT Mode Control.
    }
  };

  runLastVisibleScanline = () => {
    if (this.gameboy.LCDTicks < 80) {
      this.gameboy.scanLineMode2();
    } else if (this.gameboy.LCDTicks < 252) {
      this.gameboy.scanLineMode3();
    } else if (this.gameboy.LCDTicks < 456) {
      this.gameboy.scanLineMode0();
    } else {
      //Starting V-Blank:
      //Just finished the last visible scan line:
      this.gameboy.LCDTicks -= 456;
      if (this.gameboy.STATTracker !== 3) {
        //Make sure the mode 0 handler was run at least once per scan line:
        if (this.gameboy.STATTracker !== 2) {
          if (this.gameboy.STATTracker === 0 && this.gameboy.mode2TriggerSTAT) {
            this.gameboy.interruptsRequested |= 0x2;
          }
          this.gameboy.incrementScanLineQueue();
        }
        if (this.gameboy.hdmaRunning) {
          this.gameboy.executeHDMA();
        }
        if (this.gameboy.mode0TriggerSTAT) {
          this.gameboy.interruptsRequested |= 0x2;
        }
      }
      //Update the scanline registers and assert the LYC counter:
      this.gameboy.actualScanLine = this.gameboy.memory[0xff44] = 144;
      //Perform a LYC counter assert:
      if (this.gameboy.memory[0xff45] === 144) {
        this.gameboy.memory[0xff41] |= 0x04;
        if (this.gameboy.LYCMatchTriggerSTAT) {
          this.gameboy.interruptsRequested |= 0x2;
        }
      } else {
        this.gameboy.memory[0xff41] &= 0x7b;
      }
      //Reset our mode contingency variables:
      this.gameboy.STATTracker = 0;
      //Update our state for v-blank:
      this.gameboy.modeSTAT = 1;
      this.gameboy.interruptsRequested |= this.gameboy.mode1TriggerSTAT ? 0x3 : 0x1;
      this.gameboy.checkIRQMatching();
      //Attempt to blit out to our canvas:
      if (this.gameboy.drewBlank === 0) {
        //Ensure JIT framing alignment:
        if (this.gameboy.cpu.totalLinesPassed < 144 || this.gameboy.cpu.totalLinesPassed === 144 && this.gameboy.midScanlineOffset > -1) {
          //Make sure our gfx are up-to-date:
          this.gameboy.graphicsJITVBlank();
          //Draw the frame:
          this.gameboy.lcdDevice.prepareFrame();
        }
      } else {
        //LCD off takes at least 2 frames:
        --this.gameboy.drewBlank;
      }
      this.scanlineProcessors[144].apply(this.gameboy); //Scan Line and STAT Mode Control.
    }
  };

  runVBlankScanline = () => {
    if (this.gameboy.LCDTicks >= 456) {
      //We're on a new scan line:
      this.gameboy.LCDTicks -= 456;
      this.gameboy.actualScanLine = ++this.gameboy.memory[0xff44];
      //Perform a LYC counter assert:
      if (this.gameboy.actualScanLine === this.gameboy.memory[0xff45]) {
        this.gameboy.memory[0xff41] |= 0x04;
        if (this.gameboy.LYCMatchTriggerSTAT) {
          this.gameboy.interruptsRequested |= 0x2;
          this.gameboy.checkIRQMatching();
        }
      } else {
        this.gameboy.memory[0xff41] &= 0x7b;
      }
      this.scanlineProcessors[this.gameboy.actualScanLine].apply(this.gameboy); //Scan Line and STAT Mode Control.
    }
  };

  runLastVBlankScanline = () => {
    if (this.gameboy.LCDTicks >= 8) {
      if (
        this.gameboy.STATTracker !== 4 &&
        this.gameboy.memory[0xff44] === 153
      ) {
        this.gameboy.memory[0xff44] = 0; //LY register resets to 0 early.
        //Perform a LYC counter assert:
        if (this.gameboy.memory[0xff45] === 0) {
          this.gameboy.memory[0xff41] |= 0x04;
          if (this.gameboy.LYCMatchTriggerSTAT) {
            this.gameboy.interruptsRequested |= 0x2;
            this.gameboy.checkIRQMatching();
          }
        } else {
          this.gameboy.memory[0xff41] &= 0x7b;
        }
        this.gameboy.STATTracker = 4;
      }
      if (this.gameboy.LCDTicks >= 456) {
        //We reset back to the beginning:
        this.gameboy.LCDTicks -= 456;
        this.gameboy.STATTracker = this.gameboy.actualScanLine = 0;
        this.scanlineProcessors[0].apply(this.gameboy); // Scan Line and STAT Mode Control.
      }
    }
  };
}