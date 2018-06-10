declare module "*.worklet" {
  const exportString: string;
  export default exportString;
}

declare class AudioWorkletProcessor {
  constructor(options: any);
}

declare var registerProcessor;

declare class AudioWorkletNode extends AudioNode {
  parameters: any;

  constructor(context: AudioContext, workletName: string);
}