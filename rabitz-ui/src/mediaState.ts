import { Accessor, createMemo, createSignal } from "solid-js";
import { RecordingInfo, VisualizerStyle } from "./models/models";

export const [stream, setStream] = createSignal<MediaStream>();

export const [audioDeviceId, setAudioDeviceId] = createSignal(localStorage.getItem("rb-audioDeviceId") ?? "none");
export const [videoDeviceId, setVideoDeviceId] = createSignal(localStorage.getItem("rb-videoDeviceId") ?? "none");

export const [visualizerStyle, setVisualizerStyle] = createSignal<VisualizerStyle>("spectrum")

export const [recordings, setRecordings] = createSignal<
  { url: string; mimeType: string }[]
>([]);

export const [maxRecordingTime, setMaxRecordingTime] = createSignal<number>(60);
export const [recordingTime, setRecordingTime] = createSignal<number>(0);
export const recordingTimeLeft: Accessor<number> = createMemo<number>(
  () => maxRecordingTime() - recordingTime()
);
export const [recordingState, setRecordingState] = createSignal<string>("inactive");


export const recordingInfo: Accessor<RecordingInfo> = createMemo(() => ({
  maxRecordingTime: maxRecordingTime(),
  recordingTime: recordingTime(),
  recordingTimeLeft: recordingTimeLeft(),
  recordingState: recordingState(),
}));