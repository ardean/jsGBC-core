export const blobToUint8Array = async (blob: Blob) => {
  return new Promise<Uint8Array>(resolve => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(new Uint8Array(reader.result as ArrayBuffer));
    });
    reader.readAsArrayBuffer(blob);
  });
};