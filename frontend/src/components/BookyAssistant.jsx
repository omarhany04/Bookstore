import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, StopCircle } from "lucide-react";
import { apiFetch } from "../api/client";
import { booksApi } from "../api/books";
import { categoriesApi } from "../api/categories";
import Button from "./ui/Button";

const TYPING_SPEED_MS = 14;
const CONNECTION_ERROR_TEXT =
  "I can help with Booky books, categories, cart, checkout, orders, quizzes, and admin features. Try asking for recommendations, payment help, or reports.";

const STARTER_PROMPTS = [
  "Show me science books",
  "How does checkout work?",
  "What can admins do?",
];

const createMessageId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const initialMessages = [
  {
    id: createMessageId(),
    role: "assistant",
    text:
      "Hi, I am Booky Assistant. I can recommend books, help with search and categories, explain checkout and orders, and guide you through admin features.",
    suggestions: STARTER_PROMPTS,
    books: [],
    excludeFromContext: true,
  },
];

function BookSuggestionCard({ book, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(book)}
      className="rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {book.category || "Book"}
      </div>
      <div className="mt-1 line-clamp-2 text-sm font-extrabold text-slate-900 dark:text-white">
        {book.title}
      </div>
      {book.authors?.length > 0 && (
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
          {book.authors.join(", ")}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-900 dark:text-white">
          {Number(book.selling_price || 0).toFixed(2)} EGP
        </span>
        <span
          className={`rounded-full px-2 py-1 font-semibold ${
            Number(book.stock_qty || 0) > 0
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300"
          }`}
        >
          {Number(book.stock_qty || 0) > 0 ? `In stock: ${book.stock_qty}` : "Out of stock"}
        </span>
      </div>
    </button>
  );
}

export default function BookyAssistant() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [typingState, setTypingState] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showHint, setShowHint] = useState(true);

  const messagesRef = useRef(messages);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [books, categoryRows] = await Promise.all([booksApi.list(), categoriesApi.list()]);
        if (!active) return;
        setCatalog(Array.isArray(books) ? books : []);
        setCategories(Array.isArray(categoryRows) ? categoryRows : []);
      } catch (error) {
        console.error("Failed to load Booky assistant context", error);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages, typingState, loading]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(false), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!typingState) return undefined;

    const { messageId, fullText } = typingState;
    let currentIndex = 0;

    const intervalId = window.setInterval(() => {
      currentIndex += 1;
      const partialText = fullText.slice(0, currentIndex);

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === messageId ? { ...message, text: partialText } : message
        )
      );

      if (currentIndex >= fullText.length) {
        window.clearInterval(intervalId);
        setTypingState(null);
      }
    }, TYPING_SPEED_MS);

    return () => window.clearInterval(intervalId);
  }, [typingState]);

  function stopTypingEffect() {
    if (!typingState) return;

    setMessages((currentMessages) =>
      currentMessages.map((message) =>
        message.id === typingState.messageId
          ? { ...message, text: typingState.fullText }
          : message
      )
    );
    setTypingState(null);
  }

  async function sendMessage(rawPrompt) {
    const prompt = rawPrompt.trim();
    if (!prompt || loading) return;

    if (typingState) {
      stopTypingEffect();
    }

    const userMessage = {
      id: createMessageId(),
      role: "user",
      text: prompt,
      suggestions: [],
      books: [],
      excludeFromContext: false,
    };

    const conversationForRequest = [...messagesRef.current, userMessage]
      .filter((message) => !message.excludeFromContext)
      .map((message) => ({
        role: message.role,
        text: message.text,
      }));

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setQuery("");
    setOpen(true);
    setLoading(true);

    try {
      const payload = await apiFetch("/chat", {
        method: "POST",
        body: {
          messages: conversationForRequest,
          catalog,
          categories,
        },
      });

      const assistantMessage = {
        id: createMessageId(),
        role: "assistant",
        text: "",
        fullText: payload?.answer || CONNECTION_ERROR_TEXT,
        suggestions: Array.isArray(payload?.followUpSuggestions) ? payload.followUpSuggestions : [],
        books: Array.isArray(payload?.books) ? payload.books : [],
        excludeFromContext: false,
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      setTypingState({
        messageId: assistantMessage.id,
        fullText: assistantMessage.fullText,
      });
    } catch (error) {
      const fallbackMessage = {
        id: createMessageId(),
        role: "assistant",
        text: "",
        fullText: CONNECTION_ERROR_TEXT,
        suggestions: STARTER_PROMPTS,
        books: [],
        excludeFromContext: false,
      };

      setMessages((currentMessages) => [...currentMessages, fallbackMessage]);
      setTypingState({
        messageId: fallbackMessage.id,
        fullText: fallbackMessage.fullText,
      });
    } finally {
      setLoading(false);
    }
  }

  function openBook(book) {
    navigate(`/books/${book.isbn}`);
    setOpen(false);
  }

  const lastAssistantMessageId = [...messages]
    .reverse()
    .find((message) => message.role === "assistant" && message.text)?.id;

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      <AnimatePresence>
        {!open && showHint && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-3 flex justify-end"
          >
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              Need a quick book recommendation?
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button
          onClick={() => {
            setShowHint(false);
            setOpen(true);
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
        >
          <MessageSquare size={20} />
          <span className="text-sm font-semibold">Booky Assistant</span>
        </motion.button>
      )}

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 flex h-[460px] w-[380px] max-w-[94vw] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="border-b border-slate-200 bg-slate-950 px-4 py-3 text-white dark:border-slate-800 dark:bg-slate-100 dark:text-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 dark:bg-slate-900/10">
                  <Bot size={18} />
                </span>
                <div>
                  <div className="text-sm font-extrabold">Booky Assistant</div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-slate-300 hover:text-white dark:text-slate-600 dark:hover:text-slate-900"
                type="button"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-3 dark:bg-slate-950">
            {messages.map((message) => {
              const isUser = message.role === "user";
              const isTypingMessage = typingState?.messageId === message.id;
              const showSuggestions =
                !isUser &&
                !isTypingMessage &&
                !loading &&
                message.id === lastAssistantMessageId &&
                message.suggestions?.length > 0;

              return (
                <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      isUser
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {!isUser && (
                      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Booky
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{message.text}</div>

                    {message.books?.length > 0 && (
                      <div className="mt-3 grid gap-2">
                        {message.books.map((book) => (
                          <BookSuggestionCard
                            key={`${message.id}-${book.isbn}`}
                            book={book}
                            onOpen={openBook}
                          />
                        ))}
                      </div>
                    )}

                    {showSuggestions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion) => (
                          <button
                            key={`${message.id}-${suggestion}`}
                            type="button"
                            onClick={() => void sendMessage(suggestion)}
                            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-900"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-200 p-3 dark:border-slate-800">
            {typingState && (
              <div className="mb-2 flex justify-end">
                <button
                  onClick={stopTypingEffect}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  type="button"
                >
                  <StopCircle size={14} />
                  Skip typing
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                placeholder="Ask about books, search, checkout, or admin..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void sendMessage(query);
                  }
                }}
              />
              <Button className="px-3" onClick={() => void sendMessage(query)} disabled={loading}>
                <Send size={16} />
              </Button>
            </div>

            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Try: "Show me history books" or "How do I cancel an order?"
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
