export default class ROM {
  data: Uint8Array;

  constructor(data: Uint8Array | ArrayBuffer) {
    if (data instanceof Uint8Array) {
      this.data = data;
    } else {
      this.data = new Uint8Array(data);
    }
  }

  getByte(index: number): number {
    return this.data[index];
  }

  getChar(index: number): string {
    return String.fromCharCode(this.getByte(index));
  }

  getString(from: number, to: number): string {
    let text = "";
    for (let index = from; index <= to; index++) {
      text += this.getChar(index);
    }

    return text;
  }

  get length() {
    return this.data.byteLength;
  }
}
