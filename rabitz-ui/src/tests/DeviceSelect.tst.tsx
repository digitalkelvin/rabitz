import { render } from "@solidjs/testing-library";
import { describe, it, expect, vi } from "vitest";
import { DeviceSelect } from "../components/DeviceSelect";

describe("DeviceSelect", () => {
  it("shows fallback when no devices and value not none", () => {
    const devices = vi.fn(() => []);
    const value = vi.fn(() => "mic1");

    const { container } = render(() => <DeviceSelect devices={devices} value={value} onChange={vi.fn()} id="test" />);

    const select = container.querySelector("select");
    expect(select?.disabled).toBe(true);
    expect(select?.textContent).toContain("Loading");
  });

  it("renders device options when devices exist", () => {
    const devices = vi.fn(() => [
      { deviceId: "mic1", label: "Mic 1" },
      { deviceId: "mic2", label: "Mic 2" },
    ]);

    const value = vi.fn(() => "mic1");

    const { container } = render(() => <DeviceSelect devices={devices} value={value} onChange={vi.fn()} id="test" />);

    const options = container.querySelectorAll("option");

    expect(options.length).toBe(3);
    expect(options[0].textContent).toBe("Mic 1");
    expect(options[1].textContent).toBe("Mic 2");
    expect(options[2].textContent).toBe("Off");
  });

  it("includes off option", () => {
    const devices = vi.fn(() => [{ deviceId: "cam1", label: "Camera 1" }]);

    const value = vi.fn(() => "cam1");

    const { container } = render(() => <DeviceSelect devices={devices} value={value} onChange={vi.fn()} id="test" />);

    const off = container.querySelector('option[value="none"]');

    expect(off).toBeTruthy();
    expect(off?.textContent).toBe("Off");
  });
});
