"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Result = {
  resume_feedback: string;
  interview_questions: string[];
  learning_roadmap: string[];
};

export default function Home() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [goal, setGoal] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function handleGenerate() {
    if (!role || !experience || !goal) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, experience, goal }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate guidance");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4 py-14">
      <div className="max-w-5xl mx-auto space-y-14">

        {/* HERO */}
        <section className="text-center space-y-4">
          <span className="inline-block rounded-full bg-indigo-100 text-indigo-700 px-4 py-1 text-sm font-medium">
            AI Career Assistant
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Career Prep AI Agent
          </h1>

          <p className="max-w-2xl mx-auto text-slate-600 text-lg">
            Personalized resume feedback, interview preparation, and a focused learning roadmap — tailored to your career goals.
          </p>
        </section>

        {/* INPUT CARD */}
        <section className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Tell us about your goal
          </h2>

          <div className="grid gap-5">
            <Input
              label="Target Role"
              placeholder="e.g. Data Analyst"
              value={role}
              onChange={setRole}
            />

            <Textarea
              label="Your Experience"
              placeholder="Briefly describe your background"
              value={experience}
              onChange={setExperience}
            />

            <Textarea
              label="Career Goal"
              placeholder="What are you aiming for next?"
              value={goal}
              onChange={setGoal}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Generating insights…" : "Generate Career Guidance"}
          </button>

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </section>

        {/* RESULTS */}
        {result && (
          <section className="grid md:grid-cols-3 gap-6">
            <ResultCard title="Resume Feedback">
              <p className="text-slate-600 leading-relaxed">
                {result.resume_feedback}
              </p>
            </ResultCard>

            <ResultCard title="Interview Questions">
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                {result.interview_questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </ResultCard>

            <ResultCard title="Learning Roadmap">
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                {result.learning_roadmap.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </ResultCard>
          </section>
        )}
      </div>
    </main>
  );
}

/* ---------- Components ---------- */

function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function Textarea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function ResultCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

