"use client";

import { useMemo, useState } from "react";
import type { PatternCategory, PatternLibraryData } from "@/types/patternLibrary";

const categories = [
  "data_privacy_issue",
  "payment_issue",
  "harassment_issue",
  "legal_threat_issue",
  "recovery_issue",
] as const;

const categoryCards = [
  "Contact list abuse",
  "Photo morphing threats",
  "Fake legal notices",
  "Hidden processing fees",
  "Threat calls",
  "Relative calling",
  "Office harassment",
  "Payment not updated",
  "Loan not closed",
  "Data misuse",
  "Personal UPI payment pressure",
  "Abusive recovery calls",
];

function labelize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function PatternLibraryHero() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Understand loan app warning patterns</h1>
      <p className="mt-1 text-sm text-slate-600">Learn what users commonly report, what evidence to preserve, and what steps you may consider.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href="/loan-apps" className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Search loan apps</a>
        <a href="/emergency-help" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Open emergency help</a>
        <a href="/complaint-templates" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Use complaint template</a>
      </div>
    </section>
  );
}

export function PatternCategoryGrid() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Pattern Categories</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
        {categoryCards.map((card) => (
          <div key={card} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{card}</div>
        ))}
      </div>
    </section>
  );
}

export function PatternSearchFilters({
  query,
  onQuery,
  selected,
  onToggle,
}: {
  query: string;
  onQuery: (value: string) => void;
  selected: PatternCategory[];
  onToggle: (value: PatternCategory) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Pattern Search and Filters</h2>
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        placeholder="Search issue name, complaint tag, evidence type, or user situation"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${selected.includes(cat) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700"}`}
          >
            {labelize(cat)}
          </button>
        ))}
      </div>
    </section>
  );
}

export function PatternCard({ pattern }: { pattern: PatternLibraryData["patterns"][number] }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{pattern.title}</h3>
      <p className="mt-1 text-xs text-slate-600">{pattern.description}</p>
      <div className="mt-2 text-xs text-slate-700">
        <p className="font-semibold">What it means</p>
        <p>User-reported pattern that may indicate risk and deserves careful verification.</p>
      </div>
      <div className="mt-2 text-xs text-slate-700">
        <p className="font-semibold">Warning signs</p>
        <ul className="list-disc pl-4">{pattern.warningSigns.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <div className="mt-2 text-xs text-slate-700">
        <p className="font-semibold">What to preserve</p>
        <ul className="list-disc pl-4">{pattern.evidenceToPreserve.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <div className="mt-2 text-xs text-slate-700">
        <p className="font-semibold">What not to share</p>
        <ul className="list-disc pl-4">{pattern.whatNotToShare.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={pattern.relatedTemplateUrl} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Related complaint template</a>
        <a href={pattern.relatedReviewsUrl} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Related reviews</a>
        <a href={`/patterns/${pattern.slug}`} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">Read full guide</a>
      </div>
    </article>
  );
}

export function PopularPatternGuides({ guides }: { guides: PatternLibraryData["popularGuides"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Popular Guides</h2>
      <div className="mt-3 space-y-2">
        {guides.map((g) => (
          <a key={g.id} href={`/patterns/${g.slug}`} className="block rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-900">{g.title}</p>
            <p className="text-xs text-slate-600">Most-read guide • {g.readCount.toLocaleString()} reads</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export function PatternDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
      This library explains user-reported warning patterns for awareness. It is not legal advice and does not prove wrongdoing by any specific app or company.
    </section>
  );
}

export default function PredatoryPatternLibraryPage({ data }: { data: PatternLibraryData }) {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<PatternCategory[]>([]);

  const filtered = useMemo(() => {
    return data.patterns.filter((p) => {
      const bucket = [p.title, p.description, ...p.warningSigns, ...p.evidenceToPreserve, ...p.tags].join(" ").toLowerCase();
      if (query && !bucket.includes(query.toLowerCase())) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      return true;
    });
  }, [data.patterns, query, selectedCategories]);

  const toggleCategory = (cat: PatternCategory) => {
    setSelectedCategories((prev) => (prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1300px] space-y-4">
        <PatternLibraryHero />
        <PatternCategoryGrid />
        <PatternSearchFilters query={query} onQuery={setQuery} selected={selectedCategories} onToggle={toggleCategory} />
        <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {filtered.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </section>
        <PopularPatternGuides guides={data.popularGuides} />
        <PatternDisclaimerBox />
      </div>
    </main>
  );
}
