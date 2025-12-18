import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, X, Send, Bot, StopCircle } from "lucide-react";
import { apiFetch } from "../api/client";
import Button from "./ui/Button";

export default function BookyAssistant() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // typing effect state
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const typingIntervalRef = useRef(null);
  const fullMessageRef = useRef("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I’m Booky Assistant 🤖📚 Ask me anything about books, cart, checkout, or admin.",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages, displayedText]);

  // cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, []);

  function stopTypingEffect() {
    if (!typingIntervalRef.current) return;

    clearInterval(typingIntervalRef.current);
    typingIntervalRef.current = null;

    const full = fullMessageRef.current || "";
    setDisplayedText(full);
    setIsTyping(false);

    // set the last assistant message to full text
    setMessages((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === "assistant") {
          copy[i] = { ...copy[i], content: full };
          break;
        }
      }
      return copy;
    });
  }

  function startTypingEffect(fullText) {
    // stop any previous typing
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    fullMessageRef.current = fullText || "";
    setDisplayedText("");
    setIsTyping(true);

    let i = 0;
    typingIntervalRef.current = setInterval(() => {
      const full = fullMessageRef.current;

      if (i < full.length) {
        setDisplayedText((prev) => prev + full[i]);
        i++;
      } else {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsTyping(false);

        // once typing done, make sure message content is the full text
        setMessages((prev) => {
          const copy = [...prev];
          for (let k = copy.length - 1; k >= 0; k--) {
            if (copy[k].role === "assistant") {
              copy[k] = { ...copy[k], content: full };
              break;
            }
          }
          return copy;
        });
      }
    }, 12);
  }

  async function send() {
    const text = query.trim();
    if (!text || loading) return;

    // if assistant is currently typing and user sends new message -> skip old typing
    stopTypingEffect();

    setQuery("");
    setLoading(true);

    // add user message + placeholder assistant message (empty, will be typed)
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ]);

    try {
      const data = await apiFetch("/chat", {
        method: "POST",
        body: { message: text },
      });

      // start typing into the last assistant message
      startTypingEffect(data.reply || "No response received.");
    } catch (e) {
      const errText = `Sorry, something went wrong: ${e.message}`;
      startTypingEffect(errText);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.06 }}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-white shadow-lg"
        >
          <MessageSquare size={20} />
          <span className="text-sm font-semibold">Booky Assistant</span>
        </motion.button>
      )}

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 flex h-[420px] w-[360px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                <Bot size={18} />
              </span>
              <div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">Booky Assistant</div>
                <div className="text-xs text-slate-500">Powered by Ollama</div>
              </div>
            </div>

            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-900">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((m, idx) => {
              const isLastAssistant = m.role === "assistant" && idx === messages.length - 1;
              const showTyping = isLastAssistant && isTyping;

              return (
                <div
                  key={idx}
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                        ? "ml-auto bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                    }`}
                >
                  {showTyping ? displayedText : m.content}
                </div>
              );
            })}

            {loading && !isTyping && (
              <div className="max-w-[85%] rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
                Thinking...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                placeholder="Ask about books, cart, checkout..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <Button className="px-3" onClick={send} disabled={loading}>
                <Send size={16} />
              </Button>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <div>Tip: Ask “recommend me 3 Science books”</div>

              {isTyping && (
                <button
                  onClick={stopTypingEffect}
                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800"
                  type="button"
                >
                  <StopCircle size={14} />
                  Skip Typing Effect
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
