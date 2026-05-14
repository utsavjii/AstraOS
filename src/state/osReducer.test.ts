import { describe, expect, it } from "vitest";
import { createDefaultState } from "../lib/storage";
import { osReducer } from "./osReducer";

describe("osReducer", () => {
  it("opens and focuses windows", () => {
    const opened = osReducer(createDefaultState(), { type: "OPEN_APP", appId: "browser" });
    expect(opened.windows[0].appId).toBe("browser");

    const focused = osReducer(opened, { type: "FOCUS_WINDOW", id: opened.windows[0].id });
    expect(focused.windows[0].minimized).toBe(false);
    expect(focused.windows[0].zIndex).toBeGreaterThan(opened.windows[0].zIndex);
  });

  it("merges widget settings", () => {
    const state = osReducer(createDefaultState(), {
      type: "SET_SETTINGS",
      patch: { widgets: { weather: false, system: true, clock: true, assistant: true } },
    });
    expect(state.settings.widgets.weather).toBe(false);
    expect(state.settings.widgets.clock).toBe(true);
  });
});
