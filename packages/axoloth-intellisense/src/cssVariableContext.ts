export interface CssVariableCompletionContext {
  currentToken: string;
  replaceStart: number;
  replaceEnd: number;
}

export interface CssVariableValueCompletionContext {
  variableName: string;
  currentValueToken: string;
  replaceStart: number;
  replaceEnd: number;
}

const AXO_VARIABLE_TOKEN_RE = /--axo[a-z0-9-]*$/;
const AXO_VARIABLE_VALUE_RE = /(?:^|[;{\s])(--axo[a-z0-9-]+)\s*:\s*([^;{}]*)$/;
const CSS_VALUE_TOKEN_RE = /[^\s;{}]*$/;

export function getCssVariableCompletionContext(
  line: string,
  positionCharacter: number
): CssVariableCompletionContext | undefined {
  const beforeCursor = line.slice(0, positionCharacter);
  const match = beforeCursor.match(AXO_VARIABLE_TOKEN_RE);

  if (!match) {
    return undefined;
  }

  const currentToken = match[0];

  return {
    currentToken,
    replaceStart: positionCharacter - currentToken.length,
    replaceEnd: positionCharacter,
  };
}

export function getCssVariableValueCompletionContext(
  line: string,
  positionCharacter: number
): CssVariableValueCompletionContext | undefined {
  const beforeCursor = line.slice(0, positionCharacter);
  const match = beforeCursor.match(AXO_VARIABLE_VALUE_RE);

  if (!match) {
    return undefined;
  }

  const rawValue = match[2] ?? '';
  const tokenMatch = rawValue.match(CSS_VALUE_TOKEN_RE);
  const currentValueToken = tokenMatch?.[0] ?? '';

  return {
    variableName: match[1],
    currentValueToken,
    replaceStart: positionCharacter - currentValueToken.length,
    replaceEnd: positionCharacter,
  };
}
