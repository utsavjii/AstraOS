import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { SystemIcon } from "./SystemIcon";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  variant?: "primary" | "ghost" | "danger";
}

export function GlassButton({ icon, variant = "ghost", className, children, ...props }: GlassButtonProps) {
  const ariaLabel = props["aria-label"] ?? (typeof children === "string" ? children : icon);
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(var(--accent),.55)]",
        variant === "primary" &&
          "border-[rgba(var(--accent),.55)] bg-[rgba(var(--accent),.22)] text-white shadow-glow hover:bg-[rgba(var(--accent),.3)]",
        variant === "ghost" && "border-white/12 bg-white/9 text-white/84 hover:bg-white/16",
        variant === "danger" && "border-rose-300/30 bg-rose-500/16 text-rose-50 hover:bg-rose-500/24",
        className,
      )}
      {...props}
    >
      {icon ? <SystemIcon name={icon} size={16} /> : null}
      {children}
    </button>
  );
}
