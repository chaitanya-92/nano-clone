import type { ReactNode } from "react";

interface AuthSocialButtonProps {
  icon: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

export function AuthSocialButton({ icon, children, disabled }: AuthSocialButtonProps) {
  return (
    <button type="button" disabled={disabled} className="flex h-[50px] w-full items-center justify-center gap-3 rounded-[12px] border border-[#dfe2e8] bg-white text-[16px] font-semibold text-[#202124] shadow-[0_2px_5px_rgba(20,30,50,0.05)] transition hover:border-[#c8ccd4] hover:bg-[#fafbfc] disabled:cursor-not-allowed disabled:opacity-60">
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      {children}
    </button>
  );
}
