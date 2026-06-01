"use client";

import { X } from "lucide-react";
import { useState } from "react";

type QuestionRow = {
  id: string;
  module: string;
  subtopic: string;
  difficulty: string;
  ageGroup: string;
  question: string;
  options: unknown;
  correctAnswer: number;
  explanation: string;
  learningObjective: string;
  masteryConcept: string;
  variantGroup: string;
  repeatPriority: number;
  aiEligible: boolean;
  conceptDepth: number;
};

export function QuestionTable({ questions }: { questions: QuestionRow[] }) {
  const [selected, setSelected] = useState<QuestionRow | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-3 py-3">ID</th>
              <th>Module</th>
              <th>Subtopic</th>
              <th>Difficulty</th>
              <th>Age</th>
              <th>Depth</th>
              <th>Question</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id} onClick={() => setSelected(question)} className="cursor-pointer border-b hover:bg-blue-50">
                <td className="px-3 py-3 font-semibold">{question.id}</td>
                <td>{question.module.replaceAll("_", " ")}</td>
                <td>{question.subtopic.replaceAll("_", " ")}</td>
                <td>{question.difficulty}</td>
                <td>{question.ageGroup}</td>
                <td>{question.conceptDepth}</td>
                <td className="max-w-md truncate">{question.question}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-safety-blue">{selected.id}</p>
                <h2 className="mt-1 text-2xl font-bold">{selected.question}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-md p-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Detail label="Module" value={selected.module} />
              <Detail label="Subtopic" value={selected.subtopic} />
              <Detail label="Difficulty" value={selected.difficulty} />
              <Detail label="Age Group" value={selected.ageGroup} />
              <Detail label="Concept" value={selected.masteryConcept} />
              <Detail label="Variant" value={selected.variantGroup} />
              <Detail label="Depth" value={selected.conceptDepth} />
              <Detail label="Repeat Priority" value={selected.repeatPriority} />
            </div>
            <h3 className="mt-6 font-bold">Options</h3>
            <div className="mt-2 space-y-2">
              {(Array.isArray(selected.options) ? selected.options : []).map((option, index) => (
                <div key={`${option}-${index}`} className={`rounded-md px-3 py-2 ${index === selected.correctAnswer ? "bg-green-50 font-semibold text-green-800" : "bg-slate-50"}`}>
                  {String(option)}
                </div>
              ))}
            </div>
            <h3 className="mt-6 font-bold">Explanation</h3>
            <p className="mt-2 text-slate-700">{selected.explanation}</p>
            <h3 className="mt-6 font-bold">Learning Objective</h3>
            <p className="mt-2 text-slate-700">{selected.learningObjective}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Detail({ label, value }: { label: string; value: string | number | boolean }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{String(value).replaceAll("_", " ")}</p>
    </div>
  );
}
