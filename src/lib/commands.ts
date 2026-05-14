import { appDefinitions } from "../data/apps";
import { browserPages } from "../data/mockContent";
import { evaluateExpression } from "./calculator";
import type { AppId, CommandAction, FileSystemNode, OSSettings, OSState, TerminalLine } from "../types/os";

interface CommandContext {
  state: OSState;
  openApp: (appId: AppId, title?: string, props?: Record<string, unknown>) => void;
  setSettings: (patch: Partial<OSSettings>) => void;
  setWorkspace: (workspaceId: number) => void;
  notify: (title: string, body: string, appId?: AppId) => void;
}

function collectFiles(nodes: FileSystemNode[], prefix = ""): string[] {
  return nodes.flatMap((node) => {
    const path = `${prefix}/${node.name}`;
    return node.type === "folder" ? [path, ...collectFiles(node.children ?? [], path)] : [path];
  });
}

export function createCommandActions(context: CommandContext): CommandAction[] {
  const appActions = appDefinitions.map((app) => ({
    id: `open-${app.id}`,
    label: `Open ${app.name}`,
    hint: app.category,
    icon: app.icon,
    run: () => context.openApp(app.id),
  }));

  return [
    {
      id: "search-web",
      label: "Search simulated web",
      hint: "Open Browser",
      icon: "Search",
      run: () => context.openApp("browser", "Browser", { url: "astra://home" }),
    },
    {
      id: "toggle-theme",
      label: "Toggle light / dark mode",
      hint: context.state.settings.theme === "light" ? "Switch to dark" : "Switch to light",
      icon: "SunMoon",
      run: () => context.setSettings({ theme: context.state.settings.theme === "light" ? "dark" : "light" }),
    },
    {
      id: "workspace-next",
      label: "Move to next workspace",
      hint: "Ctrl Alt Right",
      icon: "PanelRight",
      run: () => context.setWorkspace((context.state.currentWorkspace + 1) % context.state.workspaces.length),
    },
    {
      id: "notify-test",
      label: "Send test notification",
      hint: "System",
      icon: "Bell",
      run: () => context.notify("System check", "AstraOS notifications are online.", "settings"),
    },
    ...appActions,
  ];
}

export function runTerminalCommand(command: string, context: CommandContext): TerminalLine[] {
  const input = command.trim();
  const [head, ...rest] = input.split(/\s+/);
  const args = rest.join(" ");
  const line = (text: string, kind: TerminalLine["kind"] = "output"): TerminalLine => ({
    id: `${Date.now()}-${Math.random()}`,
    text,
    kind,
  });

  if (!input) return [];

  switch (head.toLowerCase()) {
    case "help":
      return [
        line("Commands: help, ls, cat, open, theme, accent, calc, date, neofetch, search, notify, clear, reboot"),
      ];
    case "ls":
      return [line(collectFiles(context.state.fileSystem).join("\n"))];
    case "cat": {
      const all = collectReadableFiles(context.state.fileSystem);
      const match = all.find((file) => file.name.toLowerCase().includes(args.toLowerCase()));
      return [match ? line(match.content ?? match.preview ?? "No preview available.") : line("File not found", "error")];
    }
    case "open": {
      const app = appDefinitions.find(
        (definition) =>
          definition.id === args.toLowerCase() || definition.name.toLowerCase() === args.toLowerCase(),
      );
      if (!app) return [line(`No app named "${args}".`, "error")];
      context.openApp(app.id);
      return [line(`Opening ${app.name}...`, "system")];
    }
    case "theme": {
      const mode = args.toLowerCase();
      if (!["dark", "light", "system"].includes(mode)) return [line("Use theme dark, theme light, or theme system.", "error")];
      context.setSettings({ theme: mode as OSSettings["theme"] });
      return [line(`Theme set to ${mode}.`, "system")];
    }
    case "accent": {
      const color = args || "#7df3ff";
      context.setSettings({ accent: color });
      return [line(`Accent set to ${color}.`, "system")];
    }
    case "calc":
      try {
        return [line(`${args} = ${evaluateExpression(args)}`)];
      } catch (error) {
        return [line(error instanceof Error ? error.message : "Calculator error", "error")];
      }
    case "date":
      return [line(new Date().toLocaleString())];
    case "neofetch":
      return [
        line(
          [
            "AstraOS 1.0",
            `Workspace: ${context.state.workspaces[context.state.currentWorkspace]}`,
            `Windows: ${context.state.windows.length}`,
            `Theme: ${context.state.settings.theme}`,
            `Pages cached: ${Object.keys(browserPages).length}`,
          ].join("\n"),
        ),
      ];
    case "search":
      context.openApp("browser", "Browser", { query: args });
      return [line(`Searching locally for "${args}".`, "system")];
    case "notify":
      context.notify("Terminal", args || "Notification from Terminal", "terminal");
      return [line("Notification sent.", "system")];
    case "reboot":
      window.location.reload();
      return [line("Rebooting...", "system")];
    case "clear":
      return [line("__CLEAR__", "system")];
    default:
      return [line(`Command not found: ${head}`, "error")];
  }
}

function collectReadableFiles(nodes: FileSystemNode[]): FileSystemNode[] {
  return nodes.flatMap((node) =>
    node.type === "file" ? [node] : collectReadableFiles(node.children ?? []),
  );
}
