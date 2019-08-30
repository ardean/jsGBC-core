import Channel from "./Channel";
import SquareWaveChannel from "./SquareWaveChannel";

export default class APU {
  audioContext: AudioContext;

  squareWave1: OscillatorNode;
  squareWave1Enabled: boolean = false;

  squareWave2: OscillatorNode;
  squareWave2Enabled: boolean = false;

  sineWave: OscillatorNode;

  masterVolume: GainNode;

  channels: Channel[] = [];

  constructor() {
    this.audioContext = new AudioContext();

    this.channels.push(new SquareWaveChannel(1, this.audioContext));
    this.channels.push(new SquareWaveChannel(2, this.audioContext));
    // this.channels.push(new WaveChannel(this.audioContext));

    // this.squareWave1 = this.audioContext.createOscillator();
    // this.squareWave1.frequency.value = 1000;
    // this.squareWave1.type = "square";

    // this.squareWave2 = this.audioContext.createOscillator();
    // this.squareWave2.frequency.value = 1000;
    // this.squareWave2.type = "square";

    // this.sineWave = this.audioContext.createOscillator();
    // this.sineWave.type = "sine";

    // this.masterVolume = this.audioContext.createGain();
    // this.masterVolume.gain.value = 1;

    // this.squareWave1.connect(this.masterVolume);
    // this.squareWave2.connect(this.masterVolume);
    // this.sineWave.connect(this.masterVolume);

    // this.masterVolume.connect(this.audioContext.destination);
  }

  connect() {
    for (const channel of this.channels) {
      channel.enable();
    }
  }

  disconnect() {
    for (const channel of this.channels) {
      channel.disable();
    }
  }

  tick(ticks: number) {
    for (const channel of this.channels) {
      channel.tick(ticks);
    }
  }
}