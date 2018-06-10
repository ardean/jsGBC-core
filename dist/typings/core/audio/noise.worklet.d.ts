declare class NoiseGeneratorWorklet extends AudioWorkletProcessor {
    static readonly parameterDescriptors: {
        name: string;
        defaultValue: number;
        minValue: number;
        maxValue: number;
    }[];
    process(inputs: any, outputs: any, parameters: any): boolean;
}
