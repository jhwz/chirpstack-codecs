export function sensorModel(data: number): string {
  const map: Record<number, string> = {
    0x11: "SW3L",
  };
  return map[data] || "unknown";
}

export function firmwareVersion(data: [number, number]): string {
  return (data[0] & 0x0f) + "." + ((data[1] >> 4) & 0x0f) + "." + (data[1] & 0x0f);
}

export function battery(data: [number, number]): number {
  return ((data[0] << 8) | data[1]) / 1000;
}

const freqBandMap = [
  undefined,
  "EU868",
  "US915",
  "IN865",
  "AU915",
  "KZ865",
  "RU864",
  "AS923",
  "AS923_1",
  "AS923_2",
  "AS923_3",
  "CN470",
  "EU433",
  "KR920",
  "MA869",
];

export function freqBand(data: number): string {
  return freqBandMap[data] || "unknown";
}

export function uint32(bytes: number[]): number {
  return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
}

export function timestamp(bytes: number[]): number {
  return uint32(bytes);
}
