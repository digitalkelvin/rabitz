import { createSignal, createEffect, Show, For } from "solid-js";
import { stream, visualizerStyle } from "./../mediaState";

export function Visualizer(props: any) {
  const [frequencies, setFrequencies] = createSignal<number[]>([]);
  const [rms, setRms] = createSignal<number>(0);
  const [dataArray, setDataArray] = createSignal<Uint8Array>(new Uint8Array(0));
  const [timeArray, setTimeArray] = createSignal<Uint8Array>();
  const [analyzer, setAnalyzer] = createSignal<AnalyserNode | null>(null);

  const initProcessor = () => {
    const mStream: MediaStream | undefined = stream();
    if (!mStream) return;

    if (mStream instanceof MediaStream && (mStream.getAudioTracks().length ?? 0) > 0) {
      const t: MediaStreamTrack = mStream.getAudioTracks()[0];
      const newStream = new MediaStream([t]);
      const audioContext = new AudioContext({ latencyHint: "interactive" });
      const source = audioContext.createMediaStreamSource(newStream);
      createAnalyzer(audioContext, source);
    }
  };

  const createAnalyzer = (context: AudioContext, source: MediaStreamAudioSourceNode | MediaElementAudioSourceNode) => {
    const analyser = context.createAnalyser();
    setAnalyzer(analyser);
    analyser.fftSize = 2048;
    source.connect(analyser);
    const size = analyser.frequencyBinCount;
    setDataArray(new Uint8Array(size));
    setTimeArray(new Uint8Array(size));
    analyser.getByteFrequencyData(dataArray() as Uint8Array<ArrayBuffer>);
    animate();
  };

  const getRMS = (data: Uint8Array) => {
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i] - 128;
      sum += v * v;
    }

    return Math.sqrt(sum / data.length);
  };

  const animate = () => {
    if (visualizerStyle() == "spectrum") {
      //SPECTRUM
      analyzer()!.getByteFrequencyData(dataArray() as Uint8Array<ArrayBuffer>);
      setFrequencies((prev) => Array.from(dataArray()).map((v, i) => (prev[i] ? prev[i] * 0.5 + v * 0.5 : v)));
    } else {
      // METER
      const t = timeArray();
      if (!t || t.length === 0) return;
      analyzer()!.getByteTimeDomainData(t as Uint8Array<ArrayBuffer>);
      setRms((prev) => Math.min(100, prev * 0.5 + getRMS(t) * 10 * 0.5));
    }

    requestAnimationFrame(animate);
  };

  createEffect(() => {
    if (stream()) {
      const hasAudio = (stream()?.getAudioTracks().length ?? 0) > 0;
      if (hasAudio) {
        initProcessor();
      }
    }
  });

  return (
    <div id="rb-visualizer" class="absolute inset-0 p-0 h-full max-h-full">
      <Show when={visualizerStyle() === "spectrum" && stream()}>
        <div style="display:flex;height:100%;max-height:100%;width:100%;align-items:flex-end;" class="p-0 m-0">
          <For each={frequencies().slice(0, props.bands)}>
            {(item, _) => (
              <div
                class="rb-bar"
                style={{
                  "background-color": "white",
                  width: "2.56%",
                  height: `${(item / 255) * 100}%`,
                  "max-height": "100%",
                }}
              ></div>
            )}
          </For>
        </div>
      </Show>

      <Show when={visualizerStyle() === "meter" && stream()}>
        <div
          style={{ height: `${rms()}%`, "max-height": "100%" }}
          class="rb-meter w-full absolute bottom-0 max-h-full"
        />
      </Show>
    </div>
  );
}
