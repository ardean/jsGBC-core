export default class ROM {
  constructor(data) {
    if (data instanceof ArrayBuffer) {
      this.data = new Uint8Array(data);
    } else if (typeof data === "string") {
      const dataLength = data.length;
      const buffer = new ArrayBuffer(dataLength);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < dataLength; i++) {
        view[i] = data.charCodeAt(i);
      }
      this.data = view;
    } else {
      this.data = data;
    }
  }

  getByte(index) {
    return this.data[index];
  }

  getChar(index) {
    return String.fromCharCode(this.data[index]);
  }

  getString(from, to) {
    let text = "";
    for (let index = from; index <= to; index++) {
      if (this.getByte(index) > 0) {
        text += this.getChar(index);
      }
    }

    return text;
  }

  get length() {
    return this.data.length;
  }
}
