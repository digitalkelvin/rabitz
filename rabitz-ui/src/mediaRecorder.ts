import {
  stream, setRecordings, maxRecordingTime, recordingTime, setRecordingTime,
  recordings,
  setRecordingState
} from "./mediaState";

export class MRecorder {

  private mediaRecorder: MediaRecorder | undefined;
  private audioBitrate = 128000;
  private videoBitrate = 5000000;
  private chunks: Blob[] = [];
  private interval?: ReturnType<typeof setInterval>;
  private maxRecordings = 100;
  private mimeType = "video/webm";

  constructor() { }

  getSupportedMimeType(hasVideo: boolean, hasAudio: boolean) {
    const videoOnly = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm"
    ];

    const videoWithAudio = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm"
    ];

    const audioOnly = [
      "audio/webm;codecs=opus",
      "audio/webm"
    ];

    const candidates =
      hasVideo && hasAudio
        ? videoWithAudio
        : hasVideo
          ? videoOnly
          : audioOnly;

    return candidates.find(t => MediaRecorder.isTypeSupported(t)) || "";
  }

  trackTime() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {

      setRecordingTime((prev) => prev + 1);

      if (recordingTime() >= maxRecordingTime()) {
        this.stop();
      }

    }
  }


  start(): Promise<void> {
    return new Promise((resolve, _) => {

      if (!stream() || stream()!.getTracks().length === 0) {
        throw new Error("No media tracks available");
      }

      if (recordings().length >= this.maxRecordings) {
        throw new Error("Max Recordings Reached");
      }

      if (this.mediaRecorder) {

        if (this.mediaRecorder.state === "inactive") {
          this.mediaRecorder.start();

        } else if (this.mediaRecorder.state === "paused") {
          this.mediaRecorder.resume();
        }
        resolve();
        return
      }

      const hasVideo = stream()!.getVideoTracks().length > 0;
      const hasAudio = stream()!.getAudioTracks().length > 0;
      this.mimeType = this.getSupportedMimeType(hasVideo, hasAudio);


      this.mediaRecorder = new MediaRecorder(stream()!, {
        mimeType: this.mimeType,
        audioBitsPerSecond: this.audioBitrate,
        videoBitsPerSecond: this.videoBitrate
      });

      this.mediaRecorder.addEventListener("error", (event) => {
        console.error(`error recording stream: ${event.error.name}`);
      });

      this.mediaRecorder.onstart = () => {
        setRecordingState(this.mediaRecorder?.state ?? "inactive")
        this.interval = setInterval(this.trackTime.bind(this), 1000);
      };

      this.mediaRecorder.onpause = (): void => {
        setRecordingState(this.mediaRecorder?.state ?? "inactive")
      };

      this.mediaRecorder.onresume = (): void => {
        setRecordingState(this.mediaRecorder?.state ?? "inactive")
      };

      this.mediaRecorder.onerror = (e): void => {
        console.error(e)
      };

      this.mediaRecorder!.ondataavailable = (data: BlobEvent) => this.onDataAvailable(data);

      try {
        this.mediaRecorder!.start(1000);
      } catch (e: any) {
        console.error(e)
      }

    });
  }

  pause() {
    if (this.mediaRecorder) {
      this.mediaRecorder.pause();
    }
  }

  stop() {
    clearInterval(this.interval);
    return new Promise<void>((resolve, _) => {
      if (this.mediaRecorder) {

        if (this.mediaRecorder.state !== "inactive") {
          this.mediaRecorder.onstop = async () => {

            setRecordingState(this.mediaRecorder?.state ?? "inactive")
            setRecordingTime(0);

            await this.generateMedia();
            this.mediaRecorder = undefined;
            resolve();
          }
          this.mediaRecorder.stop();
        }
      }
    })
  }

  generateMedia() {
    return new Promise<void>((resolve, reject) => {
      try {

        let blob = new Blob(this.chunks, { type: this.mimeType });
        let url = URL.createObjectURL(blob);

        setRecordings((prev) => [...prev, {
          url, mimeType: this.mimeType
        }]);

        this.chunks = [];
        resolve();

      } catch (error) {
        console.error(error)
        reject();
      }
    });
  }

  onDataAvailable(data: BlobEvent) {
    if (data.data.size > 0) {
      this.chunks.push(data.data);
    }
  }

}
