# jsGBC-core

[![Build Status](https://travis-ci.org/ardean/jsGBC-core.svg?branch=master)](https://travis-ci.org/ardean/jsGBC)
[![Greenkeeper badge](https://badges.greenkeeper.io/ardean/jsGBC-core.svg)](https://greenkeeper.io/)
[![NPM Version][npm-image]][downloads-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![License][license-image]][license-url]

[Demo](https://ardean.github.io/jsGBC/)

**jsGBC Core Emulator**

This is just the core emulator. For a desktop emulator look at [jsGBC](https://github.com/ardean/jsGBC) or for an online emulator please check [jsGBC-web](https://github.com/ardean/jsGBC-web).

## Features
- LCD emulation
- Audio emulation
- Joypad emulation
- Cartridge emulation
  - MBC & RTC support (MBC 1, 2, 3, 5, 7)
  - RUMBLE support
- CPU emulation
  - cpu_instrs passed all tests

![cpu_instrs passed all tests](/cpu_instrs.png)

## Pending Features
- Gamepad support
- Link Cable emulation
- Audio emulation
  - WebAudio Worklets for better performance

## Planed Features
- Gameboy Camera emulation

## Related Projects

- [jsGBC](https://github.com/ardean/jsGBC)
- [jsGBC-web](https://github.com/ardean/jsGBC-web)

## License

[MIT](LICENSE.md)

Z80 implementation from [GameBoy-Online](https://github.com/taisel/GameBoy-Online)

[downloads-image]: https://img.shields.io/npm/dm/jsgbc.svg
[downloads-url]: https://npmjs.org/package/jsgbc
[npm-image]: https://img.shields.io/npm/v/jsgbc.svg
[npm-url]: https://npmjs.org/package/jsgbc
[license-image]: https://img.shields.io/npm/l/jsgbc.svg
[license-url]: LICENSE.md
