"use client";

import type { FilterSchema, FilterState } from "@/types/filterEngine";

export default function GlobalFilterPanel({
  schema,
  state,
  onChange,
}: {
  schema: FilterSchema;
  state: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-5">
        <input
          value={String(state.search ?? "")}
          onChange={(e) => onChange({ ...state, search: e.target.value })}
          className="rounded border border-slate-300 px-2 py-2 text-xs"
          placeholder="Global search"
        />
        {schema.definitions.map((def) =>
          def.type === "multi" ? (
            <input
              key={def.key}
              value={String(state[def.key] ?? "")}
              onChange={(e) => onChange({ ...state, [def.key]: e.target.value })}
              className="rounded border border-slate-300 px-2 py-2 text-xs"
              placeholder={def.label}
            />
          ) : def.type === "range" ? (
            <input
              key={def.key}
              value={String((state[def.key] as { min?: number; max?: number })?.min ?? "")}
              onChange={(e) =>
                onChange({
                  ...state,
                  [def.key]: { ...(state[def.key] as object), min: Number(e.target.value || 0) },
                })
              }
              className="rounded border border-slate-300 px-2 py-2 text-xs"
              placeholder={`${def.label} min`}
            />
          ) : def.type === "date_range" ? (
            <input
              key={def.key}
              value={String((state[def.key] as { from?: string; to?: string })?.from ?? "")}
              onChange={(e) =>
                onChange({
                  ...state,
                  [def.key]: { ...(state[def.key] as object), from: e.target.value },
                })
              }
              className="rounded border border-slate-300 px-2 py-2 text-xs"
              placeholder={`${def.label} from`}
            />
          ) : null,
        )}
      </div>
    </section>
  );
}
