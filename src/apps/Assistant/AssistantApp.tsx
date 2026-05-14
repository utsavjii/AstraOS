import { useState } from "react";
import { motion } from "framer-motion";
import { createCommandActions } from "../../lib/commands";
import { GlassButton } from "../../components/ui/GlassButton";
import { SystemIcon } from "../../components/ui/SystemIcon";
import { TextInput } from "../../components/ui/TextInput";
import { useOS } from "../../state/OSProvider";
import type { AppComponentProps } from "../../types/os";

type AstraSpeechRecognitionEvent = {
  results: { [index: number]: { [index: number]: { transcript: string } } };
};

type AstraSpeechRecognitionInstance = {
  onresult: ((event: AstraSpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

type AstraSpeechRecognitionConstructor = new () => AstraSpeechRecognitionInstance;

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AssistantApp(_: AppComponentProps) {
  const os = useOS();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "I can open apps, change themes, search local content, and explain this simulated system." },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const send = (text = input) => {
    const value = text.trim();
    if (!value) return;
    const actions = createCommandActions(os);
    const action = actions.find((item) => value.toLowerCase().includes(item.label.toLowerCase().replace("open ", "")));
    if (action) action.run();
    const response = action
      ? `Done. ${action.label} is now running.`
      : value.includes("wallpaper")
        ? "Open Settings and choose Wallpapers. Uploads are compressed before saving locally."
        : "That is a local assistant simulation. Try asking me to open Browser, Files, Notes, Terminal, or Settings.";
    setMessages((current) => [...current, { role: "user", text: value }, { role: "assistant", text: response }]);
    setInput("");
  };

  const listen = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setListening(true);
      window.setTimeout(() => {
        setListening(false);
        send("open settings");
      }, 1100);
      return;
    }
    const recognition = new Recognition();
    recognition.onresult = (event) => send(event.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  };

  return (
    <div className="flex h-full flex-col p-4">
      <div className="relative mb-4 grid place-items-center rounded-[30px] border border-white/10 bg-white/[0.06] p-6">
        <motion.div
          className="grid h-28 w-28 place-items-center rounded-full border border-white/20 bg-[rgba(var(--accent),.18)] shadow-glow"
          animate={{ scale: listening ? [1, 1.12, 1] : [1, 1.04, 1] }}
          transition={{ duration: listening ? 0.7 : 3, repeat: Infinity }}
        >
          <SystemIcon name={listening ? "Mic" : "Sparkles"} size={40} />
        </motion.div>
        <p className="mt-4 text-sm text-white/56">{listening ? "Listening..." : "Command-aware local assistant"}</p>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[86%] rounded-[24px] border p-3 text-sm leading-6 ${message.role === "assistant" ? "border-white/10 bg-white/[0.07] text-white/68" : "ml-auto border-[rgba(var(--accent),.25)] bg-[rgba(var(--accent),.16)] text-white"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <TextInput value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="Ask Astra" className="flex-1" />
        <GlassButton icon="Mic" onClick={listen} />
        <GlassButton icon="Sparkles" variant="primary" onClick={() => send()} />
      </div>
    </div>
  );
}

declare global {
  interface Window {
    SpeechRecognition?: AstraSpeechRecognitionConstructor;
    webkitSpeechRecognition?: AstraSpeechRecognitionConstructor;
  }
}
