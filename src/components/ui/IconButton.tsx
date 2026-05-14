import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { SystemIcon } from "./SystemIcon";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  active?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function IconButton({ icon, label, active, size = "md", className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "grid place-items-center rounded-2xl border border-white/12 bg-white/9 text-white/82 shadow-glass transition duration-200 hover:-translate-y-0.5 hover:bg-white/18 hover:text-white focus:outline-none focus:ring-2 focus:ring-[rgba(var(--accent),.55)]",
        active && "border-[rgba(var(--accent),.5)] bg-[rgba(var(--accent),.18)] text-white shadow-glow",
        sizes[size],
        className,
      )}
      {...props}
    >
      <SystemIcon name={icon} size={size === "lg" ? 22 : 18} />
    </button>
  );
}
