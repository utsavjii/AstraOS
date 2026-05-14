import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  subtle?: boolean;
}

export function Panel({ subtle, className, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[28px] border p-4 shadow-glass",
        subtle ? "border-white/10 bg-white/[0.055]" : "border-white/14 bg-white/[0.085]",
        className,
      )}
      {...props}
    />
  );
}
