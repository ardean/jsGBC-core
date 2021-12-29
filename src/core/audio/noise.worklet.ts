class NoiseGeneratorWorklet extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: "amplitude", defaultValue: 0.5, minValue: 0, maxValue: 1 }
    ];
  }

  process(inputs, outputs, parameters: Record<string, Float32Array>) {
    let output = outputs[0];

    for (let channelIndex = 0; channelIndex < output.length; ++channelIndex) {
      let outputChannel = output[channelIndex];

      for (let dataIndex = 0; dataIndex < outputChannel.length; ++dataIndex) {
        outputChannel[dataIndex] = Math.sin(dataIndex);
      }
    }

    return true;
  }
}

registerProcessor("noise-generator", NoiseGeneratorWorklet);