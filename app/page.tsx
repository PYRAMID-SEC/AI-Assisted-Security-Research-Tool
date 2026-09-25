"use client";

import { FormEvent, useState } from "react";

type AnalysisResult = {
  potentialSecurityIssue: string;
  reasoning: string;
  whatToTest: string;
  potentialImpact: string;
  suggestedNextSteps: string;
};

const resultSections: { key: keyof AnalysisResult; title: string }[] = [
  { key: "potentialSecurityIssue", title: "Potential Security Issue" },
  { key: "reasoning", title: "Reasoning" },
  { key: "whatToTest", title: "What to Test" },
  { key: "potentialImpact", title: "Potential Impact" },
  { key: "suggestedNextSteps", title: "Suggested Next Steps" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = (await response.json()) as AnalysisResult & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "The analysis could not be completed.");
      }

      setResult(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Security research assistant
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            AI-Assisted Security Research Tool
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Analyze HTTP traffic and security findings with local security checks.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <label htmlFor="security-input" className="mb-2 block text-sm font-semibold text-slate-800">
            Security information
          </label>
          <textarea
            id="security-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Paste an HTTP request, response, source-code snippet, or vulnerability note..."
            rows={14}
            required
            className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-xs leading-5 text-slate-500">Analyze only information from authorized testing.</p>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </form>

        {error && (
          <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <section aria-labelledby="results-heading" className="mt-10">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 id="results-heading" className="text-xl font-bold text-slate-950">Analysis Results</h2>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Local analysis</span>
            </div>
            <div className="space-y-3">
              {resultSections.map(({ key, title }) => (
                <article key={key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-blue-700">{title}</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{result[key]}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
