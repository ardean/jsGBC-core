export default class Resampler {
    resampler: Function;
    fromSampleRate: any;
    toSampleRate: any;
    channels: number;
    outputBufferSize: any;
    noReturn: boolean;
    ratioWeight: number;
    lastWeight: number;
    tailExists: boolean;
    outputBuffer: any;
    lastOutput: Float32Array;
    constructor(fromSampleRate: any, toSampleRate: any, channels: any, outputBufferSize: any, noReturn: any);
    initialize(): void;
    compileLinearInterpolationFunction(): void;
    compileMultiTapFunction(): void;
    bypassResampler(buffer: any): any;
    bufferSlice(sliceAmount: any): any;
    initializeBuffers(): void;
}
