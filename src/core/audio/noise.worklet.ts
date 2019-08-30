class NoiseGeneratorWorklet extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: "amplitude", defaultValue: 0.5, minValue: 0, maxValue: 1 }
    ];
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, Float32Array>) {
    let output = outputs[0];
    let amplitude = parameters["amplitude"];

    console.log(amplitude);

    for (const outputChannel of output) {
      for (let i = 0; i < outputChannel.length; ++i) {
        outputChannel[i] = Math.sin(i);
      }
    }

    return true;
  }
}

registerProcessor("noise-generator", NoiseGeneratorWorklet);