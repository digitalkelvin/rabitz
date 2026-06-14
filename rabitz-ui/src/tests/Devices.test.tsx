import { describe, it, expect } from "vitest";
import { render } from "@solidjs/testing-library";
import { Devices } from "../Devices";

describe("Devices", () => {
  it("renders without crashing", async () => {
    render(() => <Devices />);
    expect(true).toBe(true);
  });
});
