export interface DataAttributeCompletionContext {
  currentToken: string;
  replaceStart: number;
  replaceEnd: number;
  usedAttributes: string[];
}

const ATTRIBUTE_TOKEN_RE = /[A-Za-z0-9:-]*$/;
const DATA_ATTRIBUTE_RE = /\b(data-axo-[a-z0-9]+(?:-[a-z0-9]+)*)\b/g;

export function getDataAttributeCompletionContext(
  line: string,
  positionCharacter: number
): DataAttributeCompletionContext | undefined {
  const beforeCursor = line.slice(0, positionCharacter);
  const tagStart = beforeCursor.lastIndexOf('<');
  const tagEnd = beforeCursor.lastIndexOf('>');

  if (tagStart === -1 || tagStart < tagEnd) {
    return undefined;
  }

  const tagFragment = beforeCursor.slice(tagStart);

  if (/^<\/|^<!--/.test(tagFragment) || isInsideQuotedValue(tagFragment)) {
    return undefined;
  }

  const currentToken = tagFragment.match(ATTRIBUTE_TOKEN_RE)?.[0] ?? '';

  if (!/^data-axo-?/.test(currentToken)) {
    return undefined;
  }

  return {
    currentToken,
    replaceStart: positionCharacter - currentToken.length,
    replaceEnd: positionCharacter,
    usedAttributes: getUsedDataAttributes(tagFragment, currentToken),
  };
}

function isInsideQuotedValue(fragment: string): boolean {
  let quote: string | undefined;

  for (let index = 0; index < fragment.length; index += 1) {
    const character = fragment[index];

    if (character !== '"' && character !== "'" && character !== '`') {
      continue;
    }

    if (!quote) {
      quote = character;
    } else if (quote === character && fragment[index - 1] !== '\\') {
      quote = undefined;
    }
  }

  return Boolean(quote);
}

function getUsedDataAttributes(fragment: string, currentToken: string): string[] {
  DATA_ATTRIBUTE_RE.lastIndex = 0;
  const usedAttributes: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = DATA_ATTRIBUTE_RE.exec(fragment))) {
    const attributeName = match[1];

    if (attributeName !== currentToken) {
      usedAttributes.push(attributeName);
    }
  }

  return usedAttributes;
}
