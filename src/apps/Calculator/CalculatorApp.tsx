import { useState } from "react";
import { evaluateExpression } from "../../lib/calculator";
import type { AppComponentProps } from "../../types/os";

const keys = ["7", "8", "9", "÷", "sqrt(", "4", "5", "6", "×", "sin(", "1", "2", "3", "−", "cos(", "0", ".", "%", "+", ")", "(", "π", "C", "=", "log("];

export default function CalculatorApp(_: AppComponentProps) {
  const [expr, setExpr] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const press = (key: string) => {
    if (key === "C") return setExpr("");
    if (key === "=") {
      try {
        const result = evaluateExpression(expr);
        setHistory((items) => [`${expr} = ${result}`, ...items].slice(0, 6));
        setExpr(String(result));
      } catch {
        setExpr("Error");
      }
      return;
    }
    setExpr((value) => (value === "Error" ? key : value + key));
  };

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="rounded-[28px] border border-white/10 bg-black/22 p-5 text-right">
        <div className="min-h-10 break-all text-3xl font-semibold text-white">{expr || "0"}</div>
      </div>
      <div className="grid flex-1 grid-cols-5 gap-2">
        {keys.map((key) => (
          <button
            type="button"
            key={key}
            onClick={() => press(key)}
            className={`rounded-[20px] border text-lg font-medium transition hover:-translate-y-0.5 ${key === "=" ? "border-[rgba(var(--accent),.5)] bg-[rgba(var(--accent),.24)] text-white shadow-glow" : "border-white/10 bg-white/[0.08] text-white/72 hover:bg-white/14"}`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="max-h-24 overflow-auto rounded-[20px] border border-white/10 bg-white/[0.05] p-3 text-xs text-white/46">
        {history.length ? history.map((item) => <div key={item}>{item}</div>) : "History appears here"}
      </div>
    </div>
  );
}
