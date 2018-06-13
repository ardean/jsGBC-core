export const WORD_MAX = 0xFFFF;
export const BYTE_MAX = 0xFF;

// Interrupt service routine addresses
export const VBLANK_ISR_ADDR = 0x40;
export const LCDC_ISR_ADDR = 0x48;
export const TIMER_ISR_ADDR = 0x50;
export const IO_ISR_ADDR = 0x58;
export const HIGH_LOW_ISR_ADDR = 0x60;

// Memory definitions

export const INTERRUPT_VECTORS_START = 0x0000;
export const INTERRUPT_VECTORS_END = 0x00FF;

export const CART_HEADER_START = 0x0100;
export const CART_HEADER_END = 0x014F;

export const CART_ROM_BANK0_START = 0x0150;
export const CART_ROM_BANK0_END = 0x3FFF;

export const CART_ROM_SWITCH_BANK_START = 0x4000;
export const CART_ROM_SWITCH_BANK_END = 0x7FFF;

export const TILE_SET_0_START = 0x8000;
export const TILE_SET_0_END = 0x8FFF;

export const TILE_SET_1_START = 0x8800;
export const TILE_SET_1_END = 0x97FF;

export const BG_MAP_DATA0_START = 0x9800;
export const BG_MAP_DATA0_END = 0x9BFF;

export const BG_MAP_DATA1_START = 0x9C00;
export const BG_MAP_DATA1_END = 0x9FFF;

export const CART_RAM_START = 0xA000;
export const CART_RAM_END = 0xBFFF;

export const INTERNAL_RAM_BANK0_START = 0xC000;
export const INTERNAL_RAM_BANK0_END = 0xCFFF;

export const INTERNAL_RAM_SWITCH_BANK_START = 0xD000;
export const INTERNAL_RAM_SWITCH_BANK_END = 0xDFFF;

// Mirrored Memory
export const ECHO_RAM_START = 0xE000;
export const ECHO_RAM_END = 0xFDFF;

/*--------------- HIGH MEM-------------- */
export const SPRITE_ATTRIBUTE_TABLE_START = 0xFE00;
export const SPRITE_ATTRIBUTE_TABLE_END = 0xFE9F;

export const UNUSABLE_MEM_START = 0xFEA0;
export const UNUSABLE_MEM_END = 0xFEFF;

export const IO_PORTS_START = 0xFF00;
export const IO_PORTS_END = 0xFF7F;

export const ZERO_PAGE_START = 0xFF80;
export const ZERO_PAGE_END = 0xFFFE;

/* -------------------------------------*/

// Convert between local IO memory address and global address
//  export const GLOBAL_TO_IO_ADDR(A) A - 0xFF00
//  export const IO_TO_GLOBAL_ADDR(A) A + 0xFF00

/*  -------------IO ports/registers ------------------*/
export const JOYPAD_REG = 0xFF00; /*  Register for reading joy pad info */
export const SERIAL_DATA_REG = 0xFF01; /*  Serial transfer data */
export const SERIAL_CONTROL_REG = 0xFF02; /*  SIO control */
export const DIV_REG = 0xFF04; /*  Divider register */
export const TIMA_REG = 0xFF05; /*  Timer Counter */
export const TMA_REG = 0xFF06; /*  Timer Modulo  */
export const TIMER_CONTROL_REG = 0xFF07; /*  Timer Control */
export const INTERRUPT_FLAG_REG = 0xFF0F; /*  Interrupt Flag */

/*   Sound Mode 1 registers */
export const NR_10_REG = 0xFF10; /*  Sweep */
export const NR_11_REG = 0xFF11; /*  Length wave pattern*/
export const NR_12_REG = 0xFF12; /*  Envelope */
export const NR_13_REG = 0xFF12; /*  Frequency Lo */
export const NR_14_REG = 0xFF14; /*  Frequency Hi */

/*   Sound Mode 2 registers */
export const NR_21_REG = 0xFF16; /*  Length wave pattern*/
export const NR_22_REG = 0xFF17; /*  Envelope */
export const NR_23_REG = 0xFF18; /*  Frequency Lo */
export const NR_24_REG = 0xFF19; /*  Frequency Hi */

/*   Sound Mode 3 registers */
export const NR_30_REG = 0xFF1A; /*  Sound on/off*/
export const NR_31_REG = 0xFF1B; /*  Sound length */
export const NR_32_REG = 0xFF1C; /*  Select output level */
export const NR_33_REG = 0xFF1D; /*  Frequency Lo */
export const NR_34_REG = 0xFF1E; /*  Frequency Hi */

/*   Sound Mode 4 registers */
export const NR_41_REG = 0xFF20; /*  Sound length */
export const NR_42_REG = 0xFF21; /*  Envelope */
export const NR_43_REG = 0xFF22; /*  Polynomial Counter */
export const NR_44_REG = 0xFF23; /*  Counter/Consecutive; initial */

export const NR_50_REG = 0xFF24; /*  Channel Control/on-off/Volume */
export const NR_51_REG = 0xFF25; /*  Selection of Sound output terminal */
export const NR_52_REG = 0xFF26; /*  Sound on/off */

/*  Waveform Storage for Arbitrary Sound data */
export const WAVE_PATTERN_RAM_START = 0xFF30;
export const WAVE_PATTERN_RAM_END = 0xFF3F;

/* ------Screen/Graphics register locations------- */
export const LCDC_REG = 0xFF40; /*  LCD Control */
export const STAT_REG = 0xFF41; /*  LCD status */
export const SCROLL_Y_REG = 0xFF42; /*  8 bit value to scroll BG Y pos */
export const SCROLL_X_REG = 0xFF43; /*  8 bit value to scroll BG X pos */
export const LY_REG = 0xFF44; /*  LCDC Y-Coordinate */
export const LYC_REG = 0xFF45; /*  LY Compare */
export const DMA_REG = 0xFF46; /*  DMA Transfer and Start Address */
export const BGP_REF = 0xFF47; /*  BG and Window Palette Data */
export const OBP0_REG = 0xFF48; /*  Object Palette 0 Data */
export const OBP1_REG = 0xFF49; /*  Object Palette 1 Data */
export const WY_REG = 0xFF4A; /*  Window Y Position; 0 <= WY <= 143*/
export const WX_REG = 0xFF4B; /*  Window X Position; 0 <= WX <= 166 */

/* DMA transfer for Gameboy Color */
export const HDMA1_REG = 0xFF51;
export const HDMA2_REG = 0xFF52;
export const HDMA3_REG = 0xFF53;
export const HDMA4_REG = 0xFF54;
export const HDMA5_REG = 0xFF55;

export const KEY1_REG = 0xFF4D; /* Prepare Speed switch for Gameboy Color, used to switch clock speed */

export const VBANK_REG = 0xFF4F; /* Select which VRAM bank to use in Gameboy color */

export const INFRARED_REG = 0xFF56; /* Infrared Communications Port for Gameboy Color */

export const BGPI = 0xFF68; // Background Palette index for Gameboy Color
export const BGPD = 0xFF69; // Background Palette data for Gameboy Color
export const SPPI = 0xFF6A; // Sprite Palette index for Gameboy Color
export const SPPD = 0xFF6B; // Sprite Palette data for Gameboy Color

export const SRAM_BANK = 0xFF70; // Register to select internal RAM banks for Gameboy Color

export const INTERRUPT_ENABLE_REG = 0xFFFF; /*  Interrupt Enable Register */