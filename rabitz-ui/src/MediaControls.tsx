import { createMemo, createSignal, onMount } from "solid-js";
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
  const [showDevices, setShowDevices] = createSignal(false);

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
    <div class="relative inset-0 z-10000 flex flex-col w-full p-3 rounded-lg">
      <div id="rb-controls" class="flex flex-col justify-center w-full mt-auto p-2 z-1000">
        <div class={showDevices() ? "" : "hidden"}>
          <div class="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm rounded-lg">
            <div class="absolute inset-0" onClick={() => setShowDevices(false)}></div>
            <div class="absolute right-0 bottom-0 w-full bg-[#1a1a1a] rounded-lg p-2 shadow-lg border-gray-300">
              <button
                class="absolute top-0 left-0 px-2 py-1 rounded hover:bg-white/10 text-gray-200 cursor-pointer"
                onClick={() => setShowDevices(false)}
              >
                ✕
              </button>
              <Devices />
            </div>
          </div>
        </div>

        <button
          class="absolute p-1 rounded border border-transparent hover:border-[#818181] transition-colors z-20 cursor-pointer"
          onClick={() => setShowDevices((v) => !v)}
        >
          <span class="">⚙️</span>
        </button>

        <div class="rb-buttons flex gap-2 mx-auto items-center text-center justify-center h-full text-xl sm:text-2xl md:text-2xl  shadow-xl">
          <button
            type="button"
            id="record"
            class="rb-button flex items-center justify-center w-12 md:w-16 aspect-square bg-[#818181] landscape:bg-[#1a1a1a]/85"
            onclick={start}
            disabled={noStream()}
          >
            {action()}
          </button>

          <div
            id="rb-time"
            style={{ color: color() }}
            class="mx-auto text-sm font-semibold flex gap-1 items-center justify-center h-12 md:h-16 bg-[#1a1a1a] landscape:bg-[#1a1a1a]/85 rounded-lg p-2"
          >
            <span class="rb-duration">{formatTime(recordingTime())}</span>
            <span class="mx-2">/</span>
            <span class="rb-timeleft">{formatTime(recordingTimeLeft())}</span>
          </div>

          <button
            type="button"
            id="stop"
            class="rb-button flex items-center justify-center w-12 md:w-16 aspect-square bg-[#818181] landscape:bg-[#1a1a1a]/85"
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
