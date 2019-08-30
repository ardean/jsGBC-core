export default class NoiseGeneratorNode extends AudioWorkletNode {
  amplitude: Float32Array;

  constructor(context: AudioContext) {
    super(context, "noise-generator", {
      parameterData: {
        amplitude: 0.6
      }
    });
  }
}