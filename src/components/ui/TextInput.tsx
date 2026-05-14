import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 rounded-2xl border border-white/12 bg-black/18 px-4 text-sm text-white outline-none transition placeholder:text-white/38 focus:border-[rgba(var(--accent),.6)] focus:ring-2 focus:ring-[rgba(var(--accent),.22)]",
        className,
      )}
      {...props}
    />
  );
}
