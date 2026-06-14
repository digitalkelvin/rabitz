import { createMemo, onMount } from "solid-js";
import { MRecorder } from "./mediaRecorder";
import { Devices } from "./Devices";
import { formatTime } from "./utils";
import {
  audioDeviceId,
  maxRecordingTime,
  recordingState,
  recordingTime,
  recordingTimeLeft,
  videoDeviceId,
} from "./mediaState";

export function MediaControls() {
  const noStream = createMemo(() => {
    return videoDeviceId() === "none" && audioDeviceId() === "none";
  });
  const color = createMemo(() => {
    if (recordingTimeLeft() <= maxRecordingTime() * 0.1) return "red";
    if (recordingTimeLeft() <= maxRecordingTime() * 0.2) return "yellow";

    if (recordingState() === "inactive") return "white";
    return "green";
  });
  const action = createMemo(() => {
    if (recordingState() === "recording") return "⏸";
    if (recordingState() === "paused") return "⏺";
    return "⏺";
  });
  let recorder!: MRecorder;

  const start = () => {
    try {
      if (recordingState() === "recording") {
        recorder.pause();
      } else {
        recorder.start();
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const stop = () => {
    recorder.stop();
  };

  onMount(() => {
    recorder = new MRecorder();
  });

  return (
    <div class="inset-0 z-10000 flex flex-col w-full bg-[#1a1a1a] p-3 rounded-lg">
      <div id="rb-controls" class="flex flex-col w-full mt-auto p-2 z-1000">
        <Devices />

        <div class="rb-buttons flex gap-2 mx-auto items-center text-center justify-center h-full text-xl sm:text-2xl md:text-2xl">
          <button
            type="button"
            id="record"
            class="rb-button flex items-center justify-center w-12 aspect-square p-2 opacity-80"
            onclick={start}
            disabled={noStream()}
          >
            {action()}
          </button>

          <div
            id="rb-time"
            style={{ color: color() }}
            class="mx-auto text-sm font-semibold flex items-center justify-center w-[11ch]"
          >
            <span class="rb-duration">{formatTime(recordingTime())}</span>/
            <span class="rb-timeleft">{formatTime(recordingTimeLeft())}</span>
          </div>

          <button
            type="button"
            id="stop"
            class="rb-button flex items-center justify-center w-12 aspect-square opacity-80"
            onclick={stop}
            disabled={recordingState() === "inactive"}
          >
            ⏹
          </button>
        </div>
      </div>
    </div>
  );
}
