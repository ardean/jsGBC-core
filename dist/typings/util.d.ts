export declare function toTypedArray(baseArray: any, memtype: any): any;
export declare function fromTypedArray(baseArray: any): any;
export declare type TypedArray = Int8Array | Uint8Array | Int32Array | Float32Array;
export declare function getTypedArray(length: any, defaultValue: any, numberType: any): TypedArray;
export declare function stringToArrayBuffer(data: any): Uint8Array;
export declare function fetchFileAsArrayBuffer(url: any): Promise<ArrayBuffer>;
export declare function concatArrayBuffers(...buffers: any[]): ArrayBuffer;
export declare function saveAs(file: Blob | ArrayBuffer | Uint8Array, filename?: string): void;
export declare type Debounced = (() => any) & {
    clear?(): any;
    flush?(): any;
};
export declare function readBlob(file: Blob): Promise<ArrayBuffer>;
export declare function readCartridgeROM(blob: Blob, filename?: string): Promise<ArrayBuffer>;
export declare function hasExtension(filename: string, extension: string): boolean;
export declare function debounce(func: any, wait: any, immediate?: any): Debounced;
