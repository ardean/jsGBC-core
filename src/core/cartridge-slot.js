export default class CartridgeSlot {
  constructor(gameboy) {
    this.gameboy = gameboy;
  }

  insertCartridge(cartridge) {
    cartridge.connect(this.gameboy);
    this.cartridge = cartridge;
  }

  readCartridge() {
    this.cartridge.interpret();
  }
}
