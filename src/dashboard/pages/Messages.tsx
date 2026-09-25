import { useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Bug,
  CheckCircle2,
  CircleHelp,
  Lightbulb,
  Search,
  Send,
} from "lucide-react";
import { messagesPageData } from "@/dashboard/data/dashboardData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const optionIcons = {
  performance: BarChart3,
  "product-help": CircleHelp,
  bug: Bug,
  idea: Lightbulb,
} as const;

function NaanoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-10 w-10 rounded-xl bg-white shadow-sm ring-1 ring-[#dfe5ef]",
        className,
      )}
    >
      <div className="absolute left-[9px] top-[12px] h-[9px] w-[20px] rounded-[5px] bg-[#090b0f]" />
      <div className="absolute left-[15px] top-[19px] h-[9px] w-[20px] rounded-[5px] bg-[#090b0f]" />
      <div className="absolute right-[7px] bottom-[8px] h-[5px] w-[5px] rounded-full bg-[#1f5eff]" />
    </div>
  );
}

function AssistantHero() {
  return (
    <section className="rounded-[22px] border border-[#d8e2f1] bg-[radial-gradient(circle_at_80%_10%,#e6efff,transparent_40%),linear-gradient(135deg,#ffffff,#edf5ff)] p-5 shadow-[0_8px_30px_rgba(53,86,140,0.06)]">
      <div className="relative overflow-hidden rounded-[18px]">
        <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[#dce9ff]/70 blur-2xl" />
        <div className="absolute -bottom-16 left-1/3 h-36 w-56 rounded-full bg-white/90 blur-2xl" />

        <div className="relative flex min-h-[170px] items-center justify-between gap-6 px-2 py-3">
          <div className="max-w-[540px]">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-[#526986]">
              <span className="text-[#526986]">✦</span>
              {messagesPageData.assistant.eyebrow}
            </div>

            <h1 className="text-[27px] font-semibold tracking-[-1.2px] text-[#101828]">
              {messagesPageData.assistant.title}
            </h1>

            <p className="mt-2 max-w-[500px] text-[14px] leading-6 text-[#64748b]">
              {messagesPageData.assistant.description}
            </p>
          </div>

          <div className="relative hidden shrink-0 md:block">
            <div className="flex h-[116px] w-[116px] items-center justify-center rounded-full border border-white/90 bg-white/35 shadow-[0_0_0_10px_rgba(255,255,255,0.28)]">
              <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full border border-[#c9d7ef] bg-white/75">
                <NaanoMark className="h-14 w-14 rounded-full" />
              </div>
            </div>

            <div className="absolute -right-1 top-2 h-3 w-3 rounded-full border-2 border-white bg-[#16a66a]" />

            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#d8e4ee] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#60718a] shadow-sm">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#18ae6d]" />
              {messagesPageData.assistant.availability}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {messagesPageData.assistant.options.map((option) => {
          const Icon = optionIcons[option.id];

          return (
            <button
              key={option.id}
              type="button"
              className="group flex min-h-[70px] items-center gap-3 rounded-[16px] border border-[#dbe3ef] bg-white px-4 text-left transition-colors hover:bg-[#f7faff]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] border border-[#dce3ec] bg-[#f7f9fc] text-[#5d6b80]">
                <Icon className="h-[19px] w-[19px]" strokeWidth={1.7} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold leading-4 text-[#26344d]">
                  {option.title}
                </span>
                <span className="mt-1 block text-[10px] font-medium text-[#8190a8]">
                  {option.description}
                </span>
              </span>

              <ArrowUpRight className="h-4 w-4 shrink-0 text-[#9aa8ba] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PerformanceSnapshot() {
  const data = messagesPageData.performance;

  return (
    <section className="rounded-[17px] border border-[#dce3ed] bg-white px-4 py-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-[#60718b]">
          <BarChart3 className="h-4 w-4 text-[#2864f0]" strokeWidth={1.7} />
          {data.eyebrow}
        </div>

        <span className="text-[9px] font-medium text-[#a1adbd]">
          {data.label}
        </span>
      </div>

      <h2 className="mt-2 text-[13px] font-semibold text-[#27344b]">
        {data.title}
      </h2>

      <p className="mt-1 text-[11px] leading-4 text-[#718098]">
        {data.description}
      </p>

      <span className="mt-3 inline-flex rounded-full bg-[#f2f5f9] px-2.5 py-1 text-[9px] font-semibold text-[#5c6a80]">
        {data.metric}
      </span>
    </section>
  );
}

function ConversationArea() {
  const [message, setMessage] = useState("");
  const [sentMessage, setSentMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = message.trim();

    if (!trimmed) return;

    setSentMessage(trimmed);
    setMessage("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3">
        <div className="flex items-end gap-2">
          <NaanoMark className="h-8 w-8 shrink-0 rounded-lg" />

          <div className="max-w-[560px] rounded-[16px] rounded-bl-md bg-[#f0f2f5] px-4 py-3 text-[13px] leading-5 text-[#27344b]">
            {messagesPageData.assistant.welcomeMessage}
          </div>
        </div>

        <div className="ml-10 mt-1 text-[9px] text-[#8d99ab]">Naano</div>

        {sentMessage && (
          <div className="mt-5 flex justify-end">
            <div className="max-w-[70%] rounded-[16px] rounded-br-md bg-[#2864f0] px-4 py-3 text-[13px] leading-5 text-white">
              {sentMessage}
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-[#e2e6ed] bg-[#f8f9fb] p-4"
      >
        <div className="flex items-center gap-2">
          <Input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={messagesPageData.inputPlaceholder}
            className="h-12 rounded-[14px] border-[#d8e1ec] bg-white px-4 text-[14px] shadow-none placeholder:text-[#aab5c7] focus-visible:ring-[#b8cdfd]"
          />

          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-[14px] bg-[#2864f0] hover:bg-[#1f58db]"
          >
            <Send className="h-[19px] w-[19px]" strokeWidth={1.8} />
          </Button>
        </div>
      </form>
    </div>
  );
}

function RequestStatus() {
  const data = messagesPageData.requestStatus;

  return (
    <aside className="hidden w-[300px] shrink-0 border-l border-[#e1e6ee] bg-white xl:block">
      <div className="px-5 py-6">
        <h2 className="text-[13px] font-semibold text-[#27344b]">
          {data.title}
        </h2>

        <div className="mt-5 rounded-[12px] bg-[#f9fafc] px-3 py-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#18a76a]" />

            <div>
              <p className="text-[11px] font-semibold text-[#5b687d]">
                {data.status}
              </p>
              <p className="mt-1 text-[10px] leading-4 text-[#68758a]">
                {data.description}
              </p>
            </div>
          </div>
        </div>

        <div className="my-5 h-px bg-[#e5e8ed]" />

        {data.sections.map((section, index) => (
          <div key={section.title} className={cn(index > 0 && "mt-5")}>
            <h3 className="text-[11px] font-semibold text-[#455269]">
              {section.title}
            </h3>

            <p className="mt-2 text-[10px] leading-4 text-[#7b889d]">
              {section.description}
            </p>

            {index < data.sections.length - 1 && (
              <div className="mt-5 h-px bg-[#e5e8ed]" />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

function ConversationList() {
  return (
    <aside className="hidden w-[365px] shrink-0 border-r border-[#e1e6ee] bg-white lg:block">
      <div className="px-7 pt-8">
        <h1 className="text-[27px] font-semibold tracking-[-1px] text-[#141a26]">
          {messagesPageData.title}
        </h1>

        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#9aa7ba]" />

          <Input
            placeholder={messagesPageData.searchPlaceholder}
            className="h-12 rounded-[14px] border-[#d8e1ec] pl-11 text-[14px] shadow-none placeholder:text-[#a5afbf] focus-visible:ring-[#b8cdfd]"
          />
        </div>
      </div>

      <div className="mt-3 border-t border-[#edf0f4]">
        {messagesPageData.conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            className="flex w-full items-center gap-4 border-b border-[#edf0f4] bg-[#f4f6fc] px-7 py-4 text-left"
          >
            <NaanoMark className="h-9 w-9 shrink-0 rounded-lg" />

            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-semibold text-[#68758b]">
                  {conversation.name}
                </span>

                <span className="text-[10px] font-medium text-[#9ba6b6]">
                  {conversation.status}
                </span>
              </span>

              <span className="mt-1 block truncate text-[11px] text-[#77849a]">
                {conversation.description}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="px-7 pt-8">
        <p className="max-w-[260px] text-[14px] leading-6 text-[#7b879d]">
          {messagesPageData.emptyState}
        </p>
      </div>
    </aside>
  );
}

export default function Messages() {
  return (
    <div className="flex h-[calc(100vh-72px)] min-h-[650px] overflow-hidden bg-[#f7f9fc]">
      <ConversationList />

      <section className="flex min-w-0 flex-1 flex-col bg-[#f7f9fc]">
        <header className="flex h-[80px] shrink-0 items-center border-b border-[#e1e6ee] bg-white px-5">
          <div className="flex items-center gap-3">
            <NaanoMark />

            <div>
              <h2 className="text-[15px] font-semibold text-[#27344b]">
                {messagesPageData.assistant.name}
              </h2>

              <p className="mt-0.5 text-[10px] text-[#8490a4]">
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#bdebd5]" />
                {messagesPageData.assistant.status}
              </p>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-4 py-5 lg:px-5">
            <div className="mx-auto max-w-[820px]">
              <AssistantHero />

              <div className="mt-3">
                <PerformanceSnapshot />
              </div>

              <div className="mt-4 overflow-hidden rounded-[18px] border border-[#e0e5ed] bg-white">
                <div className="flex h-[340px] min-h-[340px] flex-col">
                  <ConversationArea />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RequestStatus />
    </div>
  );
}
