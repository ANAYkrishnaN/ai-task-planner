"use client";

import { type FormEvent, useState, useEffect } from "react";
import {
  type PrioritizedRawTask,
  prioritizeRawTask,
} from "@/src/lib/prioritization";

export default function Home() {
  const [taskInput, setTaskInput] = useState("");
  const [prioritized, setPrioritized] = useState<PrioritizedRawTask | null>(
    null,
  );

  const [tasks, setTasks] = useState<string[]>([]);

  // Load from localStorage on start
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handlePrioritize = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!taskInput.trim()) {
      setPrioritized(null);
      return;
    }

    setPrioritized(prioritizeRawTask(taskInput));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
            AI Task Prioritization
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            Turn messy tasks into a clear next action
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Enter a task and get a deterministic priority result with a
            transparent explanation.
          </p>
        </header>

        <form
          onSubmit={handlePrioritize}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label
            htmlFor="task-input"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Task input
          </label>
          <textarea
            id="task-input"
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            placeholder="Example: Finish project report tomorrow"
            className="h-28 w-full rounded-xl border border-slate-300 p-3 text-base outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
          <button
            type="submit"
            className="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Prioritize Task
          </button>
        </form>

        {prioritized ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Start This Next</h2>
            <p data-testid="start-this-next" className="mt-2 text-lg">
              {prioritized.normalizedTitle}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <p className="rounded-lg bg-slate-100 p-3">
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                  Bucket
                </span>
                <span data-testid="priority-bucket" className="text-base">
                  {prioritized.result.bucket}
                </span>
              </p>

              <p className="rounded-lg bg-slate-100 p-3">
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                  Confidence
                </span>
                <span className="text-base">{prioritized.result.confidence}</span>
              </p>
            </div>

            <p
              data-testid="priority-explanation"
              className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-slate-700"
            >
              {prioritized.explanation}
            </p>
          </section>
        ) : null}
      </main>
    </div>
  );
}
