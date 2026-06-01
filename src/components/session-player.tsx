"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type QuestionPayload = {
  session: { id: string; currentIndex: number; totalQuestions: number };
  question: {
    id: string;
    module: string;
    question: string;
    options: { label: string; originalIndex: number }[];
  };
} | null;

export function SessionPlayer() {
  const router = useRouter();
  const [data, setData] = useState<QuestionPayload>(null);
  const [sessionId, setSessionId] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string; correctAnswer: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/session/start", { method: "POST", cache: "no-store" });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(payload.error ?? "Unable to start session");
      return;
    }
    if (!payload.question) {
      router.push(`/result/${payload.session.id}`);
      return;
    }
    setSessionId(payload.session.id);
    setData(payload);
  }

  useEffect(() => {
    load();
  }, []);

  async function answer() {
    if (!data || selected === null || answering) return;
    setAnswering(true);
    const response = await fetch("/api/session/answer", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        questionId: data.question.id,
        selectedAnswer: selected,
        shownOptions: data.question.options
      })
    });
    const payload = await response.json();
    setAnswering(false);
    if (!response.ok) {
      setError(payload.error ?? "Unable to save answer");
      return;
    }
    setFeedback(payload.feedback);
  }

  async function next() {
    setFeedback(null);
    setSelected(null);
    const response = await fetch(`/api/session/today?time=${Date.now()}`, { cache: "no-store" });
    const payload = await response.json();
    if (!payload.question) {
      router.push(`/result/${sessionId}`);
      return;
    }
    setSessionId(payload.session.id);
    setData(payload);
  }

  if (loading) return <p className="text-slate-600">Loading today’s session...</p>;
  if (error) return <p className="rounded bg-orange-50 px-4 py-3 font-semibold text-orange-700">{error}</p>;
  if (!data) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-lg border bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-safety-blue">Module: {data.question.module.replaceAll("_", " ")}</p>
        <p className="mt-1 text-sm text-slate-500">
          Question {data.session.currentIndex + 1} of {data.session.totalQuestions}
        </p>
        <h1 className="mt-5 text-2xl font-bold leading-9">{data.question.question}</h1>
        <div className="mt-6 grid gap-3">
          {data.question.options.map((option, index) => (
            <button
              key={`${option.label}-${index}`}
              disabled={!!feedback || answering}
              onClick={() => setSelected(option.originalIndex)}
              className={`focus-ring rounded-md border px-4 py-3 text-left font-medium ${
                selected === option.originalIndex ? "border-safety-blue bg-blue-50" : "border-slate-200 bg-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {feedback ? (
          <div className={`mt-5 rounded-md px-4 py-3 ${feedback.isCorrect ? "bg-green-50 text-green-800" : "bg-orange-50 text-orange-800"}`}>
            <p className="font-bold">{feedback.isCorrect ? "Correct! +10 XP" : "Incorrect."}</p>
            {!feedback.isCorrect ? <p className="mt-1">Correct answer: {feedback.correctAnswer}</p> : null}
            <p className="mt-1">{feedback.explanation}</p>
            <button onClick={next} className="mt-4 rounded-md bg-safety-blue px-4 py-2 font-semibold text-white">Next</button>
          </div>
        ) : (
          <button onClick={answer} disabled={selected === null || answering} className="mt-6 rounded-md bg-safety-green px-4 py-3 font-semibold text-white disabled:opacity-50">
            {answering ? "Saving..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}
