import * as util from "../../util";
import GameBoyCore from "../GameBoyCore";

export default class LcdDevice {
  context: any;
  offscreenContext: any;
  gameboy: GameBoyCore;
  offscreenWidth: number;
  offscreenHeight: number;
  offscreenRgbaCount: number;
  width: number;
  height: number;
  swizzledFrame: Uint8Array; // The secondary gfx buffer that holds the converted RGBA values.
  canvasBuffer: any; // imageData handle
  newFrameAvailable: boolean;
  resizer: any;
  drewBlank: number;
  colorizedGbPalettes: any;
  offscreenCanvas: any;
  canvas: any;
  resizePathClear: boolean;
  offscreenRgbCount: number;

  constructor({
    canvas,
    context,
    offscreenCanvas,
    offscreenContext,
    gameboy,
    width,
    height
  }) {
    this.canvas = canvas;
    this.context = context;
    this.offscreenCanvas = offscreenCanvas;
    this.offscreenContext = offscreenContext;
    this.gameboy = gameboy;
    this.offscreenWidth = 160;
    this.offscreenHeight = 144;
    this.offscreenRgbCount = this.offscreenWidth * this.offscreenHeight * 3;
    this.offscreenRgbaCount = this.offscreenWidth * this.offscreenHeight * 4;
    this.width = width || this.offscreenWidth;
    this.height = height || this.offscreenHeight;

    this.resizePathClear = true;

    if (typeof document !== "undefined") {
      if (!this.canvas) this.canvas = document.createElement("canvas");
      if (!this.offscreenCanvas) this.offscreenCanvas = document.createElement("canvas");
    }

    if (this.canvas) {
      this.canvas.height = this.height;
      this.canvas.width = this.width;

      if (!this.context) this.context = this.canvas.getContext("2d");
    }

    if (this.offscreenCanvas) {
      this.offscreenCanvas.height = this.offscreenHeight;
      this.offscreenCanvas.width = this.offscreenWidth;

      if (!this.offscreenContext) this.offscreenContext = this.offscreenCanvas.getContext("2d");
    }

    if (!this.context) {
      throw new Error("please provide a canvas context in the lcd options");
    }

    if (!this.offscreenContext) {
      throw new Error("please provide a canvas offscreen context in the lcd options");
    }
  }

  init() {
    this.offscreenContext.msImageSmoothingEnabled = false;
    this.offscreenContext.mozImageSmoothingEnabled = false;
    this.offscreenContext.webkitImageSmoothingEnabled = false;
    this.offscreenContext.imageSmoothingEnabled = false;

    this.context.msImageSmoothingEnabled = false;
    this.context.mozImageSmoothingEnabled = false;
    this.context.webkitImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;

    this.canvasBuffer = this.offscreenContext.createImageData(
      this.offscreenWidth,
      this.offscreenHeight
    );

    let index = this.offscreenRgbaCount;
    while (index > 0) {
      index -= 4;
      this.canvasBuffer.data[index] = 0xf8;
      this.canvasBuffer.data[index + 1] = 0xf8;
      this.canvasBuffer.data[index + 2] = 0xf8;
      this.canvasBuffer.data[index + 3] = 0xff; // opacity
    }

    this.copyToCanvas();

    if (!this.swizzledFrame) {
      this.swizzledFrame = util.getTypedArray(
        this.offscreenRgbCount,
        0xff,
        "uint8"
      ) as Uint8Array;
    }

    // Test the draw system and browser vblank latching:
    this.newFrameAvailable = true; // Copy the latest graphics to buffer.
    this.requestDraw();
  }

  copyToCanvas() {
    if (
      this.offscreenWidth === this.width &&
      this.offscreenHeight === this.height
    ) {
      this.context.putImageData(this.canvasBuffer, 0, 0);
    } else {
      this.offscreenContext.putImageData(this.canvasBuffer, 0, 0);
      this.context.drawImage(
        this.offscreenCanvas,
        0,
        0,
        this.width,
        this.height
      );
    }
  }

  requestDraw() {
    if (this.newFrameAvailable) {
      if (this.offscreenRgbaCount > 0) {
        // We actually updated the graphics internally, so copy out:
        if (this.offscreenRgbaCount === 92160) {
          this.processDraw();
        }
      }
    }
  }

  processDraw() {
    const canvasData = this.canvasBuffer.data;
    let bufferIndex = 0;
    let canvasIndex = 0;

    while (canvasIndex < this.offscreenRgbaCount) {
      canvasData[canvasIndex++] = this.swizzledFrame[bufferIndex++];
      canvasData[canvasIndex++] = this.swizzledFrame[bufferIndex++];
      canvasData[canvasIndex++] = this.swizzledFrame[bufferIndex++];
      ++canvasIndex;
    }

    this.copyToCanvas();
    this.newFrameAvailable = false;
  }

  prepareFrame() {
    // Copy the internal frame buffer to the output buffer:
    this.swizzleFrameBuffer();
    this.newFrameAvailable = true;
  }

  swizzleFrameBuffer() {
    // Convert our dirty 24-bit (24-bit, with internal render flags above it) framebuffer to an 8-bit buffer with separate indices for the RGB channels:
    const frameBuffer = this.gameboy.frameBuffer;
    const swizzledFrame = this.swizzledFrame;
    let bufferIndex = 0;
    let canvasIndex = 0;
    while (canvasIndex < this.offscreenRgbCount) {
      swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex] >> 16 & 0xff; // red
      swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex] >> 8 & 0xff; // green
      swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex] & 0xff; // blue
      ++bufferIndex;
    }
  }

  turnOff() {
    if (this.drewBlank === 0) {
      // Output a blank screen to the output framebuffer:
      this.clearFrameBuffer();
      this.newFrameAvailable = true;
    }
    this.drewBlank = 2;
  }

  clearFrameBuffer() {
    const frameBuffer = this.swizzledFrame;
    let bufferIndex = 0;
    if (
      this.gameboy.cartridge.useGbcMode ||
      this.colorizedGbPalettes
    ) {
      while (bufferIndex < this.offscreenRgbCount) {
        frameBuffer[bufferIndex++] = 248;
      }
    } else {
      while (bufferIndex < this.offscreenRgbCount) {
        frameBuffer[bufferIndex++] = 239;
        frameBuffer[bufferIndex++] = 255;
        frameBuffer[bufferIndex++] = 222;
      }
    }
  }
}
