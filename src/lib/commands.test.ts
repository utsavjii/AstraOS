import { describe, expect, it, vi } from "vitest";
import { createDefaultState } from "./storage";
import { createCommandActions, runTerminalCommand } from "./commands";

describe("commands", () => {
  it("creates app and system actions", () => {
    const openApp = vi.fn();
    const state = createDefaultState();
    const actions = createCommandActions({
      state,
      openApp,
      setSettings: vi.fn(),
      setWorkspace: vi.fn(),
      notify: vi.fn(),
    });
    actions.find((action) => action.id === "open-browser")?.run();
    expect(openApp).toHaveBeenCalledWith("browser");
  });

  it("routes terminal calc commands", () => {
    const output = runTerminalCommand("calc 6*7", {
      state: createDefaultState(),
      openApp: vi.fn(),
      setSettings: vi.fn(),
      setWorkspace: vi.fn(),
      notify: vi.fn(),
    });
    expect(output[0].text).toContain("42");
  });
});
