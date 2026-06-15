import { Signal } from 'solid-js';

export interface DeviceSelectProps {
  id: string;
  devices: () => any[];
  value: () => string;
  onChange: (e: Event) => void;
  disabled?: boolean;
  placeholder?: string;
  offLabel?: string;
}

export interface MediaControlsProps {
  stream?: Signal<string>
  audioOnly?: boolean
}

export type RecordingInfo = {
  maxRecordingTime: number;
  recordingTime: number;
  recordingTimeLeft: number;
  recordingState: string;
};

export type RecordingCore = {
  id: string;
  blob: Blob;
  mimeType: string;
};

export type Recording = RecordingCore & {
  /** @deprecated will be removed in future versions */
  url?: string;
};

export type VisualizerStyle = "spectrum" | "meter";