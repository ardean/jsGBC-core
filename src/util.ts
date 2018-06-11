import JSZip from "jszip";
import * as FileSaver from "file-saver";

export function toTypedArray(baseArray, memtype) { // TODO: remove
  try {
    if (!baseArray || !(baseArray.length < 1)) return [];

    var length = baseArray.length;

    let typedArrayTemp;
    switch (memtype) {
      case "uint8":
        typedArrayTemp = new Uint8Array(length);
        break;
      case "int8":
        typedArrayTemp = new Int8Array(length);
        break;
      case "int32":
        typedArrayTemp = new Int32Array(length);
        break;
      case "float32":
        typedArrayTemp = new Float32Array(length);
    }

    for (var index = 0; index < length; index++) {
      typedArrayTemp[index] = baseArray[index];
    }

    return typedArrayTemp;
  } catch (error) {
    console.log("Could not convert an array to a typed array: " + error.message, 1);
    return baseArray;
  }
}

export function fromTypedArray(baseArray) { // TODO: remove
  try {
    if (!baseArray || !baseArray.length) {
      return [];
    }
    var arrayTemp = [];
    for (var index = 0; index < baseArray.length; ++index) {
      arrayTemp[index] = baseArray[index];
    }
    return arrayTemp;
  } catch (error) {
    console.log("Conversion from a typed array failed: " + error.message, 1);
    return baseArray;
  }
}

export type TypedArray = Int8Array | Uint8Array | Int32Array | Float32Array;

export function getTypedArray(length, defaultValue, numberType): TypedArray { // TODO: remove and use fillTypedArray
  let arrayHandle;
  switch (numberType) {
    case "int8":
      arrayHandle = new Int8Array(length);
      break;
    case "uint8":
      arrayHandle = new Uint8Array(length);
      break;
    case "int32":
      arrayHandle = new Int32Array(length);
      break;
    case "float32":
      arrayHandle = new Float32Array(length);
      break;
    default:
      break;
  }

  if (defaultValue !== 0) {
    let index = 0;
    while (index < length) {
      arrayHandle[index++] = defaultValue;
    }
  }

  return arrayHandle;
}

export function stringToArrayBuffer(data) {
  const array = new Uint8Array(data.length);
  for (let i = 0, strLen = data.length; i < strLen; i++) {
    array[i] = data.charCodeAt(i);
  }

  return array;
}

export async function fetchFileAsArrayBuffer(url) {
  const res = await fetch(url);
  return await res.arrayBuffer(); // Chrome, Opera, Firefox and Edge support only!
}

export function concatArrayBuffers(...buffers) {
  let totalLength = 0;
  for (let i = 0; i < buffers.length; i++) {
    totalLength += buffers[i].byteLength;
  }

  const array = new Uint8Array(totalLength);

  for (let i = 0; i < buffers.length; i++) {
    const typedArray = new Uint8Array(buffers[i]);
    if (i === 0) {
      array.set(typedArray);
    } else {
      array.set(typedArray, buffers[i - 1].byteLength);
    }
  }

  return array.buffer;
}

export function saveAs(file: Blob | ArrayBuffer | Uint8Array, filename?: string) {
  if (file instanceof ArrayBuffer) {
    file = new Uint8Array(file);
  }

  if (file instanceof Uint8Array) {
    file = new Blob([file], { type: "application/octet-binary" });
  }

  FileSaver.saveAs(file, filename);
}

export type Debounced = (() => any) & { clear?(), flush?() };

export async function readBlob(file: Blob): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    if (file) {
      const binaryHandle = new FileReader();
      binaryHandle.addEventListener("load", function () {
        if (this.readyState === 2) {
          resolve(this.result);
        }
      });
      binaryHandle.readAsArrayBuffer(file);
    } else {
      reject();
    }
  });
}

export async function readCartridgeROM(blob: Blob, filename: string = ""): Promise<ArrayBuffer> {
  let buffer = await readBlob(blob);

  if (hasExtension(filename, "zip")) {
    const decodedZip = await JSZip.loadAsync(buffer);
    const filenames = Object.keys(decodedZip.files);
    const validFilenames = filenames.filter(x => hasExtension(x, "gbc") || hasExtension(x, "gb"));
    if (validFilenames.length > 0) {
      buffer = await decodedZip.file(validFilenames[0]).async("arraybuffer");
    } else {
      buffer = null;
    }
  }

  return buffer;
}

export function hasExtension(filename: string, extension: string): boolean {
  filename = filename.toLowerCase();
  extension = "." + extension.toLowerCase();
  return filename.lastIndexOf(extension) === filename.length - extension.length;
}

export function debounce(func, wait, immediate?): Debounced {
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced: Debounced = function () {
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  debounced.flush = function () {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;

      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};