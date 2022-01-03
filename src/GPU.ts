import GameBoy from "./GameBoy";

export const totalScanlineCount = 154;

export default class GPU {
  lcdEnabled: boolean = false;
  scanlineProcessors: (() => void)[] = [];

  renderBackgroundLayer: (scanline: number) => void;
  renderWindowLayer: (scanline: number) => void;
  renderSpriteLayer: (scanline: number) => void;

  constructor(
    private gameboy: GameBoy
  ) {
    this.disableLCD();
  }

  initRenderer() {
    if (!this.gameboy.cartridge.useGbcMode) {
      this.renderBackgroundLayer = this.renderGbBackgroundLayer;
      this.renderWindowLayer = this.renderGbWindowLayer;
      this.renderSpriteLayer = this.renderGbSpriteLayer;
    } else {
      if (this.gameboy.hasBackgroundPriority) {
        this.renderBackgroundLayer = this.renderGbcBackgroundLayer;
        this.renderWindowLayer = this.renderGbcWindowLayer;
      } else {
        this.renderBackgroundLayer = this.renderGbcBackgroundLayerWithoutPriorityFlagging;
        this.renderWindowLayer = this.renderGbcWindowLayerWithoutPriorityFlagging;
      }
      this.renderSpriteLayer = this.renderGbcSpriteLayer;
    }
  }

