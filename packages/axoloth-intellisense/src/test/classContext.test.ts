import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getDataAttributeCompletionContext } from '../behaviorContext';
import { getCompletionContext } from '../classContext';
import { findClosestClass } from '../classMatcher';
import {
  getCssVariableCompletionContext,
  getCssVariableValueCompletionContext,
} from '../cssVariableContext';
import { formatDeprecationSummary } from '../deprecation';

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

{
  const closestClass = findClosestClass('axo-bentoo', ['axo-bento', 'axo-card']);
  assert.equal(closestClass, 'axo-bento');
}

{
  const closestClass = findClosestClass('axo-very-far-away', ['axo-bento', 'axo-card']);
  assert.equal(closestClass, undefined);
}

{
  const { line, position } = parseCursor('--axo-|');
  const context = getCssVariableCompletionContext(line, position);
  assert.equal(context?.currentToken, '--axo-');
}

{
  const { line, position } = parseCursor(':where(--axo|)');
  const context = getCssVariableCompletionContext(line, position);
  assert.equal(context?.currentToken, '--axo');
}

{
  const { line, position } = parseCursor('.card { color: red|; }');
  const context = getCssVariableCompletionContext(line, position);
  assert.equal(context, undefined);
}

{
  const { line, position } = parseCursor('--axo-lift-distance: |');
  const context = getCssVariableValueCompletionContext(line, position);
  assert.equal(context?.variableName, '--axo-lift-distance');
  assert.equal(context?.currentValueToken, '');
}

{
  const { line, position } = parseCursor('--axo-delay: 5|');
  const context = getCssVariableValueCompletionContext(line, position);
  assert.equal(context?.variableName, '--axo-delay');
  assert.equal(context?.currentValueToken, '5');
}

{
  const { line, position } = parseCursor('--not-axo: |');
  const context = getCssVariableValueCompletionContext(line, position);
  assert.equal(context, undefined);
}

{
  const { line, position } = parseCursor('color: |');
  const context = getCssVariableValueCompletionContext(line, position);
  assert.equal(context, undefined);
}

{
  const summary = formatDeprecationSummary({
    status: 'deprecated',
    deprecation: {
      replacement: 'axo-new',
      deprecatedIn: '1.1.0',
      removeIn: '1.2.0',
      note: 'Use the new layout primitive.',
    },
  });
  assert.equal(
    summary,
    'Deprecated since 1.1.0. Use axo-new. Earliest removal: 1.2.0. Use the new layout primitive.'
  );
}

{
  const { line, position } = parseCursor('<button data-axo-|></button>');
  const context = getDataAttributeCompletionContext(line, position);
  assert.equal(context?.currentToken, 'data-axo-');
}

{
  const { line, position } = parseCursor('<div data-axo-tabs data-axo-|></div>');
  const context = getDataAttributeCompletionContext(line, position);
  assert.deepEqual(context?.usedAttributes, ['data-axo-tabs']);
}

{
  const { line, position } = parseCursor('<div class="data-axo-|"></div>');
  const context = getDataAttributeCompletionContext(line, position);
  assert.equal(context, undefined);
}

{
  const { line, position } = parseCursor('const attr = "data-axo-|";');
  const context = getDataAttributeCompletionContext(line, position);
  assert.equal(context, undefined);
}

{
  const { line, position } = parseCursor('</div data-axo-|');
  const context = getDataAttributeCompletionContext(line, position);
  assert.equal(context, undefined);
}

{
  const registry = JSON.parse(
    readFileSync(resolve(process.cwd(), 'data/behavior.registry.json'), 'utf8')
  );
  assert.equal(
    registry.dataAttributes.some((entry: { name: string }) => entry.name === 'data-axo-tabs'),
    true
  );
  assert.equal(
    registry.events.some((entry: { name: string }) => entry.name === 'axo:dialog-open'),
    true
  );
  assert.equal(
    registry.initializers.some((entry: { name: string }) => entry.name === 'initDialog'),
    true
  );
}

console.log('Axoloth IntelliSense tests passed');
