import type { PatternDetailData } from "@/types/patternDetail";
import HarassmentEvidenceChecklist from "@/components/safety/HarassmentEvidenceChecklist";

function cautionTone(level: PatternDetailData["cautionLevel"]) {
  if (level === "high") return "bg-rose-100 text-rose-700";
  if (level === "medium") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export function PatternHero({ pattern }: { pattern: PatternDetailData }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">{pattern.title}</h1>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{pattern.category}</span>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cautionTone(pattern.cautionLevel)}`}>Caution: {pattern.cautionLevel}</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{pattern.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href="/complaint-templates" className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Use complaint template</a>
        <a href="/legal-action-guide" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Open legal action guide</a>
        <a href="/loan-apps/app-cashnest/submit-review" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Report experience</a>
      </div>
    </section>
  );
}

export function PatternMeaningSection({ meaning }: { meaning: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">What This Pattern Means</h2>
      <p className="mt-2 text-sm text-slate-700">{meaning}</p>
    </section>
  );
}

export function WarningSignsGrid({ signs }: { signs: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Warning Signs</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {signs.map((sign) => (
          <article key={sign} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{sign}</article>
        ))}
      </div>
    </section>
  );
}

export function EvidencePreserveChecklist({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Evidence to Preserve</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
            <input type="checkbox" />
            {item}
          </label>
        ))}
      </div>
    </section>
  );
}

export function PatternWhatNotToDo({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-amber-900">What Not To Do</h2>
      <ul className="mt-3 space-y-2 text-sm text-amber-900">
        {items.map((item) => (
          <li key={item} className="rounded-lg bg-white/70 p-2">{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function PatternNextActions({ actions }: { actions: PatternDetailData["nextActions"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">What You Can Do Next</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <article key={action.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{action.title}</p>
            <p className="mt-1 text-xs text-slate-600">{action.description}</p>
            <a href={action.ctaUrl} className="mt-2 inline-block rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">{action.ctaLabel}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RelatedAppsByPattern({ apps }: { apps: PatternDetailData["relatedApps"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Related Loan Apps</h2>
      <p className="mt-1 text-xs text-slate-600">Apps with user-submitted reviews mentioning this pattern.</p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {apps.map((app) => (
          <article key={app.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <img src={app.logoUrl} alt={app.name} className="h-10 w-10 rounded-lg border border-slate-200" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{app.name}</p>
              <p className="text-xs text-slate-600">Trust score: {app.trustScore}</p>
            </div>
            <a href={app.profileUrl} className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700">View</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RelatedReviewsByPattern({ reviews }: { reviews: PatternDetailData["relatedReviews"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Related Reviews</h2>
      <div className="mt-3 space-y-2">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{review.appName} | {review.rating} stars</p>
            <p className="mt-1 text-sm text-slate-700">{review.excerpt}</p>
            <a href={review.reviewUrl} className="mt-2 inline-block rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700">Open review</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RelatedTemplates({ templates }: { templates: PatternDetailData["relatedTemplates"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Related Templates</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {templates.map((template) => (
          <article key={template.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{template.title}</p>
            <p className="mt-1 text-xs text-slate-600">{template.summary}</p>
            <a href={template.url} className="mt-2 inline-block rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">Use template</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PatternDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
      This page is for awareness and does not make final legal findings.
    </section>
  );
}

export default function PatternDetailPage({ pattern }: { pattern: PatternDetailData }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1200px] space-y-4">
        <PatternHero pattern={pattern} />
        <PatternMeaningSection meaning={pattern.meaning} />
        <WarningSignsGrid signs={pattern.warningSigns} />
        <EvidencePreserveChecklist items={pattern.evidenceChecklist} />
        <PatternWhatNotToDo items={pattern.whatNotToDo} />
        <HarassmentEvidenceChecklist />
        <PatternNextActions actions={pattern.nextActions} />
        <RelatedAppsByPattern apps={pattern.relatedApps} />
        <RelatedReviewsByPattern reviews={pattern.relatedReviews} />
        <RelatedTemplates templates={pattern.relatedTemplates} />
        <PatternDisclaimerBox />
      </div>
    </main>
  );
}
