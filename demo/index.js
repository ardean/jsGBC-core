import GameBoy from "../src/index.js";
import $ from "jquery";

const keyMap = {
  13: "start",
  16: "select",
  38: "up",
  87: "up",
  39: "right",
  68: "right",
  40: "down",
  83: "down",
  37: "left",
  65: "left",
  76: "a",
  86: "a",
  88: "b",
  75: "b",
  49: "save",
  48: "load",
  80: "speed"
};

const $lcd = $(".lcd");

const gameboy = new GameBoy($lcd.get(0));

$(window)
  .on("keydown", ({ keyCode }) => {
    if (keyMap[keyCode]) {
      gameboy.actionDown(keyMap[keyCode]);
    }
  })
  .on("keyup", ({ keyCode }) => {
    if (keyMap[keyCode]) {
      gameboy.actionUp(keyMap[keyCode]);
    }
  });

$(".rom-select").on("click", () => {
  const $input = $("<input type='file' accept='.gb, .gbc' />");
  $input.one("change", function() {
    if (this.files.length > 0) {
      var file = this.files[0];
      var binaryHandle = new FileReader();
      binaryHandle.onload = function() {
        if (this.readyState === 2) {
          gameboy.replaceCartridge(this.result);
        }
      };
      binaryHandle.readAsBinaryString(file);
    }
  });
  $input.click();
});

$(".loading").hide();
