import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MediaControls } from "../MediaControls";
import {
  setAudioDeviceId,
  setVideoDeviceId,
  setRecordingState,
  setRecordingTime,
  setMaxRecordingTime,
} from "../mediaState";

describe("MediaControls", () => {
  beforeEach(() => {
    setRecordingTime(0);
    setMaxRecordingTime(120);
    setRecordingState("inactive");
    setAudioDeviceId("none");
    setVideoDeviceId("none");
  });

  afterEach(() => {
    cleanup();
  });

  it("disables record button when no devices selected", () => {
    setAudioDeviceId("none");
    setVideoDeviceId("none");
    const { container } = render(() => <MediaControls />);
    const record = container.querySelector("#record") as HTMLButtonElement;
    expect(record.disabled).toBe(true);
  });

  it("enables record button when audio device selected", () => {
    setAudioDeviceId("mic1");
    setVideoDeviceId("none");
    const { container } = render(() => <MediaControls />);
    const record = container.querySelector("#record") as HTMLButtonElement;
    expect(record.disabled).toBe(false);
  });

  it("disables stop button when inactive", () => {
    setRecordingState("inactive");
    const { container } = render(() => <MediaControls />);
    const stop = container.querySelector("#stop") as HTMLButtonElement;
    expect(stop.disabled).toBe(true);
  });

  it("enables stop button while recording", () => {
    setRecordingState("recording");
    const { container } = render(() => <MediaControls />);
    const stop = container.querySelector("#stop") as HTMLButtonElement;
    expect(stop.disabled).toBe(false);
  });

  it("shows pause icon when recording", () => {
    setRecordingState("recording");
    const { container } = render(() => <MediaControls />);
    const record = container.querySelector("#record");
    expect(record?.textContent).toBe("⏸");
  });

  it("shows formatted times", () => {
    setMaxRecordingTime(120);
    setRecordingTime(30);
    const { container } = render(() => <MediaControls />);
    expect(container.querySelector(".rb-duration")?.textContent).toBe("00:30");
    expect(container.querySelector(".rb-timeleft")?.textContent).toBe("01:30");
  });

  it("turns red when less than 10% time remains", () => {
    setMaxRecordingTime(100);
    setRecordingTime(95);
    const { container } = render(() => <MediaControls />);
    const timer = container.querySelector("#rb-time") as HTMLElement;
    expect(timer.style.color).toBe("red");
  });
  it("turns red when less than 20% time remains", () => {
    setMaxRecordingTime(100);
    setRecordingTime(85);
    const { container } = render(() => <MediaControls />);
    const timer = container.querySelector("#rb-time") as HTMLElement;
    expect(timer.style.color).toBe("yellow");
  });
});
