import settings from "../settings";

export function toTypedArray(baseArray, memtype) { // TODO: remove
  try {
    if (!baseArray || !baseArray.length < 1) return [];

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

export function getTypedArray(length, defaultValue, numberType) { // TODO: remove and use fillTypedArray
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

export function downloadFile(filename, arrayBuffer) {
  const a = document.createElement("a");
  const blob = new Blob([new Uint8Array(arrayBuffer)], { type: "application/octet-binary" });
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.parentNode.removeChild(a);
  URL.revokeObjectURL(url);
}

export function uploadFile(extensions) {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = extensions.map(extension => "." + extension).join(", ");

    function inputChange() {
      if (this.files.length > 0) {
        const file = this.files[0];
        const binaryHandle = new FileReader();
        binaryHandle.addEventListener("load", function () {
          if (this.readyState === 2) {
            resolve(this.result);
          }
        });
        binaryHandle.readAsArrayBuffer(file);
      }
      input.removeEventListener("change", inputChange);
    }

    input.addEventListener("change", inputChange);
    input.click();
  });
}
