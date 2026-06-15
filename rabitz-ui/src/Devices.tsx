import { createEffect, createSignal, onMount } from "solid-js";
import {
  audioDeviceId,
  setAudioDeviceId,
  videoDeviceId,
  setVideoDeviceId,
  setStream,
  stream,
  recordingState,
} from "./mediaState";
import { DeviceSelect } from "./components/DeviceSelect";

export function Devices() {
  const constraints: MediaStreamConstraints = {
    audio: {
      noiseSuppression: true,
      echoCancellation: true,
    },
    video: {
      aspectRatio: { ideal: 16 / 9 },
      width: {
        min: 1280,
        ideal: 1920,
        max: 1920,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1080,
      },
    },
  };

  const [_, setDevices] = createSignal<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = createSignal<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = createSignal<MediaDeviceInfo[]>([]);

  const getDevices = async () => {
    return await navigator.mediaDevices.enumerateDevices();
  };

  const loadDevices = async () => {
    if (!("mediaDevices" in navigator) || !("getUserMedia" in navigator.mediaDevices)) {
      return;
    }

    await navigator.mediaDevices.getUserMedia(constraints);

    const allDevices = await getDevices();
    setDevices(allDevices);
    setVideoDevices(allDevices.filter((d) => d.kind === "videoinput"));
    setAudioDevices(allDevices.filter((d) => d.kind === "audioinput"));

    setAudioDeviceId(localStorage.getItem("rb-audioDeviceId") ?? "none");
    setVideoDeviceId(localStorage.getItem("rb-videoDeviceId") ?? "none");
  };

  const onVideoDeviceChange = async (e: Event) => {
    const updatedId = (e.currentTarget as HTMLSelectElement).value;
    localStorage.setItem("rb-videoDeviceId", updatedId);
    setVideoDeviceId(updatedId);
  };

  const onAudioDeviceChange = async (e: Event) => {
    const updatedId = (e.currentTarget as HTMLSelectElement).value;
    localStorage.setItem("rb-audioDeviceId", updatedId);
    setAudioDeviceId(updatedId);
    if (updatedId === "none") {
      stream()
        ?.getAudioTracks()
        .forEach((track) => track.stop());
      return;
    }
  };

  const setConstraints = async () => {
    if (audioDeviceId() !== "none") {
      constraints.audio = {
        noiseSuppression: true,
        echoCancellation: true,
        deviceId: { exact: audioDeviceId() },
      };
    }

    if (videoDeviceId() !== "none") {
      constraints.video = {
        aspectRatio: { ideal: 16 / 9 },
        width: {
          min: 1280,
          ideal: 1920,
          max: 1920,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1080,
        },
        deviceId: { exact: videoDeviceId() },
      };
    }

    if (!audioDeviceId() || audioDeviceId() == "none") {
      constraints.audio = false;
    }

    if (!videoDeviceId() || videoDeviceId() == "none") {
      constraints.video = false;
    }

    try {
      if (constraints.audio || constraints.video) {
        const s = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(s);
      }
    } catch (err) {
      console.error(constraints);
      console.error(err);
    }
  };

  onMount(() => {
    loadDevices();
  });

  createEffect(() => {
    if (audioDeviceId() || videoDeviceId()) {
      setConstraints();
    }
  });

  return (
    <div id="rb-devices" class="flex justify-center w-5/6 w-max-full mb-4 mx-auto">
      <div class="flex flex-col gap-2  w-full w-max-full text-sm opacity-85">
        <div class="flex items-center gap-2">
          <div>Video</div>
          <DeviceSelect
            id="rb-video-devices"
            devices={videoDevices}
            value={videoDeviceId}
            onChange={onVideoDeviceChange}
            disabled={recordingState() !== "inactive"}
            placeholder="Loading video devices..."
            offLabel="--Off--"
          />
        </div>

        <div class="flex items-center gap-2">
          <div>Audio</div>
          <DeviceSelect
            id="rb-audio-devices"
            devices={audioDevices}
            value={audioDeviceId}
            onChange={onAudioDeviceChange}
            disabled={recordingState() !== "inactive"}
            placeholder="Loading audio devices..."
            offLabel="--Off--"
          />
        </div>
      </div>
    </div>
  );
}
