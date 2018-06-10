export default class NoiseGeneratorNode extends AudioWorkletNode {
  constructor(context: AudioContext) {
    super(context, "noise-generator");
  }
}