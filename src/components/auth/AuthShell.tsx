import type { ReactNode } from "react";
import { Globe } from "lucide-react";
import { authContent } from "@/data/data";
import { Logo } from "@/components/layout/Logo";

interface AuthShellProps {
  children: ReactNode;
  panelTitle: string;
  panelDescription: string;
}

export function AuthShell({ children, panelTitle, panelDescription }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <section className="relative flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-16 xl:px-24">
        <header className="flex items-center justify-between">
          <Logo />

          <button type="button" className="flex items-center gap-2 text-sm font-medium text-[#202124]">
            <Globe className="h-4 w-4 text-[#777f8f]" strokeWidth={1.7} />
            {authContent.login.language}
          </button>
        </header>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[465px]">{children}</div>
        </div>

        <div className="h-4" />
      </section>

      <section className="hidden min-h-screen items-center justify-center bg-[#2864f0] px-12 lg:flex xl:px-24">
        <div className="w-full max-w-[500px]">
          <h2 className="text-4xl font-semibold tracking-[-0.035em] text-white xl:text-[38px]">{panelTitle}</h2>
          <p className="mt-4 max-w-[470px] text-lg leading-7 text-white/85">{panelDescription}</p>
        </div>
      </section>
    </main>
  );
}