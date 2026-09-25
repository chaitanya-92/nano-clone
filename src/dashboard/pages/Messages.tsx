import { Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getConversations,
  getMessages,
  markConversationRead,
  sendConversationMessage,
  type Conversation,
  type Message,
} from "@/lib/dashboard";

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadConversations = async () => {
    try {
      const { data } = await getConversations();

      setConversations(data);
      setSelectedId((current) =>
        current && data.some((item) => item.id === current)
          ? current
          : (data[0]?.id ?? null),
      );
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to load conversations.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data } = await getMessages(conversationId);

      setMessages(data);
      await markConversationRead(conversationId);
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to load messages.",
      );
    }
  };

  useEffect(() => {
    void loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }

    void loadMessages(selectedId);
  }, [selectedId]);

  const send = async () => {
    const value = draft.trim();

    if (!selectedId || !value) {
      return;
    }

    setSending(true);

    try {
      await sendConversationMessage(selectedId, value);

      setDraft("");
      await loadMessages(selectedId);
      await loadConversations();
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to send message.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
        Inbox
      </p>

      <h1 className="mt-2 text-[38px] font-semibold tracking-[-1.8px] text-[#141a29]">
        Messages
      </h1>

      <p className="mt-1 text-[17px] text-[#74819a]">
        Keep conversations with brands and creators in one place.
      </p>

      {error && (
        <div className="mt-5 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error}
        </div>
      )}

      <section className="mt-7 grid min-h-[620px] overflow-hidden rounded-[22px] border border-[#dfe5ed] bg-white lg:grid-cols-[330px_1fr]">
        <aside className="border-b border-[#e7ebf0] lg:border-b-0 lg:border-r">
          <div className="border-b border-[#e7ebf0] px-5 py-5">
            <h2 className="text-sm font-semibold text-[#253047]">
              Conversations
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-[#71809a]" />
            </div>
          ) : conversations.length ? (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setSelectedId(conversation.id)}
                className={
                  selectedId === conversation.id
                    ? "w-full cursor-pointer border-b border-[#e7ebf0] bg-[#f5f8ff] px-5 py-4 text-left"
                    : "w-full cursor-pointer border-b border-[#e7ebf0] px-5 py-4 text-left hover:bg-[#fafbfc]"
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-[#34415a]">
                    {conversation.subject ||
                      conversation.brand_name ||
                      conversation.creator_name}
                  </p>

                  <span className="shrink-0 text-[10px] text-[#98a3b4]">
                    {conversation.status}
                  </span>
                </div>

                <p className="mt-2 truncate text-xs text-[#8490a5]">
                  {conversation.last_message || "No messages yet"}
                </p>
              </button>
            ))
          ) : (
            <div className="px-5 py-16 text-center">
              <p className="text-sm font-medium text-[#69768d]">
                No conversations yet
              </p>

              <p className="mt-2 text-xs leading-5 text-[#8d99aa]">
                A conversation will appear when a collaboration thread is
                created.
              </p>
            </div>
          )}
        </aside>

        <div className="flex min-h-[620px] flex-col">
          <div className="border-b border-[#e7ebf0] px-6 py-5">
            <h2 className="text-sm font-semibold text-[#253047]">
              {conversations.find((item) => item.id === selectedId)?.subject ||
                conversations.find((item) => item.id === selectedId)
                  ?.brand_name ||
                "Select a conversation"}
            </h2>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#fafbfd] px-6 py-6">
            {messages.length ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className="max-w-[720px] rounded-2xl border border-[#e4e9f0] bg-white px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-[#54627b]">
                      {message.sender_name}
                    </p>

                    <span className="text-[10px] text-[#98a3b4]">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#3f4c63]">
                    {message.body}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex min-h-[400px] items-center justify-center text-sm text-[#8b97aa]">
                {selectedId
                  ? "No messages yet. Send the first message."
                  : "Select a conversation to start."}
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
            className="flex items-center gap-3 border-t border-[#e7ebf0] p-4"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={!selectedId || sending}
              placeholder={
                selectedId ? "Write a message…" : "Select a conversation first"
              }
              className="auth-input flex-1"
            />

            <Button
              type="submit"
              disabled={!selectedId || !draft.trim() || sending}
              className="h-11 w-11 cursor-pointer rounded-xl bg-[#2864f0] p-0 hover:bg-[#1f58dc]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
