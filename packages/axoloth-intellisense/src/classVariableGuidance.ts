export interface ClassVariableReference {
  name: string;
  relatedVariables: string[];
}

export interface RelatedVariableEntry {
  name: string;
  default: string;
  description: string;
}

export function resolveRelatedVariables<T extends RelatedVariableEntry>(
  entry: ClassVariableReference,
  variableMap: ReadonlyMap<string, T>
): T[] {
  return entry.relatedVariables.flatMap((variableName) => {
    const variable = variableMap.get(variableName);
    return variable ? [variable] : [];
  });
}

export function createRelatedVariablesMarkdown<T extends RelatedVariableEntry>(
  entry: ClassVariableReference,
  variableMap: ReadonlyMap<string, T>
): string {
  const variables = resolveRelatedVariables(entry, variableMap);

  if (!variables.length) return '';

  const variableList = variables
    .map(
      (variable) =>
        `- \`${variable.name}\` (default: \`${variable.default}\`) - ${variable.description}`
    )
    .join('\n');
  const exampleVariables = variables
    .slice(0, 3)
    .map((variable) => `  ${variable.name}: ${variable.default};`)
    .join('\n');

  return [
    '**Related variables**',
    '',
    variableList,
    '',
    `Override these variables on \`.${entry.name}\` or a containing scope.`,
    '',
    '```css',
    `.${entry.name} {`,
    exampleVariables,
    '}',
    '```',
  ].join('\n');
}
