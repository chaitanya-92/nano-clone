import type { ReactNode } from "react";

interface DashboardPageProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function DashboardPage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: DashboardPageProps) {
  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
              {eyebrow}
            </p>
          )}

          <h1 className="mt-2 text-[36px] font-semibold tracking-[-1.8px] text-[#141a29] sm:text-[40px]">
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-[760px] text-[16px] leading-7 text-[#74819a] sm:text-[17px]">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </header>

      {children}
    </div>
  );
}
