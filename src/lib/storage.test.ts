import { describe, expect, it } from "vitest";
import { createDefaultState, defaultSettings, getActiveWallpaper } from "./storage";

describe("storage defaults", () => {
  it("creates a locked default OS state", () => {
    const state = createDefaultState();
    expect(state.locked).toBe(true);
    expect(state.workspaces).toHaveLength(4);
    expect(state.settings).toMatchObject(defaultSettings);
  });

  it("resolves the active wallpaper", () => {
    const wallpaper = getActiveWallpaper(defaultSettings);
    expect(wallpaper.id).toBe("aurora");
  });
});
