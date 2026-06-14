import { vi } from "vitest";

const devices = [
  { deviceId: "cam1", kind: "videoinput", label: "Camera 1" },
  { deviceId: "cam2", kind: "videoinput", label: "Camera 2" },
  { deviceId: "mic1", kind: "audioinput", label: "Mic 1" },
  { deviceId: "mic2", kind: "audioinput", label: "Mic 2" },
];

class MockMediaStream {
  tracks: any[];

  constructor(tracks: any[] = []) {
    this.tracks = tracks;
  }

  getAudioTracks() {
    return this.tracks;
  }
}

class MockMediaRecorder {
  start() { }
  stop() { }
  pause() { }
  resume() { }
}

class MockAudioContext {
  createMediaStreamSource() {
    return {
      connect: vi.fn(),
    };
  }

  createAnalyser() {
    return {
      fftSize: 2048,
      frequencyBinCount: 8,
      getByteFrequencyData: vi.fn(),
      getByteTimeDomainData: vi.fn(),
    };
  }
}
vi.stubGlobal("AudioContext", MockAudioContext);

(globalThis as any).MediaStream = MockMediaStream;
(globalThis as any).MediaRecorder = MockMediaRecorder;

Object.defineProperty(globalThis, "navigator", {
  value: {
    mediaDevices: {
      getUserMedia: vi.fn().mockResolvedValue(new MockMediaStream()),
      enumerateDevices: vi.fn().mockResolvedValue(devices),
    },
  },
});