import { useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

const quickQuestions = [
  "How does Naano work?",
  "I want to launch a campaign",
  "How can creators join?",
];

function getReply(message: string) {
  const text = message.toLowerCase();

  if (text.includes("campaign") || text.includes("launch")) {
    return "You can launch a campaign by creating a workspace first. I can take you to the registration page.";
  }

  if (text.includes("creator") || text.includes("join")) {
    return "Creators can join Naano and build a profile, connect their social presence, and collaborate with B2B brands.";
  }

  if (text.includes("how") || text.includes("work")) {
    return "Naano helps B2B brands discover creators, run campaigns, and measure clicks, leads, and pipeline from one workspace.";
  }

  return "I can help with campaigns, creators, and how Naano works. Try one of the quick questions below.";
}

export function NaanoAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hi! What would you like to see?",
    },
  ]);

  const sendMessage = (value = input) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        text: trimmed,
      },
      {
        id: Date.now() + 1,
        role: "assistant",
        text: getReply(trimmed),
      },
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70] sm:bottom-6 sm:right-6">
      {open ? (
        <div className="w-[min(calc(100vw-2rem),430px)] overflow-hidden rounded-[24px] border border-black/[0.08] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#202124]">
                  Conversation
                </p>
                <p className="text-[11px] text-[#989da3]">Naano assistant</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close conversation"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#737982] hover:bg-black/[0.04]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[360px] space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-5 ${
                    message.role === "user"
                      ? "bg-black text-white"
                      : "bg-[#f5f7f8] text-[#303338]"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 pt-1">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="rounded-full border border-black/[0.08] bg-white px-3 py-2 text-[11px] font-medium text-[#555b63] transition hover:bg-[#f7f8fa]"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="border-t border-black/[0.06] p-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-1.5">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="What would you like to see?"
                aria-label="Message Naano assistant"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[#303338] outline-none placeholder:text-[#a2a7ad]"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-black/85"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-[#a4a9ae]">
              Naano assistant
            </p>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Naano conversation"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#202124] text-white shadow-[0_12px_35px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
