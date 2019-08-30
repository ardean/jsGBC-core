import * as util from "../util";
import LCDRange from "../memory/LCDRange";
import VideoRAM from "../memory/VideoRAM";

const FRAME_WIDTH = 160;
const FRAME_HEIGHT = 144;

interface ImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface CanvasLike {
  getContext(contextId: "2d", contextAttributes?: CanvasRenderingContext2DSettings): ContextLike;
}

export type Canvas = CanvasLike | HTMLCanvasElement;

export interface ContextLike {
  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
  clearRect(x: number, y: number, w: number, h: number): void;
  putImageData(imageData: ImageData, dx: number, dy: number): void;
  drawImage(canvas: CanvasLike, dx: number, dy: number): void;
}

export default class GPU {
  private lcdRange: LCDRange;
  private videoRAM: VideoRAM;
  private canvas: CanvasLike;
  private context: ContextLike;
  private image: ImageData;
  private framebuffer: Uint8ClampedArray;

  constructor(lcdRange: LCDRange, videoRAM: VideoRAM, canvas: Canvas) {
    this.lcdRange = lcdRange;
    this.videoRAM = videoRAM;
    this.canvas = canvas as CanvasLike;
    this.context = this.canvas.getContext("2d");
    this.image = this.context.getImageData(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
    this.framebuffer = this.image.data;
  }

  drawLine(lineIndex: number) {
    // console.log("draw line");
    if (this.lcdRange.backgroundEnabled) {
      this.drawBackground(lineIndex);
    }

    if (this.lcdRange.windowEnabled) {
      this.drawWindow(lineIndex);
    }

    if (this.lcdRange.spritesEnabled) {
      this.drawSprites(lineIndex);
    }
  }

  drawBackground(lineIndex: number) {
    const backgroundMap = this.videoRAM.backgroundMaps[this.lcdRange.backgroundMapIndex];
    const yPosition = this.lcdRange.backgroundY + lineIndex;

    for (let index = 0; index < FRAME_WIDTH; index++) {
      const xPosition = this.lcdRange.backgroundX + index;

      const column = (xPosition & 0xFF) >> 3;
      const row = (yPosition & 0xFF) >> 3;

      const n = backgroundMap[row * 32 + column];
      const tileIndex = this.lcdRange.bankOffset ? n : 0x80 + n;
      const tile = this.videoRAM.tiles[tileIndex];
      const shade = this.lcdRange.backgroundPalette[tile[yPosition & 7][xPosition & 7]];

      const framebufferOffset = (lineIndex * FRAME_WIDTH + index) * 4;
      this.framebuffer[framebufferOffset] = shade[0];
      this.framebuffer[framebufferOffset + 1] = shade[1];
      this.framebuffer[framebufferOffset + 2] = shade[2];
      this.framebuffer[framebufferOffset + 3] = 0xFF;
    }
  }

  drawWindow(lineIndex: number) {
    console.log("draw sprites");
    for (let index = 0; index < FRAME_WIDTH; index++) {
      let offset = (lineIndex * FRAME_WIDTH + index) * 4;
      this.framebuffer[offset] = 0;
      this.framebuffer[offset + 1] = 0;
      this.framebuffer[offset + 2] = 255;
      this.framebuffer[offset + 3] = 255;
    }
  }

  drawSprites(lineIndex: number) {
    console.log("draw sprites");
    for (let index = 0; index < FRAME_WIDTH; index++) {
      let offset = (lineIndex * FRAME_WIDTH + index) * 4;
      this.framebuffer[offset] = 0;
      this.framebuffer[offset + 1] = 255;
      this.framebuffer[offset + 2] = 0;
      this.framebuffer[offset + 3] = 255;
    }
  }

  render() {
    if (this.lcdRange.enabled) {
      this.context.putImageData(this.image, 0, 0);
      this.context.drawImage(this.canvas, 0, 0);
    } else {
      this.context.clearRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
    }
  }
}