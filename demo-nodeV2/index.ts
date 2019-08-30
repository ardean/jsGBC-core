import * as fs from "fs";
import ROM from "../srcV2/memory/ROM";
import GameBoy from "../srcV2/GameBoy";
import Cartridge from "../srcV2/cartridge/Cartridge";

const bios = new ROM(fs.readFileSync("./roms/bios.rom"));
const game = new ROM(fs.readFileSync("./roms/rom.gb"));

const cartridge = new Cartridge(game);
const gameBoy = new GameBoy({
  bios,
  cartridge
});
gameBoy.turnOn();