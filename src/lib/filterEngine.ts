import type { FilterDefinition, FilterSchema, FilterState, FilterValue } from "@/types/filterEngine";

function getByPath(obj: unknown, path?: string): unknown {
  if (!path) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function includesSearch(item: unknown, fields: string[], query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return fields.some((path) => String(getByPath(item, path) ?? "").toLowerCase().includes(q));
}

function matchesDefinition(item: unknown, definition: FilterDefinition, value: FilterValue): boolean {
  if (definition.type === "search") return true;
  const fieldValue = getByPath(item, definition.fieldPath);

  if (definition.type === "multi") {
    const selected = Array.isArray(value) ? value : [String(value)];
    if (!selected.length) return true;
    if (Array.isArray(fieldValue)) return selected.some((s) => fieldValue.map(String).includes(s));
    return selected.includes(String(fieldValue ?? ""));
  }

  if (definition.type === "range") {
    const fv = Number(fieldValue ?? 0);
    const min = typeof value === "object" && value && "min" in value ? Number(value.min ?? Number.MIN_SAFE_INTEGER) : Number.MIN_SAFE_INTEGER;
    const max = typeof value === "object" && value && "max" in value ? Number(value.max ?? Number.MAX_SAFE_INTEGER) : Number.MAX_SAFE_INTEGER;
    return fv >= min && fv <= max;
  }

  if (definition.type === "date_range") {
    const date = new Date(String(fieldValue ?? ""));
    if (Number.isNaN(date.getTime())) return false;
    const from = typeof value === "object" && value && "from" in value && value.from ? new Date(value.from) : undefined;
    const to = typeof value === "object" && value && "to" in value && value.to ? new Date(value.to) : undefined;
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  }

  return true;
}

export function applyGlobalFilters<T>(items: T[], schema: FilterSchema, state: FilterState): T[] {
  const search = String(state.search ?? "");
  return items.filter((item) => {
    if (!includesSearch(item, schema.searchableFields, search)) return false;
    for (const def of schema.definitions) {
      const selected = state[def.key];
      if (selected === undefined || selected === "" || (Array.isArray(selected) && selected.length === 0)) continue;
      if (!matchesDefinition(item, def, selected)) return false;
    }
    return true;
  });
}
