import {
  ArrowRight,
  BarChart3,
  Bug,
  CheckCircle2,
  Lightbulb,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import {
  getAssistantContext,
  sendAssistantMessage,
  type AssistantContext,
} from "@/lib/dashboard";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  body: string;
  createdAt: string;
};

const quickActions = [
  {
    id: "performance",
    label: "Understand my performance",
    description: "Review your live analytics",
    icon: BarChart3,
    prompt: "Help me understand my current performance.",
  },
  {
    id: "product",
    label: "Get product help",
    description: "Get an answer about Naano",
    icon: MessageCircle,
    prompt: "What can you help me with in Naano?",
  },
  {
    id: "bug",
    label: "Report a bug",
    description: "Describe a problem for support",
    icon: Bug,
    prompt: "I want to report a bug. What information should I provide?",
  },
  {
    id: "idea",
    label: "Suggest an idea",
    description: "Share product feedback",
    icon: Lightbulb,
    prompt: "I want to suggest an idea for Naano. What should I include?",
  },
] as const;

function createAssistantMessage(body: string): ChatMessage {
  return {
    id: "assistant-" + Date.now() + "-" + Math.random().toString(36).slice(2),
    role: "assistant",
    body,
    createdAt: new Date().toISOString(),
  };
}

function createUserMessage(body: string): ChatMessage {
  return {
    id: "user-" + Date.now() + "-" + Math.random().toString(36).slice(2),
    role: "user",
    body,
    createdAt: new Date().toISOString(),
  };
}

function formatMetric(value: number) {
  return value.toLocaleString();
}

