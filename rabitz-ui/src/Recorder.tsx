import { createEffect, createSignal, onMount, Show } from "solid-js";
import "./Recorder.css";
import { MediaControls } from "./MediaControls";
import { setMaxRecordingTime, setVisualizerStyle, stream, videoDeviceId } from "./mediaState";
import { Visualizer } from "./components/Visualizer";
import { VideoOffIcon } from "./VideoOffIcon";
import { VisualizerStyle } from "./models/models";

export function Recorder(props: { maxRecordingTime?: number; bands?: number; visualizerStyle?: VisualizerStyle }) {
  let videoRef!: HTMLVideoElement;
  const [bands, _] = createSignal(props.bands ?? 256);

  onMount(() => {
    if (props.maxRecordingTime) {
      setMaxRecordingTime(props.maxRecordingTime);
    }
    if (props.visualizerStyle) {
      setVisualizerStyle(props.visualizerStyle);
    }
  });

  createEffect(async () => {
    const s = stream();
    if (videoRef && s) {
      if (videoRef && s) {
        videoRef.srcObject = s;
        videoRef.onloadedmetadata = () => {
          videoRef.play().catch(console.error);
        };
      }
    }
  });

  return (
    <div
      id="rb-media-container"
      class="flex flex-col gap-1 items-center h-full max-h-full max-w-full min-w-[320px] min-h-45 text-gray-200 rounded-lg mx-auto"
    >
      <div class="flex flex-col landscape:relative gap-1 justify-center w-full max-w-full m-auto">
        <div class="relative aspect-video shrink-0 w-full h-max-h-[calc(100%-80px)] bg-[#1a1a1a] rounded-lg overflow-hidden">
          <Show when={videoDeviceId() !== "none"}>
            <video ref={videoRef} autoplay id="rb-video" muted class="absolute h-full w-full object-contain " />
          </Show>
          <Show when={videoDeviceId() === "none"}>
            <div class="flex items-center justify-center text-center absolute inset-0 w-full object-cover aspect-video">
              <VideoOffIcon class="w-1/6 aspect-square landscape:translate-y-[-30%]" />
            </div>
          </Show>
        </div>

        <div
          class="relative w-full flex-1
            landscape:absolute
            landscape:bottom-0
            landscape:z-10
            landscape:left-0
            landscape:right-0
            p-0"
        >
          <div id="rb-meter-container" class="w-full h-full rounded-lg portrait:bg-[#1a1a1a]">
            <Visualizer bands={bands()} />
            <MediaControls />
          </div>
        </div>
      </div>
    </div>
  );
}
