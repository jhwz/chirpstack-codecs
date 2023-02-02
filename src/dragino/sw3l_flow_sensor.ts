import { battery, firmwareVersion, freqBand, sensorModel, uint32 } from "$utils/dragino";

function parseWaterFlowStatus(bytes: number[]) {
  var flag = (bytes[0] & 0xfc) >> 2;

  const pulse = uint32(bytes.slice(1, 5)) >>> 0;
  const flow = flag == 2 ? pulse / 64 : flag == 1 ? pulse / 390 : pulse / 450;

  return {
    data: {
      calculateFlag: flag,
      mod: bytes[5],
      alarm: bytes[0] & 0x02 ? true : false,
      lpm: flow / 20,
      flow,
      pulse,
      timestamp: uint32(bytes.slice(7)),
    },
  };
}

function decodeUplink({ fPort, bytes, variables }: DecodeInput): DecodeOutput {
  if (fPort == 0x02 && bytes.length == 11) {
    return {
      data: parseWaterFlowStatus(bytes),
    };
  } else if (fPort == 0x03) {
    const history = [];
    for (var i = 0; i < bytes.length; i = i + 11) {
      history.push(parseWaterFlowStatus(bytes.slice(i, i + 11)));
    }
    return {
      data: { history },
    };
  } else if (fPort == 0x04) {
    return {
      data: {
        tdc: (bytes[0] << 16) | (bytes[1] << 8) | bytes[2],
        stopTimer: bytes[4],
        alarmTimer: (bytes[5] << 8) | bytes[6],
      },
    };
  } else if (fPort == 0x05) {
    return {
      data: {
        sensor: sensorModel(bytes[0]),
        firmwareVersion: firmwareVersion([bytes[1], bytes[2]]),
        freqBand: freqBand(bytes[3]),
        subBand: bytes[4],
        battery: battery([bytes[5], bytes[6]]),
      },
    };
  }
  return { data: {} };
}

function encodeDownlink(input: EncodeInput): EncodeOutput {
  return {
    bytes: [],
  };
}
