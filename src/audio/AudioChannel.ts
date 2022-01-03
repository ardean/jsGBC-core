import GameBoy from "../GameBoy_";

export default class AudioChannel {
  enabled: boolean = false;

  leftChannelEnabled: boolean = false;
  rightChannelEnabled: boolean = false;

  canPlay: boolean = false;

  constructor(
    protected gameboy: GameBoy
  ) { }
}