import type { ScoreExplainerData } from "@/types/scoreExplainer";

export function ScoreExplainerHero() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">How our scores work</h1>
      <p className="mt-1 text-sm text-slate-600">Understand how trust scores, risk labels, complaint patterns, and verification signals are calculated.</p>
    </section>
  );
}

export function TrustScoreMeaning() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">What the Trust Score Means</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        <li>Score range is 0-100.</li>
        <li>Scores are based on multiple weighted signals.</li>
        <li>Scores are not final legal findings.</li>
        <li>Scores may change over time as new information becomes available.</li>
      </ul>
    </section>
  );
}

export function ScoreComponentGrid({ components }: { components: ScoreExplainerData["components"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Score Components</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {components.map((component) => (
          <article key={component.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{component.title}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{component.weightHint}</p>
            <p className="mt-1 text-xs text-slate-600">{component.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RiskLabelExplanation({ labels }: { labels: ScoreExplainerData["riskLabels"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Risk Label Explanation</h2>
      <div className="mt-3 space-y-2">
        {labels.map((label) => (
          <article key={label.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-900">{label.label}</p>
            <p className="mt-1 text-slate-700"><span className="font-medium">Meaning:</span> {label.meaning}</p>
            <p className="text-slate-700"><span className="font-medium">How it may appear:</span> {label.howItMayAppear}</p>
            <p className="text-slate-700"><span className="font-medium">What users should verify:</span> {label.whatToVerify}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ScoreDoesNotAffectSection({ items }: { items: ScoreExplainerData["excludedFactors"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">What Does Not Affect Score</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function WhyScoresChange({ reasons }: { reasons: ScoreExplainerData["scoreChangeReasons"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Why Scores Change</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {reasons.map((reason) => (
          <div key={reason} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{reason}</div>
        ))}
      </div>
    </section>
  );
}

export function ExampleScoreBreakdown({ example }: { example: ScoreExplainerData["exampleBreakdown"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Example Score Breakdown</h2>
      <p className="mt-1 text-sm text-slate-600">{example.appName} • Score {example.score}/100 • Updated {example.updatedAt}</p>
      <div className="mt-3 space-y-2">
        {example.factors.map((factor) => (
          <article key={factor.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-900">{factor.name} <span className="text-xs text-slate-500">({factor.impact >= 0 ? "+" : ""}{factor.impact})</span></p>
            <p className="mt-1 text-xs text-slate-600">{factor.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ScoreDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
      Scores are awareness indicators, not legal, financial, or regulatory advice.
    </section>
  );
}

export default function SafetyScoreExplainerPage({ data }: { data: ScoreExplainerData }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1250px] space-y-4">
        <ScoreExplainerHero />
        <TrustScoreMeaning />
        <ScoreComponentGrid components={data.components} />
        <RiskLabelExplanation labels={data.riskLabels} />
        <ScoreDoesNotAffectSection items={data.excludedFactors} />
        <WhyScoresChange reasons={data.scoreChangeReasons} />
        <ExampleScoreBreakdown example={data.exampleBreakdown} />
        <ScoreDisclaimerBox />
      </div>
    </main>
  );
}
