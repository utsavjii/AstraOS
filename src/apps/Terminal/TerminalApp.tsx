import { useMemo, useState } from "react";
import { runTerminalCommand } from "../../lib/commands";
import { useOS } from "../../state/OSProvider";
import type { AppComponentProps, TerminalLine } from "../../types/os";

export default function TerminalApp(_: AppComponentProps) {
  const os = useOS();
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: "boot", text: "Astra terminal online. Type help.", kind: "system" },
  ]);
  const [input, setInput] = useState("");
  const context = useMemo(() => os, [os]);

  const submit = () => {
    const command = input.trim();
    if (!command) return;
    const output = runTerminalCommand(command, context);
    if (output.some((line) => line.text === "__CLEAR__")) {
      setLines([]);
    } else {
      setLines((current) => [
        ...current,
        { id: `in-${Date.now()}`, prompt: "astra", text: command, kind: "input" },
        ...output,
      ]);
    }
    setInput("");
  };

  return (
    <div className="flex h-full flex-col bg-[#030712]/72 p-4 font-mono text-sm">
      <div className="min-h-0 flex-1 overflow-auto rounded-[24px] border border-emerald-300/10 bg-black/28 p-4">
        {lines.map((line) => (
          <pre
            key={line.id}
            className={`mb-2 whitespace-pre-wrap leading-6 ${line.kind === "error" ? "text-rose-300" : line.kind === "input" ? "text-cyan-100" : line.kind === "system" ? "text-emerald-300" : "text-white/68"}`}
          >
            {line.prompt ? `${line.prompt} > ` : ""}
            {line.text}
          </pre>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-[18px] border border-emerald-300/12 bg-black/36 px-3">
        <span className="text-emerald-300">astra &gt;</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && submit()}
          className="h-12 flex-1 bg-transparent text-cyan-50 outline-none"
          autoFocus
        />
      </div>
    </div>
  );
}
