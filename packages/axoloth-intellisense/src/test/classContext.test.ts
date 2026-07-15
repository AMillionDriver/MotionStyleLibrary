import assert from 'node:assert/strict';
import { getCompletionContext } from '../classContext';

function parseCursor(input: string): { line: string; position: number } {
  const position = input.indexOf('|');

  if (position === -1) {
    throw new Error('Test input must contain a cursor marker: |');
  }

  return {
    line: input.slice(0, position) + input.slice(position + 1),
    position,
  };
}

function contextFor(input: string) {
  const { line, position } = parseCursor(input);
  return getCompletionContext(line, position);
}

{
  const context = contextFor('<div class="axo-|"></div>');
  assert.equal(context?.kind, 'attribute');
  assert.equal(context?.currentToken, 'axo-');
}

{
  const context = contextFor('<div className="axo-|"></div>');
  assert.equal(context?.kind, 'attribute');
  assert.equal(context?.currentToken, 'axo-');
}

{
  const context = contextFor('<div className="axo-card axo-|"></div>');
  assert.deepEqual(context?.usedClasses, ['axo-card']);
}

{
  const context = contextFor('const axis = "ax|";');
  assert.equal(context, undefined);
}

{
  const context = contextFor('.axo-| { display: block; }');
  assert.equal(context?.kind, 'selector');
  assert.equal(context?.currentToken, 'axo-');
}

{
  const context = contextFor('<div title="axo-|"></div>');
  assert.equal(context, undefined);
}

console.log('classContext tests passed');