  renderGbcSpriteLayer = (scanline: number) => {
    if (this.gameboy.gfxSpriteShow) {
      var OAMAddress = 0xfe00;
      var lineAdjusted = scanline + 0x10;
      var yoffset = 0;
      var xcoord = 0;
      var endX = 0;
      var xCounter = 0;
      var attrCode = 0;
      var palette = 0;
      var tile = null;
      var data = 0;
      var currentPixel = 0;
      var spriteCount = 0;
      if (this.gameboy.gfxSpriteNormalHeight) {
        for (; OAMAddress < 0xfea0 && spriteCount < 10; OAMAddress += 4) {
          yoffset = lineAdjusted - this.gameboy.memory[OAMAddress];
          if ((yoffset & 0x7) === yoffset) {
            xcoord = this.gameboy.memory[OAMAddress | 1] - 8;
            endX = Math.min(160, xcoord + 8);
            attrCode = this.gameboy.memory[OAMAddress | 3];
            palette = (attrCode & 7) << 2;
            tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | this.gameboy.memory[OAMAddress | 2]];
            xCounter = xcoord > 0 ? xcoord : 0;
            xcoord -= yoffset << 3;
            for (currentPixel = this.gameboy.pixelStart + xCounter; xCounter < endX; ++xCounter, ++currentPixel) {
              if (this.gameboy.frameBuffer[currentPixel] >= 0x2000000) {
                data = tile[xCounter - xcoord];
                if (data > 0) {
                  this.gameboy.frameBuffer[currentPixel] = this.gameboy.gbcOBJPalette[palette | data];
                }
              } else if (this.gameboy.frameBuffer[currentPixel] < 0x1000000) {
                data = tile[xCounter - xcoord];
                if (data > 0 && attrCode < 0x80) {
                  //Don't optimize for attrCode, as LICM-capable JITs should optimize its checks.
                  this.gameboy.frameBuffer[currentPixel] = this.gameboy.gbcOBJPalette[palette | data];
                }
              }
            }
            ++spriteCount;
          }
        }
      } else {
        for (; OAMAddress < 0xfea0 && spriteCount < 10; OAMAddress += 4) {
          yoffset = lineAdjusted - this.gameboy.memory[OAMAddress];
          if ((yoffset & 0xf) === yoffset) {
            xcoord = this.gameboy.memory[OAMAddress | 1] - 8;
            endX = Math.min(160, xcoord + 8);
            attrCode = this.gameboy.memory[OAMAddress | 3];
            palette = (attrCode & 7) << 2;
            if ((attrCode & 0x40) === (0x40 & yoffset << 3)) {
              tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | this.gameboy.memory[OAMAddress | 0x2] & 0xfe];
            } else {
              tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | this.gameboy.memory[OAMAddress | 0x2] | 1];
            }
            xCounter = xcoord > 0 ? xcoord : 0;
            xcoord -= (yoffset & 0x7) << 3;
            for (currentPixel = this.gameboy.pixelStart + xCounter; xCounter < endX; ++xCounter, ++currentPixel) {
              if (this.gameboy.frameBuffer[currentPixel] >= 0x2000000) {
                data = tile[xCounter - xcoord];
                if (data > 0) {
                  this.gameboy.frameBuffer[currentPixel] = this.gameboy.gbcOBJPalette[palette | data];
                }
              } else if (this.gameboy.frameBuffer[currentPixel] < 0x1000000) {
                data = tile[xCounter - xcoord];
                if (data > 0 && attrCode < 0x80) {
                  //Don't optimize for attrCode, as LICM-capable JITs should optimize its checks.
                  this.gameboy.frameBuffer[currentPixel] = this.gameboy.gbcOBJPalette[palette | data];
                }
              }
            }
            ++spriteCount;
          }
        }
      }
    }
  };

  renderGbBackgroundLayer = (scanline: number) => {
    var scrollYAdjusted = this.gameboy.backgroundY + scanline & 0xff; //The line of the BG we're at.
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gameboy.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 0xf8) << 2; //The row of cached tiles we're fetching from.
    var scrollXAdjusted = this.gameboy.backgroundX + this.gameboy.currentX & 0xff; //The scroll amount of the BG.
    var pixelPosition = this.gameboy.pixelStart + this.gameboy.currentX; //Current pixel we're working on.
    var pixelPositionEnd = this.gameboy.pixelStart + (this.gameboy.gfxWindowDisplay && scanline - this.gameboy.windowY >= 0 ? Math.min(Math.max(this.gameboy.windowX, 0) + this.gameboy.currentX, this.gameboy.pixelEnd) : this.gameboy.pixelEnd); //Make sure we do at most 160 pixels a scanline.
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.gameboy.BGCHRBank1[tileNumber];
    if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
      chrCode |= 0x100;
    }
    var tile = this.gameboy.tileCache[chrCode];
    for (
      var texel = scrollXAdjusted & 0x7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100;
      ++scrollXAdjusted
    ) {
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[tileYLine | texel++]];
    }
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 0x100 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while (tileNumber < scrollXAdjustedAligned) {
      chrCode = this.gameboy.BGCHRBank1[++tileNumber];
      if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
        chrCode |= 0x100;
      }
      tile = this.gameboy.tileCache[chrCode];
      texel = tileYLine;
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
      if (scrollXAdjusted < 0x100) {
        chrCode = this.gameboy.BGCHRBank1[++tileNumber];
        if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        tile = this.gameboy.tileCache[chrCode];
        for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
          this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[++texel]];
        }
      }
      scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
      while (tileYDown < scrollXAdjustedAligned) {
        chrCode = this.gameboy.BGCHRBank1[tileYDown++];
        if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        tile = this.gameboy.tileCache[chrCode];
        texel = tileYLine;
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel]];
      }
      if (pixelPosition < pixelPositionEnd) {
        chrCode = this.gameboy.BGCHRBank1[tileYDown];
        if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        tile = this.gameboy.tileCache[chrCode];
        switch (pixelPositionEnd - pixelPosition) {
          case 7:
            this.gameboy.frameBuffer[pixelPosition + 6] = this.gameboy.backgroundPalette[tile[tileYLine | 6]];
          case 6:
            this.gameboy.frameBuffer[pixelPosition + 5] = this.gameboy.backgroundPalette[tile[tileYLine | 5]];
          case 5:
            this.gameboy.frameBuffer[pixelPosition + 4] = this.gameboy.backgroundPalette[tile[tileYLine | 4]];
          case 4:
            this.gameboy.frameBuffer[pixelPosition + 3] = this.gameboy.backgroundPalette[tile[tileYLine | 3]];
          case 3:
            this.gameboy.frameBuffer[pixelPosition + 2] = this.gameboy.backgroundPalette[tile[tileYLine | 2]];
          case 2:
            this.gameboy.frameBuffer[pixelPosition + 1] = this.gameboy.backgroundPalette[tile[tileYLine | 1]];
          case 1:
            this.gameboy.frameBuffer[pixelPosition] = this.gameboy.backgroundPalette[tile[tileYLine]];
        }
      }
    }
  };

  renderGbcBackgroundLayerWithoutPriorityFlagging(scanline: number) {
    var scrollYAdjusted = this.gameboy.backgroundY + scanline & 0xff; //The line of the BG we're at.
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gameboy.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 0xf8) << 2; //The row of cached tiles we're fetching from.
    var scrollXAdjusted = this.gameboy.backgroundX + this.gameboy.currentX & 0xff; //The scroll amount of the BG.
    var pixelPosition = this.gameboy.pixelStart + this.gameboy.currentX; //Current pixel we're working on.
    var pixelPositionEnd = this.gameboy.pixelStart + (this.gameboy.gfxWindowDisplay && scanline - this.gameboy.windowY >= 0 ? Math.min(Math.max(this.gameboy.windowX, 0) + this.gameboy.currentX, this.gameboy.pixelEnd) : this.gameboy.pixelEnd); //Make sure we do at most 160 pixels a scanline.
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.gameboy.BGCHRBank1[tileNumber];
    if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
      chrCode |= 0x100;
    }
    var attrCode = this.gameboy.BGCHRBank2[tileNumber];
    var tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
    var palette = (attrCode & 0x7) << 2;
    for (var texel = scrollXAdjusted & 0x7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | texel++]];
    }
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 0x100 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while (tileNumber < scrollXAdjustedAligned) {
      chrCode = this.gameboy.BGCHRBank1[++tileNumber];
      if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
        chrCode |= 0x100;
      }
      attrCode = this.gameboy.BGCHRBank2[tileNumber];
      tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
      palette = (attrCode & 0x7) << 2;
      texel = tileYLine;
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
      if (scrollXAdjusted < 0x100) {
        chrCode = this.gameboy.BGCHRBank1[++tileNumber];
        if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.gameboy.BGCHRBank2[tileNumber];
        tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        palette = (attrCode & 0x7) << 2;
        for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
          this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[++texel]];
        }
      }
      scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
      while (tileYDown < scrollXAdjustedAligned) {
        chrCode = this.gameboy.BGCHRBank1[tileYDown];
        if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.gameboy.BGCHRBank2[tileYDown++];
        tile = this.gameboy.tileCache[
          (attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode
        ];
        palette = (attrCode & 0x7) << 2;
        texel = tileYLine;
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel]];
      }
      if (pixelPosition < pixelPositionEnd) {
        chrCode = this.gameboy.BGCHRBank1[tileYDown];
        if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.gameboy.BGCHRBank2[tileYDown];
        tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        palette = (attrCode & 0x7) << 2;
        switch (pixelPositionEnd - pixelPosition) {
          case 7:
            this.gameboy.frameBuffer[pixelPosition + 6] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 6]];
          case 6:
            this.gameboy.frameBuffer[pixelPosition + 5] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 5]];
          case 5:
            this.gameboy.frameBuffer[pixelPosition + 4] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 4]];
          case 4:
            this.gameboy.frameBuffer[pixelPosition + 3] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 3]];
          case 3:
            this.gameboy.frameBuffer[pixelPosition + 2] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 2]];
          case 2:
            this.gameboy.frameBuffer[pixelPosition + 1] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 1]];
          case 1:
            this.gameboy.frameBuffer[pixelPosition] = this.gameboy.gbcBGPalette[palette | tile[tileYLine]];
        }
      }
    }
  }

  renderGbWindowLayer = (scanline: number) => {
    if (this.gameboy.gfxWindowDisplay) {
      //Is the window enabled?
      var scrollYAdjusted = scanline - this.gameboy.windowY; //The line of the BG we're at.
      if (scrollYAdjusted >= 0) {
        var scrollXRangeAdjusted = this.gameboy.windowX > 0 ? this.gameboy.windowX + this.gameboy.currentX : this.gameboy.currentX;
        var pixelPosition = this.gameboy.pixelStart + scrollXRangeAdjusted;
        var pixelPositionEnd = this.gameboy.pixelStart + this.gameboy.pixelEnd;
        if (pixelPosition < pixelPositionEnd) {
          var tileYLine = (scrollYAdjusted & 0x7) << 3;
          var tileNumber = (this.gameboy.gfxWindowCHRBankPosition | (scrollYAdjusted & 0xf8) << 2) + (this.gameboy.currentX >> 3);
          var chrCode = this.gameboy.BGCHRBank1[tileNumber];
          if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
            chrCode |= 0x100;
          }
          var tile = this.gameboy.tileCache[chrCode];
          var texel = scrollXRangeAdjusted - this.gameboy.windowX & 0x7;
          scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
          while (texel < scrollXRangeAdjusted) {
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[tileYLine | texel++]];
          }
          scrollXRangeAdjusted = tileNumber +
            (pixelPositionEnd - pixelPosition >> 3);
          while (tileNumber < scrollXRangeAdjusted) {
            chrCode = this.gameboy.BGCHRBank1[++tileNumber];
            if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            tile = this.gameboy.tileCache[chrCode];
            texel = tileYLine;
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.backgroundPalette[tile[texel]];
          }
          if (pixelPosition < pixelPositionEnd) {
            chrCode = this.gameboy.BGCHRBank1[++tileNumber];
            if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            tile = this.gameboy.tileCache[chrCode];
            switch (pixelPositionEnd - pixelPosition) {
              case 7:
                this.gameboy.frameBuffer[pixelPosition + 6] = this.gameboy.backgroundPalette[tile[tileYLine | 6]];
              case 6:
                this.gameboy.frameBuffer[pixelPosition + 5] = this.gameboy.backgroundPalette[tile[tileYLine | 5]];
              case 5:
                this.gameboy.frameBuffer[pixelPosition + 4] = this.gameboy.backgroundPalette[tile[tileYLine | 4]];
              case 4:
                this.gameboy.frameBuffer[pixelPosition + 3] = this.gameboy.backgroundPalette[tile[tileYLine | 3]];
              case 3:
                this.gameboy.frameBuffer[pixelPosition + 2] = this.gameboy.backgroundPalette[tile[tileYLine | 2]];
              case 2:
                this.gameboy.frameBuffer[pixelPosition + 1] = this.gameboy.backgroundPalette[tile[tileYLine | 1]];
              case 1:
                this.gameboy.frameBuffer[pixelPosition] = this.gameboy.backgroundPalette[tile[tileYLine]];
            }
          }
        }
      }
    }
  };

  renderGbcWindowLayer(scanline: number) {
    if (this.gameboy.gfxWindowDisplay) {
      //Is the window enabled?
      var scrollYAdjusted = scanline - this.gameboy.windowY; //The line of the BG we're at.
      if (scrollYAdjusted >= 0) {
        var scrollXRangeAdjusted = this.gameboy.windowX > 0 ? this.gameboy.windowX + this.gameboy.currentX : this.gameboy.currentX;
        var pixelPosition = this.gameboy.pixelStart + scrollXRangeAdjusted;
        var pixelPositionEnd = this.gameboy.pixelStart + this.gameboy.pixelEnd;
        if (pixelPosition < pixelPositionEnd) {
          var tileYLine = (scrollYAdjusted & 0x7) << 3;
          var tileNumber = (this.gameboy.gfxWindowCHRBankPosition | (scrollYAdjusted & 0xf8) << 2) + (this.gameboy.currentX >> 3);
          var chrCode = this.gameboy.BGCHRBank1[tileNumber];
          if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
            chrCode |= 0x100;
          }
          var attrCode = this.gameboy.BGCHRBank2[tileNumber];
          var tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
          var palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
          var texel = scrollXRangeAdjusted - this.gameboy.windowX & 0x7;
          scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
          while (texel < scrollXRangeAdjusted) {
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | texel++]];
          }
          scrollXRangeAdjusted = tileNumber +
            (pixelPositionEnd - pixelPosition >> 3);
          while (tileNumber < scrollXRangeAdjusted) {
            chrCode = this.gameboy.BGCHRBank1[++tileNumber];
            if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.gameboy.BGCHRBank2[tileNumber];
            tile = this.gameboy.tileCache[
              (attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode
            ];
            palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
            texel = tileYLine;
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel]];
          }
          if (pixelPosition < pixelPositionEnd) {
            chrCode = this.gameboy.BGCHRBank1[++tileNumber];
            if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.gameboy.BGCHRBank2[tileNumber];
            tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
            switch (pixelPositionEnd - pixelPosition) {
              case 7:
                this.gameboy.frameBuffer[pixelPosition + 6] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 6]];
              case 6:
                this.gameboy.frameBuffer[pixelPosition + 5] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 5]];
              case 5:
                this.gameboy.frameBuffer[pixelPosition + 4] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 4]];
              case 4:
                this.gameboy.frameBuffer[pixelPosition + 3] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 3]];
              case 3:
                this.gameboy.frameBuffer[pixelPosition + 2] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 2]];
              case 2:
                this.gameboy.frameBuffer[pixelPosition + 1] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 1]];
              case 1:
                this.gameboy.frameBuffer[pixelPosition] = this.gameboy.gbcBGPalette[palette | tile[tileYLine]];
            }
          }
        }
      }
    }
  }

  renderGbcWindowLayerWithoutPriorityFlagging(scanline: number) {
    if (this.gameboy.gfxWindowDisplay) {
      //Is the window enabled?
      var scrollYAdjusted = scanline - this.gameboy.windowY; //The line of the BG we're at.
      if (scrollYAdjusted >= 0) {
        var scrollXRangeAdjusted = this.gameboy.windowX > 0 ? this.gameboy.windowX + this.gameboy.currentX : this.gameboy.currentX;
        var pixelPosition = this.gameboy.pixelStart + scrollXRangeAdjusted;
        var pixelPositionEnd = this.gameboy.pixelStart + this.gameboy.pixelEnd;
        if (pixelPosition < pixelPositionEnd) {
          var tileYLine = (scrollYAdjusted & 0x7) << 3;
          var tileNumber = (this.gameboy.gfxWindowCHRBankPosition | (scrollYAdjusted & 0xf8) << 2) + (this.gameboy.currentX >> 3);
          var chrCode = this.gameboy.BGCHRBank1[tileNumber];
          if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
            chrCode |= 0x100;
          }
          var attrCode = this.gameboy.BGCHRBank2[tileNumber];
          var tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
          var palette = (attrCode & 0x7) << 2;
          var texel = scrollXRangeAdjusted - this.gameboy.windowX & 0x7;
          scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
          while (texel < scrollXRangeAdjusted) {
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | texel++]];
          }
          scrollXRangeAdjusted = tileNumber + (pixelPositionEnd - pixelPosition >> 3);
          while (tileNumber < scrollXRangeAdjusted) {
            chrCode = this.gameboy.BGCHRBank1[++tileNumber];
            if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.gameboy.BGCHRBank2[tileNumber];
            tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2;
            texel = tileYLine;
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
            this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel]];
          }
          if (pixelPosition < pixelPositionEnd) {
            chrCode = this.gameboy.BGCHRBank1[++tileNumber];
            if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.gameboy.BGCHRBank2[tileNumber];
            tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2;
            switch (pixelPositionEnd - pixelPosition) {
              case 7:
                this.gameboy.frameBuffer[pixelPosition + 6] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 6]];
              case 6:
                this.gameboy.frameBuffer[pixelPosition + 5] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 5]];
              case 5:
                this.gameboy.frameBuffer[pixelPosition + 4] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 4]];
              case 4:
                this.gameboy.frameBuffer[pixelPosition + 3] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 3]];
              case 3:
                this.gameboy.frameBuffer[pixelPosition + 2] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 2]];
              case 2:
                this.gameboy.frameBuffer[pixelPosition + 1] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 1]];
              case 1:
                this.gameboy.frameBuffer[pixelPosition] = this.gameboy.gbcBGPalette[palette | tile[tileYLine]];
            }
          }
        }
      }
    }
  }

  renderGbcBackgroundLayer(scanline: number) {
    var scrollYAdjusted = this.gameboy.backgroundY + scanline & 0xff; //The line of the BG we're at.
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gameboy.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 0xf8) << 2; //The row of cached tiles we're fetching from.
    var scrollXAdjusted = this.gameboy.backgroundX + this.gameboy.currentX & 0xff; //The scroll amount of the BG.
    var pixelPosition = this.gameboy.pixelStart + this.gameboy.currentX; //Current pixel we're working on.
    var pixelPositionEnd = this.gameboy.pixelStart + (this.gameboy.gfxWindowDisplay && scanline - this.gameboy.windowY >= 0 ? Math.min(Math.max(this.gameboy.windowX, 0) + this.gameboy.currentX, this.gameboy.pixelEnd) : this.gameboy.pixelEnd); //Make sure we do at most 160 pixels a scanline.
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.gameboy.BGCHRBank1[tileNumber];
    if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
      chrCode |= 0x100;
    }
    var attrCode = this.gameboy.BGCHRBank2[tileNumber];
    var tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
    var palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
    for (var texel = scrollXAdjusted & 0x7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | texel++]];
    }
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 0x100 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while (tileNumber < scrollXAdjustedAligned) {
      chrCode = this.gameboy.BGCHRBank1[++tileNumber];
      if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
        chrCode |= 0x100;
      }
      attrCode = this.gameboy.BGCHRBank2[tileNumber];
      tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
      palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
      texel = tileYLine;
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
      this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
      if (scrollXAdjusted < 0x100) {
        chrCode = this.gameboy.BGCHRBank1[++tileNumber];
        if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.gameboy.BGCHRBank2[tileNumber];
        tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
        for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
          this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[++texel]];
        }
      }
      scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
      while (tileYDown < scrollXAdjustedAligned) {
        chrCode = this.gameboy.BGCHRBank1[tileYDown];
        if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.gameboy.BGCHRBank2[tileYDown++];
        tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
        texel = tileYLine;
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel++]];
        this.gameboy.frameBuffer[pixelPosition++] = this.gameboy.gbcBGPalette[palette | tile[texel]];
      }
      if (pixelPosition < pixelPositionEnd) {
        chrCode = this.gameboy.BGCHRBank1[tileYDown];
        if (chrCode < this.gameboy.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        attrCode = this.gameboy.BGCHRBank2[tileYDown];
        tile = this.gameboy.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
        switch (pixelPositionEnd - pixelPosition) {
          case 7:
            this.gameboy.frameBuffer[pixelPosition + 6] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 6]];
          case 6:
            this.gameboy.frameBuffer[pixelPosition + 5] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 5]];
          case 5:
            this.gameboy.frameBuffer[pixelPosition + 4] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 4]];
          case 4:
            this.gameboy.frameBuffer[pixelPosition + 3] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 3]];
          case 3:
            this.gameboy.frameBuffer[pixelPosition + 2] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 2]];
          case 2:
            this.gameboy.frameBuffer[pixelPosition + 1] = this.gameboy.gbcBGPalette[palette | tile[tileYLine | 1]];
          case 1:
            this.gameboy.frameBuffer[pixelPosition] = this.gameboy.gbcBGPalette[palette | tile[tileYLine]];
        }
      }
    }
  }

  renderGbSpriteLayer = (scanlineToRender: number) => {
    if (!this.gameboy.gfxSpriteShow) return;

    const lineAdjusted = scanlineToRender + 0x10;
    let OAMAddress = 0xfe00;
    let yoffset = 0;
    let xcoord = 1;
    let xCoordStart = 0;
    let xCoordEnd = 0;
    let attrCode = 0;
    let palette = 0;
    let tile = null;
    let data = 0;
    let spriteCount = 0;
    let currentPixel = 0;
    let linePixel = 0;
    //Clear our x-coord sort buffer:
    while (xcoord < 168) {
      this.gameboy.sortBuffer[xcoord++] = 0xff;
    }
    if (this.gameboy.gfxSpriteNormalHeight) {
      //Draw the visible sprites:
      for (
        let length = this.gameboy.findLowestSpriteDrawable(lineAdjusted, 0x7);
        spriteCount < length;
        ++spriteCount
      ) {
        OAMAddress = this.gameboy.OAMAddressCache[spriteCount];
        yoffset = lineAdjusted - this.gameboy.memory[OAMAddress] << 3;
        attrCode = this.gameboy.memory[OAMAddress | 3];
        palette = (attrCode & 0x10) >> 2;
        tile = this.gameboy.tileCache[(attrCode & 0x60) << 4 | this.gameboy.memory[OAMAddress | 0x2]];
        linePixel = xCoordStart = this.gameboy.memory[OAMAddress | 1];
        xCoordEnd = Math.min(168 - linePixel, 8);
        xcoord = linePixel > 7 ?
          0 :
          8 - linePixel;
        for (
          currentPixel = this.gameboy.pixelStart + (linePixel > 8 ? linePixel - 8 : 0);
          xcoord < xCoordEnd;
          ++xcoord, ++currentPixel, ++linePixel
        ) {
          if (this.gameboy.sortBuffer[linePixel] > xCoordStart) {
            if (this.gameboy.frameBuffer[currentPixel] >= 0x2000000) {
              data = tile[yoffset | xcoord];
              if (data > 0) {
                this.gameboy.frameBuffer[currentPixel] = this.gameboy.OBJPalette[palette | data];
                this.gameboy.sortBuffer[linePixel] = xCoordStart;
              }
            } else if (this.gameboy.frameBuffer[currentPixel] < 0x1000000) {
              data = tile[yoffset | xcoord];
              if (data > 0 && attrCode < 0x80) {
                this.gameboy.frameBuffer[currentPixel] = this.gameboy.OBJPalette[palette | data];
                this.gameboy.sortBuffer[linePixel] = xCoordStart;
              }
            }
          }
        }
      }
    } else {
      //Draw the visible sprites:
      for (
        let length = this.gameboy.findLowestSpriteDrawable(lineAdjusted, 0xf);
        spriteCount < length;
        ++spriteCount
      ) {
        OAMAddress = this.gameboy.OAMAddressCache[spriteCount];
        yoffset = lineAdjusted - this.gameboy.memory[OAMAddress] << 3;
        attrCode = this.gameboy.memory[OAMAddress | 3];
        palette = (attrCode & 0x10) >> 2;
        if ((attrCode & 0x40) === (0x40 & yoffset)) {
          tile = this.gameboy.tileCache[(attrCode & 0x60) << 4 | this.gameboy.memory[OAMAddress | 0x2] & 0xfe];
        } else {
          tile = this.gameboy.tileCache[(attrCode & 0x60) << 4 | this.gameboy.memory[OAMAddress | 0x2] | 1];
        }
        yoffset &= 0x3f;
        linePixel = xCoordStart = this.gameboy.memory[OAMAddress | 1];
        xCoordEnd = Math.min(168 - linePixel, 8);
        xcoord = linePixel > 7 ? 0 : 8 - linePixel;
        for (
          currentPixel = this.gameboy.pixelStart + (linePixel > 8 ? linePixel - 8 : 0);
          xcoord < xCoordEnd;
          ++xcoord, ++currentPixel, ++linePixel
        ) {
          if (this.gameboy.sortBuffer[linePixel] > xCoordStart) {
            if (this.gameboy.frameBuffer[currentPixel] >= 0x2000000) {
              data = tile[yoffset | xcoord];
              if (data > 0) {
                this.gameboy.frameBuffer[currentPixel] = this.gameboy.OBJPalette[palette | data];
                this.gameboy.sortBuffer[linePixel] = xCoordStart;
              }
            } else if (this.gameboy.frameBuffer[currentPixel] < 0x1000000) {
              data = tile[yoffset | xcoord];
              if (data > 0 && attrCode < 0x80) {
                this.gameboy.frameBuffer[currentPixel] = this.gameboy.OBJPalette[palette | data];
                this.gameboy.sortBuffer[linePixel] = xCoordStart;
              }
            }
          }
        }
      }
    }

  };

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
            this.gameboy.interruptRequestedFlags |= 0x2;
          }
          this.gameboy.incrementScanlineQueue();
        }
        if (this.gameboy.hdmaRunning) {
          this.gameboy.executeHDMA();
        }
        if (this.gameboy.mode0TriggerSTAT) {
          this.gameboy.interruptRequestedFlags |= 0x2;
        }
      }

      //Update the scanline registers and assert the LYC counter:
      this.gameboy.actualScanline = ++this.gameboy.memory[0xff44];

      //Perform a LYC counter assert:
      if (this.gameboy.actualScanline === this.gameboy.memory[0xff45]) {
        this.gameboy.memory[0xff41] |= 0x04;
        if (this.gameboy.LYCMatchTriggerSTAT) {
          this.gameboy.interruptRequestedFlags |= 0x2;
        }
      } else {
        this.gameboy.memory[0xff41] &= 0x7b;
      }
      this.gameboy.checkIrqMatching();
      //Reset our mode contingency variables:
      this.gameboy.STATTracker = 0;
      this.gameboy.modeSTAT = 2;
      this.scanlineProcessors[this.gameboy.actualScanline](); //Scan Line and STAT Mode Control.
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
            this.gameboy.interruptRequestedFlags |= 0x2;
          }
          this.gameboy.incrementScanlineQueue();
        }
        if (this.gameboy.hdmaRunning) {
          this.gameboy.executeHDMA();
        }
        if (this.gameboy.mode0TriggerSTAT) {
          this.gameboy.interruptRequestedFlags |= 0x2;
        }
      }
      // Update the scanline registers and assert the LYC counter:
      this.gameboy.actualScanline = this.gameboy.memory[0xff44] = 144;
      // Perform a LYC counter assert:
      if (this.gameboy.memory[0xff45] === 144) {
        this.gameboy.memory[0xff41] |= 0x04;
        if (this.gameboy.LYCMatchTriggerSTAT) {
          this.gameboy.interruptRequestedFlags |= 0x2;
        }
      } else {
        this.gameboy.memory[0xff41] &= 0x7b;
      }
      //Reset our mode contingency variables:
      this.gameboy.STATTracker = 0;
      //Update our state for v-blank:
      this.gameboy.modeSTAT = 1;
      this.gameboy.interruptRequestedFlags |= this.gameboy.mode1TriggerSTAT ? 0x3 : 0x1;
      this.gameboy.checkIrqMatching();
      //Attempt to blit out to our canvas:
      if (this.gameboy.drewBlank === 0) {
        //Ensure JIT framing alignment:
        if (this.gameboy.cpu.totalLinesPassed < 144 || this.gameboy.cpu.totalLinesPassed === 144 && this.gameboy.midScanlineOffset > -1) {
          //Make sure our gfx are up-to-date:
          this.gameboy.graphicsJITVBlank();
          //Draw the frame:
          this.gameboy.lcdDevice.outputFrameBuffer();
        }
      } else {
        //LCD off takes at least 2 frames:
        --this.gameboy.drewBlank;
      }
      this.scanlineProcessors[144](); // Scanline and STAT Mode Control.
    }
  };

  runVBlankScanline = () => {
    if (this.gameboy.LCDTicks >= 456) {
      // We're on a new scan line:
      this.gameboy.LCDTicks -= 456;
      this.gameboy.actualScanline = ++this.gameboy.memory[0xff44];
      // Perform a LYC counter assert:
      if (this.gameboy.actualScanline === this.gameboy.memory[0xff45]) {
        this.gameboy.memory[0xff41] |= 0x04;
        if (this.gameboy.LYCMatchTriggerSTAT) {
          this.gameboy.interruptRequestedFlags |= 0x2;
          this.gameboy.checkIrqMatching();
        }
      } else {
        this.gameboy.memory[0xff41] &= 0x7b;
      }
      this.scanlineProcessors[this.gameboy.actualScanline](); // Scan Line and STAT Mode Control.
    }
  };

  runLastVBlankScanline = () => {
    if (this.gameboy.LCDTicks >= 8) {
      if (
        this.gameboy.STATTracker !== 4 &&
        this.gameboy.memory[0xff44] === 153
      ) {
        this.gameboy.memory[0xff44] = 0; //LY register resets to 0 early.
        // Perform a LYC counter assert:
        if (this.gameboy.memory[0xff45] === 0) {
          this.gameboy.memory[0xff41] |= 0x04;
          if (this.gameboy.LYCMatchTriggerSTAT) {
            this.gameboy.interruptRequestedFlags |= 0x2;
            this.gameboy.checkIrqMatching();
          }
        } else {
          this.gameboy.memory[0xff41] &= 0x7b;
        }
        this.gameboy.STATTracker = 4;
      }

      if (this.gameboy.LCDTicks >= 456) {
        // We reset back to the beginning:
        this.gameboy.LCDTicks -= 456;
        this.gameboy.STATTracker = this.gameboy.actualScanline = 0;
        this.scanlineProcessors[0](); // Scan Line and STAT Mode Control.
      }
    }
  };
}