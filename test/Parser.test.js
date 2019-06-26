import assert from 'assert';
import parseToAst from '../src/Parser';
import AstNode from '../src/AstNode';

describe('Parser', () => {
  it('throws if first argument is not string', () => {
    assert.throws(() => parseToAst(), new TypeError('Parser requires a string'));
    assert.throws(() => parseToAst(null), new TypeError('Parser requires a string'));
    assert.throws(() => parseToAst([]), new TypeError('Parser requires a string'));
    assert.throws(() => parseToAst({}), new TypeError('Parser requires a string'));
    assert.throws(() => parseToAst(0), new TypeError('Parser requires a string'));
    assert.throws(() => parseToAst(1), new TypeError('Parser requires a string'));
    assert.throws(() => parseToAst(true), new TypeError('Parser requires a string'));
  });

  it('throws if give invalid html', () => {
    assert.throws(() => parseToAst('<div>'), SyntaxError);
    assert.throws(() => parseToAst('<div><h1></div>'), SyntaxError);
    assert.throws(() => parseToAst('<test-x</>'), SyntaxError);
  });

  it('handles empty string', () => {
    assert.deepEqual(parseToAst(''), []);
  });

  it('parses attributes on an element', () => {
    const html = `
      <div id="someId" class="hello world" test="a-value">
      </div>
    `;
    assert.deepEqual(parseToAst(html), [
      new AstNode('DIV', { id: 'someId', class: 'hello world', test: 'a-value' }),
    ]);
  });

  it('parses children of an element', () => {
    const html = `
      <div id="topLevelDiv">
        <p id="p1"></p>
        <p id="p2"></p>
        <p id="p3"></p>
      </div>
    `;
    assert.deepEqual(parseToAst(html), [
      new AstNode('DIV', { id: 'topLevelDiv', }).addChildren([
        new AstNode('P', { id: 'p1'}),
        new AstNode('P', { id: 'p2'}),
        new AstNode('P', { id: 'p3'}),
      ])
    ]);
  });
});
