export interface CompletionContext {
  kind: 'attribute' | 'selector';
  currentToken: string;
  replaceStart: number;
  replaceEnd: number;
  usedClasses: string[];
}

const CLASS_ATTRIBUTE_RE = /\b(?:class|className|class:list)\s*=\s*(?:\{?\s*\[?\s*)?(["'`])/g;
const SELECTOR_RE = /(^|[\s,{])\.([A-Za-z0-9-]*)$/;

export function getCompletionContext(
  line: string,
  positionCharacter: number
): CompletionContext | undefined {
  const beforeCursor = line.slice(0, positionCharacter);
  const attributeContext = getAttributeContext(beforeCursor, positionCharacter);

  if (attributeContext && isAxolothToken(attributeContext.currentToken)) {
    return attributeContext;
  }

  const selectorContext = getSelectorContext(beforeCursor, positionCharacter);

  if (selectorContext && isAxolothToken(selectorContext.currentToken)) {
    return selectorContext;
  }

  return undefined;
}

export function getUsedClassesFromContext(context: CompletionContext): Set<string> {
  return new Set(context.usedClasses.filter((className) => className.startsWith('axo-')));
}

function getAttributeContext(
  beforeCursor: string,
  positionCharacter: number
): CompletionContext | undefined {
  CLASS_ATTRIBUTE_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  let lastMatch: RegExpExecArray | undefined;

  while ((match = CLASS_ATTRIBUTE_RE.exec(beforeCursor))) {
    lastMatch = match;
  }

  if (!lastMatch) {
    return undefined;
  }

  const quote = lastMatch[1];
  const contentStart = lastMatch.index + lastMatch[0].length;
  const content = beforeCursor.slice(contentStart);

  if (content.includes(quote)) {
    return undefined;
  }

  const currentToken = content.match(/[^\s]*$/)?.[0] ?? '';
  const replaceStart = positionCharacter - currentToken.length;
  const usedClasses = content
    .split(/\s+/)
    .map((className) => className.trim())
    .filter(Boolean)
    .filter((className) => className !== currentToken);

  return {
    kind: 'attribute',
    currentToken,
    replaceStart,
    replaceEnd: positionCharacter,
    usedClasses,
  };
}

function getSelectorContext(
  beforeCursor: string,
  positionCharacter: number
): CompletionContext | undefined {
  const selectorMatch = beforeCursor.match(SELECTOR_RE);

  if (!selectorMatch) {
    return undefined;
  }

  const currentToken = selectorMatch[2] ?? '';

  return {
    kind: 'selector',
    currentToken,
    replaceStart: positionCharacter - currentToken.length,
    replaceEnd: positionCharacter,
    usedClasses: [],
  };
}

function isAxolothToken(token: string): boolean {
  return /^axo-?/.test(token);
}
