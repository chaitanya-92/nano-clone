import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { collaborationsData } from "../data/dashboardData";

type CollaborationTab = keyof typeof collaborationsData.tables;

export default function Collaborations() {
  const [activeTab, setActiveTab] = useState<CollaborationTab>("all");

  const currentTable = collaborationsData.tables[activeTab];

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#f7f9fc] px-8 py-10">
      <div className="mx-auto max-w-[1380px]">
        <h1 className="text-[38px] font-semibold tracking-[-1.8px] text-[#141a29]">
          {collaborationsData.title}
        </h1>

        <p className="mt-1 text-[18px] leading-7 text-[#74819a]">
          {collaborationsData.description}
        </p>

        <div className="mt-5 flex items-center gap-8 border-b border-[#e3e7ee]">
          {collaborationsData.tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex h-11 items-center gap-2 text-[14px] font-medium transition-colors ${
                  isActive
                    ? "text-[#2864f0]"
                    : "text-[#737f95] hover:text-[#293247]"
                }`}
              >
                <span>{tab.label}</span>

                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full border px-1.5 text-[10px] font-semibold transition-colors ${
                    isActive
                      ? "border-[#2864f0] bg-[#2864f0] text-white"
                      : "border-[#dce2eb] bg-transparent text-[#8792a5]"
                  }`}
                >
                  {tab.count}
                </span>

                {isActive && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#2864f0]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 overflow-hidden rounded-[18px] border border-[#e0e6ee] bg-white shadow-[0_5px_18px_rgba(35,55,85,0.04)]">
          <div className="flex min-h-[64px] items-center border-b border-[#e4e8ee] px-6">
            <div className="grid flex-1 grid-cols-[1fr_1.35fr_1fr_1.45fr_1.5fr_1.15fr_1fr] items-center gap-5">
              {collaborationsData.columns.map((column) => (
                <span
                  key={column}
                  className="text-[11px] font-semibold tracking-[0.04em] text-[#7c879d]"
                >
                  {column}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="ml-6 flex h-9 shrink-0 items-center gap-4 rounded-[10px] border border-[#dbe1e9] bg-white px-4 text-[12px] font-medium text-[#657188] transition-colors hover:bg-[#f8fafc]"
            >
              All types (0)
              <ChevronDown className="h-4 w-4" strokeWidth={1.7} />
            </button>
          </div>

          <div className="flex h-[55px] items-center justify-center border-b border-[#e4e8ee] text-[14px] text-[#78859b]">
            {currentTable.emptyMessage}
          </div>

          <div className="flex h-[64px] items-center justify-between px-6">
            <span className="text-[13px] text-[#7d899e]">
              {currentTable.total}
            </span>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#edf3ff] text-[13px] font-medium text-[#2864f0]"
            >
              1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}