export interface AxolothDeprecation {
  replacement: string;
  deprecatedIn: string;
  removeIn: string;
  note: string;
}

export interface DeprecatableEntry {
  status?: 'active' | 'deprecated';
  deprecation?: AxolothDeprecation;
}

export function formatDeprecationSummary(entry: DeprecatableEntry): string | undefined {
  if (entry.status !== 'deprecated' || !entry.deprecation) return undefined;

  return `Deprecated since ${entry.deprecation.deprecatedIn}. Use ${entry.deprecation.replacement}. Earliest removal: ${entry.deprecation.removeIn}. ${entry.deprecation.note}`;
}
