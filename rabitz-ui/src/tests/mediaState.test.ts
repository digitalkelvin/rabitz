import { describe, it, expect, beforeEach } from "vitest";
import { setMaxRecordingTime, setRecordingTime, recordingTimeLeft } from "../mediaState";

describe("mediaState", () => {
  beforeEach(() => {
    setRecordingTime(0);
    setMaxRecordingTime(120);
  });
  it("calculates remaining time", () => {
    setMaxRecordingTime(100);
    setRecordingTime(30);
    expect(recordingTimeLeft()).toBe(70);
  });
});