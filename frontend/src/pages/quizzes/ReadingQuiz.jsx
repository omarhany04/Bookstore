import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Table from "../../components/ui/Table";

const QUIZ = {
  id: "reader-check",
  title: "Reader Check — Popular Books Quiz",
  subtitle:
    "5 quick questions. One question per page. Answer to see if you’re a solid reader 👀",
  questions: [
    {
      id: "q1",
      text: `Who wrote "1984"?`,
      choices: ["J.K. Rowling", "George Orwell", "Ernest Hemingway", "Mark Twain"],
      correctIndex: 1,
    },
    {
      id: "q2",
      text: `In "Harry Potter", what is the name of Harry’s school?`,
      choices: ["Hogwarts", "Narnia Academy", "Middle-earth Institute", "Westworld High"],
      correctIndex: 0,
    },
    {
      id: "q3",
      text: `Which creature is strongly associated with "The Hobbit"?`,
      choices: ["Vampire", "Zombie", "Dragon (Smaug)", "Werewolf"],
      correctIndex: 2,
    },
    {
      id: "q4",
      text: `Who is the author of "Pride and Prejudice"?`,
      choices: ["Jane Austen", "Virginia Woolf", "Emily Brontë", "Mary Shelley"],
      correctIndex: 0,
    },
    {
      id: "q5",
      text: `In "To Kill a Mockingbird", what is Atticus Finch’s job?`,
      choices: ["Doctor", "Teacher", "Journalist", "Lawyer"],
      correctIndex: 3,
    },
  ],
};

function toneForStatus(status) {
  if (status === "correct") return "green";
  if (status === "wrong") return "red";
  if (status === "answered") return "yellow";
  return "slate";
}

function readerLevel(score, total) {
  const pct = total === 0 ? 0 : score / total;

  if (pct === 1) {
    return {
      tone: "green",
      title: "Excellent Reader 📚🔥",
      message:
        "Perfect score. You clearly recognize major titles and authors — keep going!",
    };
  }

  if (pct >= 0.6) {
    return {
      tone: "yellow",
      title: "Solid Reader 👍",
      message:
        "Nice work. You’ve got strong book knowledge — a little more reading and you’ll be unstoppable.",
    };
  }

  return {
    tone: "red",
    title: "Needs Improvement 📖",
    message:
      "Not bad, but you’ll improve fast by reading more classics and summaries. Try again after a bit of practice!",
  };
}

