export default class Resampler {
  ratioWeight: number;
  lastWeight: number;
  tailExists: boolean;
  outputBuffer: Float32Array;
  lastOutput: Float32Array;

  constructor(
    private fromSampleRate: number,
    private toSampleRate: number,
    private channels: number,
    private outputBufferSize: number
  ) {
    if (
      this.fromSampleRate <= 0 ||
      this.toSampleRate <= 0 ||
      this.channels <= 0
    ) throw new Error("Invalid settings specified for the resampler.");

    this.ratioWeight = this.fromSampleRate / this.toSampleRate;
    if (this.fromSampleRate < this.toSampleRate) {
      this.lastWeight = 1;
    }

    this.outputBuffer = new Float32Array(this.outputBufferSize);
    this.lastOutput = new Float32Array(this.channels);
  }

  resample(buffer: Float32Array) {
    let bufferLength = buffer.length;

    if ((bufferLength % this.channels) !== 0) throw new Error("Buffer was of incorrect sample length.");
    if (bufferLength === 0) return;

    let weight = this.lastWeight;
    let firstWeight = 0;
    let secondWeight = 0;
    let sourceOffset = 0;
    let outputOffset = 0;

    for (; weight < 1; weight += this.ratioWeight) {
      secondWeight = weight % 1;
      firstWeight = 1 - secondWeight;

      for (let channel = 0; channel < this.channels; channel++) {
        this.outputBuffer[outputOffset++] = (
          (
            this.lastOutput[channel] *
            firstWeight
          ) +
          (
            buffer[channel] *
            secondWeight
          )
        );
      }
    }

    weight -= 1;

    for (
      bufferLength -= this.channels, sourceOffset = Math.floor(weight) * this.channels;
      outputOffset < this.outputBufferSize && sourceOffset < bufferLength;
    ) {
      secondWeight = weight % 1;
      firstWeight = 1 - secondWeight;

      for (let channel = 0; channel < this.channels; channel++) {
        this.outputBuffer[outputOffset++] = (
          (
            buffer[sourceOffset + channel] *
            firstWeight
          ) +
          (
            buffer[sourceOffset + this.channels + channel] *
            secondWeight
          )
        );
      }

      weight += this.ratioWeight;
      sourceOffset = Math.floor(weight) * this.channels;
    }

    for (let channel = 0; channel < this.channels; ++channel) {
      this.lastOutput[channel] = buffer[sourceOffset++];
    }

    this.lastWeight = weight % 1;

    return outputOffset;
  }
}