export default function Messages() {
  const [context, setContext] = useState<AssistantContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void getAssistantContext()
      .then(({ data }) => {
        setContext(data);
        setMessages([
          createAssistantMessage(
            "Hi, I’m the Naano assistant. Ask me a question or choose an option above — the team can step in when needed.",
          ),
        ]);
      })
      .catch((value) =>
        setError(
          value instanceof Error
            ? value.message
            : "Unable to load the assistant.",
        ),
      )
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const snapshot = useMemo(
    () => [
      {
        label: "Followers",
        value: context?.profile.followers ?? 0,
      },
      {
        label: "Posts",
        value: context?.profile.posts ?? 0,
      },
      {
        label: "Impressions",
        value: context?.profile.impressions ?? 0,
      },
      {
        label: "Engagements",
        value: context?.profile.engagements ?? 0,
      },
    ],
    [context],
  );

  const ask = async (prompt: string) => {
    const value = prompt.trim();

    if (!value || sending) {
      return;
    }

    setSending(true);
    setError("");

    setMessages((current) => [...current, createUserMessage(value)]);
    setDraft("");

    try {
      const { data } = await sendAssistantMessage(value);

      setMessages((current) => [
        ...current,
        createAssistantMessage(data.answer),
      ]);

      setContext(data.context);
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to get an assistant response.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <div className="grid overflow-hidden rounded-[22px] border border-[#dfe5ed] bg-white lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-[#e7ebf0] bg-white lg:border-b-0 lg:border-r">
          <div className="border-b border-[#e7ebf0] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
              Inbox
            </p>
            <h1 className="mt-1 text-[24px] font-semibold tracking-[-1px] text-[#141a29]">
              Messages
            </h1>
          </div>

          <div className="p-3">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-[#f1f5fb] px-3 py-3 text-left"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <Sparkles className="h-4 w-4 text-[#2864f0]" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[#344059]">
                  NaanoBot
                </span>
                <span className="block truncate text-xs text-[#8b97aa]">
                  Workspace assistant
                </span>
              </span>
              <span className="ml-auto h-2 w-2 rounded-full bg-[#20a965]" />
            </button>
          </div>

          <div className="px-4 py-5">
            <p className="text-xs leading-6 text-[#8b97aa]">
              Your assistant uses live workspace data. Brand conversations will
              also appear here when created.
            </p>

            <div className="mt-5 rounded-xl border border-[#e5e9ef] bg-[#fafbfd] p-3.5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#71809a]" />
                <p className="text-xs font-semibold text-[#53617a]">
                  Collaboration inbox
                </p>
              </div>

              <p className="mt-2 text-xs leading-5 text-[#8995aa]">
                {context?.activity.collaborations ?? 0} active collaboration(s).
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-[#e7ebf0] px-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dfe5ed] bg-white">
                <Sparkles className="h-4 w-4 text-[#2864f0]" />
              </span>

              <div>
                <h2 className="text-sm font-semibold text-[#263247]">
                  Naano help center
                </h2>

                <p className="text-xs text-[#8b97aa]">
                  Live workspace assistant
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-xs text-[#7e8ba1] sm:flex">
              <CheckCircle2 className="h-4 w-4 text-[#20a965]" />
              Assistant available
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <MessageScrollerProvider
              autoScroll
              defaultScrollPosition="end"
              scrollPreviousItemPeek={56}
            >
              <MessageScroller>
                <MessageScrollerViewport
                  aria-label="Naano assistant messages"
                  className="bg-white"
                >
                  <MessageScrollerContent className="px-5 py-6 sm:px-7">
                    <MessageScrollerItem messageId="assistant-overview">
                      <div className="mb-4 rounded-[18px] border border-[#dbe6fa] bg-[#f7faff] p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#2864f0] shadow-sm">
                            <Sparkles className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5c7090]">
                              Your Naano space
                            </p>

                            <h3 className="mt-1 text-xl font-semibold tracking-[-0.7px] text-[#172033]">
                              How can we help?
                            </h3>

                            <p className="mt-2 max-w-[620px] text-sm leading-6 text-[#6e7d95]">
                              Ask about your workspace, performance,
                              opportunities or product questions.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {quickActions.map((action) => {
                            const Icon = action.icon;

                            return (
                              <button
                                key={action.id}
                                type="button"
                                onClick={() => void ask(action.prompt)}
                                disabled={loading || sending}
                                className="group flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#dbe3ee] bg-white px-3 py-2.5 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-[#cbd6e6] hover:shadow-[0_5px_18px_rgba(30,50,80,0.05)] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e0e6ef] bg-[#f8fafc] text-[#63728a]">
                                  <Icon className="h-4 w-4" />
                                </span>

                                <span className="min-w-0 flex-1">
                                  <span className="block text-xs font-semibold text-[#324057]">
                                    {action.label}
                                  </span>
                                  <span className="mt-0.5 block text-[10px] text-[#8b97aa]">
                                    {action.description}
                                  </span>
                                </span>

                                <ArrowRight className="h-4 w-4 text-[#9aa6b7]" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </MessageScrollerItem>

                    <MessageScrollerItem messageId="performance-snapshot">
                      <div className="mb-4 rounded-[18px] border border-[#e4e9f1] bg-[#fbfcfe] p-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8491a8]">
                              Performance snapshot
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#263247]">
                              {context
                                ? "Your profile is ready to review."
                                : "Loading your profile data…"}
                            </p>
                          </div>

                          <BarChart3 className="h-4 w-4 text-[#73839c]" />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {snapshot.map((item) => (
                            <div
                              key={item.label}
                              className="rounded-xl bg-white px-3 py-2.5"
                            >
                              <p className="text-[9px] uppercase tracking-[0.08em] text-[#9aa5b5]">
                                {item.label}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-[#334057]">
                                {formatMetric(item.value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </MessageScrollerItem>

                    {messages.map((message) => (
                      <MessageScrollerItem
                        key={message.id}
                        messageId={message.id}
                        scrollAnchor={message.role === "user"}
                        className="mb-3"
                      >
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: message.role === "user" ? 12 : 5,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            duration: 0.25,
                            ease: "easeOut",
                          }}
                          className={
                            message.role === "user"
                              ? "ml-auto max-w-[760px] rounded-[18px] bg-[#eef3fb] px-4 py-3 text-sm leading-6 text-[#263247]"
                              : "max-w-[760px] rounded-[18px] border border-[#e4e9f1] bg-white px-4 py-3 text-sm leading-6 text-[#36445a]"
                          }
                        >
                          <div className="mb-1 flex items-center justify-between gap-3">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8491a8]">
                              {message.role === "user" ? "You" : "Naano"}
                            </span>

                            <span className="text-[10px] text-[#a0a9b7]">
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>

                          {message.body}
                        </motion.div>
                      </MessageScrollerItem>
                    ))}

                    {sending && (
                      <MessageScrollerItem
                        messageId="assistant-thinking"
                        className="mb-3"
                      >
                        <div className="flex max-w-[760px] items-center gap-2 rounded-[18px] border border-[#e4e9f1] bg-white px-4 py-3">
                          <Sparkles className="h-4 w-4 text-[#2864f0]" />
                          <span className="text-xs text-[#7c8aa0]">
                            Naano is checking your workspace…
                          </span>
                          <Loader2 className="ml-auto h-4 w-4 animate-spin text-[#7c8aa0]" />
                        </div>
                      </MessageScrollerItem>
                    )}

                    <div className="h-2 shrink-0" />
                  </MessageScrollerContent>
                </MessageScrollerViewport>

                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          </div>

          {error && (
            <div className="mx-5 mb-3 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-xs text-[#9b3e3e] sm:mx-7">
              {error}
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void ask(draft);
            }}
            className="flex shrink-0 items-center gap-2.5 border-t border-[#e7ebf0] bg-white p-3.5 sm:p-4"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={loading || sending}
              placeholder="Ask Naano a question…"
              className="auth-input h-11 flex-1 rounded-xl"
            />

            <Button
              type="submit"
              disabled={loading || sending || !draft.trim()}
              className="h-11 w-11 cursor-pointer rounded-xl bg-[#2864f0] p-0 hover:bg-[#1f58dc]"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
