/**
 * Utility functions to serialize and deserialize ArrayBuffers as hex strings
 */

let uint8ToHex: Array<string>;
function GetUint8ToHex(): Array<string> {
  if (!uint8ToHex) {
    uint8ToHex = new Array(256);
    for (let i = 0; i <= 0xFF; ++i) {
        uint8ToHex[i] = i.toString(16).padStart(2, '0');
    }
  }
  return uint8ToHex;
}

let hexToUint8: Map<string, number>;
function GetHexToUint8(): Map<string, number> {
  if (!hexToUint8) {
    hexToUint8 = new Map();
    for (let i = 0; i <= 0xFF; ++i) {
      hexToUint8.set(i.toString(16).padStart(2, '0'), i);
    }
  }
  return hexToUint8;
}

export function BufferToHexString(buffer: ArrayBuffer): string {
  const lut = GetUint8ToHex();
  const array = new Uint8Array(buffer);
  let outStr = '';
  for (let i = 0; i < array.length; ++i) {
    outStr += lut[array[i]];
  }
  return outStr;
}

export function HexStringToBuffer(value: string): ArrayBuffer {
  const lut = GetHexToUint8();
  const array = new Uint8Array(value.length / 2);
  for (let i = 0; i < array.length; ++i) {
    const strOffset = i*2;
    array[i] = lut.get(value.substring(strOffset, strOffset+2))!;
  }
  return array.buffer;
}