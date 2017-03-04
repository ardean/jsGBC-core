import settings from "../settings";
import $ from "jquery";

export function toTypedArray(baseArray, memtype) {
  try {
    if (settings.disallowTypedArrays) {
      return baseArray;
    }
    if (!baseArray || !baseArray.length) {
      return [];
    }
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

export function fromTypedArray(baseArray) {
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

export function getTypedArray(length, defaultValue, numberType) {
  let arrayHandle;
  try {
    if (settings.disallowTypedArrays) {
      throw (new Error("Settings forced typed arrays to be disabled."));
    }
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
    }
    if (defaultValue !== 0) {
      let index = 0;
      while (index < length) {
        arrayHandle[index++] = defaultValue;
      }
    }
  } catch (error) {
    console.log("Could not convert an array to a typed array: " + error.message, 1);
    arrayHandle = [];
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

export function downloadFile(filename, arrayBuffer) {
  const blob = new Blob([new Uint8Array(arrayBuffer)], { type: "application/octet-binary" });
  const $a = $("<a />");
  const a = $a.get(0);
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  $a.appendTo("body");
  a.click();
  $a.remove();
  URL.revokeObjectURL(url);
}

export function uploadFile(extensions) {
  return new Promise((resolve) => {
    const $input = $("<input type='file' accept='" + extensions.map(extension => "." + extension).join(", ") + "' />");
    $input.one("change", function () {
      if (this.files.length > 0) {
        const file = this.files[0];
        const binaryHandle = new FileReader();
        binaryHandle.addEventListener("load", function () {
          if (this.readyState === 2) {
            resolve(this.result);
          }
        });
        binaryHandle.readAsBinaryString(file);
      }
    });
    $input.click();
  });
}

export default {
  getTypedArray,
  fromTypedArray,
  toTypedArray,
  uploadFile,
  downloadFile
};

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
