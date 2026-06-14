import { render } from "@solidjs/testing-library";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Visualizer } from "../components/Visualizer";
import { setStream } from "../mediaState";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("Visualizer", () => {
  it("does not activate when there is no stream", () => {
    setStream(undefined as any);
    const { container } = render(() => <Visualizer bands={10} />);
    expect(container.querySelector("#rb-visualizer")).toBeTruthy();
    expect(container.querySelector(".rb-bar")).toBeNull();
    expect(container.querySelector(".rb-meter")).toBeNull();
  });

  it("does not activate when stream has no audio tracks", () => {
    setStream(new MediaStream());
    const { container } = render(() => <Visualizer bands={10} />);
    expect(container.querySelector(".rb-bar")).toBeNull();
    expect(container.querySelector(".rb-meter")).toBeNull();
  });

  it("activates when stream has audio tracks", () => {
    const track = { stop: vi.fn() } as unknown as MediaStreamTrack;
    setStream(new MediaStream([track]));
    const { container } = render(() => <Visualizer bands={10} />);
    expect(container.querySelector("#rb-visualizer")).toBeTruthy();
  });
});
