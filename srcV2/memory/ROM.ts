export default class ROM {
  constructor(
    public buffer: Uint8Array
  ) { }

  readByte(index: number): number {
    return this.buffer[index];
  }

  readChar(index: number): string {
    return String.fromCharCode(this.readByte(index));
  }

  readString(from: number, to: number): string {
    let text = "";
    for (let index = from; index <= to; index++) {
      text += this.readChar(index);
    }

    return text;
  }

  get length() {
    return this.buffer.byteLength;
  }
}
