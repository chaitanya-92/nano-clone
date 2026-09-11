import type { SVGProps } from "react";

interface LinkedinIconProps extends SVGProps<SVGSVGElement> {
  variant?: "brand" | "dark";
}

export function LinkedinIcon({ className = "", variant = "brand", ...props }: LinkedinIconProps) {
  const color = variant === "brand" ? "#0A66C2" : "#202124";

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="2.5" fill={color} />
      <path fill="white" d="M17.2 17.35h-2.85v-4.47c0-1.07-.02-2.32-1.42-2.32-1.41 0-1.63 1.13-1.63 2.25v4.54H8.45V8.05h2.74v1.27h.04c.38-.72 1.31-1.48 2.7-1.48 2.89 0 3.42 1.9 3.42 4.37v5.14ZM6.2 6.78a1.66 1.66 0 1 1 0-3.32 1.66 1.66 0 0 1 0 3.32ZM4.77 17.35h2.87V8.05H4.77v9.3Z" />
    </svg>
  );
}