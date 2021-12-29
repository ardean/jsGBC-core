class NoiseGeneratorWorklet extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: "amplitude", defaultValue: 0.5, minValue: 0, maxValue: 1 }
    ];
  }

  process(inputs, outputs, parameters: Record<string, Float32Array>) {
    let output = outputs[0];

    for (let channel = 0; channel < output.length; ++channel) {
      let outputChannel = output[channel];
      for (let i = 0; i < outputChannel.length; ++i) {
        outputChannel[i] = Math.sin(i);
      }
    }

    return true;
  }
}

registerProcessor("noise-generator", NoiseGeneratorWorklet);