export default function ReadingQuiz() {
  const total = QUIZ.questions.length;
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState(() => ({}));

  const q = QUIZ.questions[page - 1];

  const status = useMemo(() => {
    const sel = answers[q.id];
    if (sel === undefined) return { type: "unanswered" };

    const correct = sel === q.correctIndex;
    return {
      type: correct ? "correct" : "wrong",
      selectedIndex: sel,
      correctIndex: q.correctIndex,
    };
  }, [answers, q]);

  const score = useMemo(() => {
    let s = 0;
    for (const qq of QUIZ.questions) {
      const sel = answers[qq.id];
      if (sel !== undefined && sel === qq.correctIndex) s += 1;
    }
    return s;
  }, [answers]);

  const answeredCount = useMemo(() => {
    return QUIZ.questions.reduce(
      (acc, qq) => acc + (answers[qq.id] !== undefined ? 1 : 0),
      0
    );
  }, [answers]);

  const progressPct = useMemo(() => {
    return Math.round((answeredCount / total) * 100);
  }, [answeredCount, total]);

  const isCompleted = answeredCount === total;
  const completion = useMemo(() => readerLevel(score, total), [score, total]);

  function choose(idx) {
    setAnswers((prev) => ({ ...prev, [q.id]: idx }));
  }

  function reset() {
    setAnswers({});
    setPage(1);
  }

  const row = useMemo(() => {
    const sel = answers[q.id];

    const answered = sel !== undefined;
    const isCorrect = answered && sel === q.correctIndex;

    const statusLabel = !answered ? "Not answered" : isCorrect ? "Correct" : "Wrong";

    return [
      {
        id: q.id,
        question: q.text,
        answered: answered ? "Answered" : "—",
        result: statusLabel,
      },
    ];
  }, [answers, q]);

  const columns = [
    { key: "question", header: "Question" },
    {
      key: "answered",
      header: "Answered",
      render: (r) => (
        <Badge tone={r.answered === "Answered" ? "yellow" : "slate"}>{r.answered}</Badge>
      ),
    },
    {
      key: "result",
      header: "Result",
      render: (r) => {
        const t = r.result === "Correct" ? "green" : r.result === "Wrong" ? "red" : "slate";
        return <Badge tone={t}>{r.result}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title={
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-extrabold">{QUIZ.title}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">{QUIZ.subtitle}</div>
          </div>
        }
        right={
          <div className="flex items-center gap-2">
            <Badge tone="slate">
              Score: {score}/{total}
            </Badge>
            <Button variant="secondary" onClick={reset} type="button">
              Reset
            </Button>
          </div>
        }
      >
        {/* Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold text-slate-700 dark:text-slate-200">
              Progress: {answeredCount}/{total}
            </div>
            <div className="text-slate-500 dark:text-slate-300">{progressPct}%</div>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <motion.div
              className="h-full bg-slate-900 dark:bg-slate-100"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        {/* Completion message */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.25 }}
              className="mb-6"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone={completion.tone}>Quiz Completed</Badge>
                    <Badge tone="slate">
                      Final Score: {score}/{total}
                    </Badge>
                  </div>

                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {completion.title}
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {completion.message}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button onClick={reset} type="button">
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1 Question per row (table) */}
        <div className="rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
          <Table columns={columns} rows={row} keyField="id" />
        </div>

        {/* Animated Question Panel */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Question {page} of {total}
                  </div>
                  <div className="mt-1 text-lg font-extrabold">{q.text}</div>
                </div>

                <Badge tone={toneForStatus(status.type)}>
                  {status.type === "unanswered"
                    ? "Not answered"
                    : status.type === "correct"
                    ? "Correct ✅"
                    : "Wrong ❌"}
                </Badge>
              </div>

              {/* Choices */}
              <div className="mt-4 grid grid-cols-1 gap-2">
                {q.choices.map((c, idx) => {
                  const sel = answers[q.id];
                  const picked = sel === idx;

                  const answered = sel !== undefined;
                  const isCorrectChoice = answered && idx === q.correctIndex;
                  const isWrongPicked = answered && picked && sel !== q.correctIndex;

                  const base =
                    "w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition";
                  const normal =
                    "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900/40";
                  const pickedStyle =
                    "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900";
                  const correctStyle =
                    "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200";
                  const wrongStyle =
                    "border-red-300 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200";

                  let cls = `${base} ${normal}`;
                  if (picked) cls = `${base} ${pickedStyle}`;
                  if (isCorrectChoice) cls = `${base} ${correctStyle}`;
                  if (isWrongPicked) cls = `${base} ${wrongStyle}`;

                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => choose(idx)}
                      type="button"
                      className={cls}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{c}</span>

                        {answers[q.id] !== undefined && (
                          <span className="text-xs font-black">
                            {idx === q.correctIndex ? "Correct" : picked ? "Your answer" : ""}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback line */}
              {answers[q.id] !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
                >
                  {status.type === "correct" ? (
                    <div>
                      <span className="font-extrabold">Nice!</span> That’s correct.
                    </div>
                  ) : (
                    <div>
                      <span className="font-extrabold">Not quite.</span> Correct answer is{" "}
                      <span className="font-black">{q.choices[q.correctIndex]}</span>.
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="mt-5 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              ← Prev
            </Button>

            <div className="flex items-center gap-1 rounded-2xl bg-white p-1 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    p === page
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              type="button"
              onClick={() => setPage((p) => Math.min(total, p + 1))}
              disabled={page >= total}
            >
              Next →
            </Button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-300">
            Tip: You can change your answer anytime — the result updates instantly.
          </div>
        </div>
      </Card>
    </div>
  );
}
