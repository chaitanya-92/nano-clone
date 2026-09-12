import { LockKeyhole } from "lucide-react";
import { opportunitiesData } from "../data/dashboardData";

export default function Opportunities() {
  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#f7f9fc] px-8 py-10">
      <div className="mx-auto max-w-[1320px]">
        <h1 className="text-[38px] font-semibold tracking-[-1.8px] text-[#141a29]">
          {opportunitiesData.title}
        </h1>

        <p className="mt-1 text-[18px] leading-7 text-[#74819a]">
          {opportunitiesData.description}
        </p>

        <div className="flex justify-center pt-6">
          <div className="flex min-h-[190px] w-full max-w-[580px] flex-col items-center justify-center rounded-[18px] border border-[#e1e6ee] bg-white px-8 py-8 text-center shadow-[0_4px_14px_rgba(28,49,80,0.04)]">
            <div className="flex h-12 w-12 items-center justify-center text-[#7c879d]">
              <LockKeyhole className="h-[29px] w-[29px]" strokeWidth={1.7} />
            </div>

            <h2 className="mt-3 text-[19px] font-semibold tracking-[-0.3px] text-[#171d2c]">
              {opportunitiesData.locked.title}
            </h2>

            <p className="mt-1 max-w-[500px] text-[15px] leading-6 text-[#7c879e]">
              {opportunitiesData.locked.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}