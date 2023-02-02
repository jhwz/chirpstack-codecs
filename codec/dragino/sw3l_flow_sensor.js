// src/utils/dragino.ts
function sensorModel(data) {
  const map = {
    17: "SW3L"
  };
  return map[data] || "unknown";
}
function firmwareVersion(data) {
  return (data[0] & 15) + "." + (data[1] >> 4 & 15) + "." + (data[1] & 15);
}
function battery(data) {
  return (data[0] << 8 | data[1]) / 1e3;
}
var freqBandMap = [
  void 0,
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
  "MA869"
];
function freqBand(data) {
  return freqBandMap[data] || "unknown";
}
function uint32(bytes) {
  return bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
}
function timestamp(bytes) {
  return uint32(bytes);
}

// src/dragino/sw3l_flow_sensor.ts
function parseWaterFlowStatus(bytes) {
  var flag = (bytes[0] & 252) >> 2;
  const pulse = uint32(bytes.slice(1, 5)) >>> 0;
  const flow = flag == 2 ? pulse / 64 : flag == 1 ? pulse / 390 : pulse / 450;
  return {
    data: {
      calculateFlag: flag,
      mod: bytes[5],
      alarm: bytes[0] & 2 ? true : false,
      lpm: flow / 20,
      flow,
      pulse,
      timestamp: uint32(bytes.slice(7))
    }
  };
}
function decodeUplink({ fPort, bytes, variables }) {
  if (fPort == 2 && bytes.length == 11) {
    return {
      data: parseWaterFlowStatus(bytes)
    };
  } else if (fPort == 3) {
    const history = [];
    for (var i = 0; i < bytes.length; i = i + 11) {
      history.push(parseWaterFlowStatus(bytes.slice(i, i + 11)));
    }
    return {
      data: { history }
    };
  } else if (fPort == 4) {
    return {
      data: {
        tdc: bytes[0] << 16 | bytes[1] << 8 | bytes[2],
        stopTimer: bytes[4],
        alarmTimer: bytes[5] << 8 | bytes[6]
      }
    };
  } else if (fPort == 5) {
    return {
      data: {
        sensor: sensorModel(bytes[0]),
        firmwareVersion: firmwareVersion([bytes[1], bytes[2]]),
        freqBand: freqBand(bytes[3]),
        subBand: bytes[4],
        battery: battery([bytes[5], bytes[6]])
      }
    };
  }
  return { data: {} };
}
function encodeDownlink(input) {
  return {
    bytes: []
  };
}
