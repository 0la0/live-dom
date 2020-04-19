import assert from 'assert';
import { buildNewWindow, domEquality } from './util.js';
import LiveDom from '../src/index.js';

describe('Evaluator', () => {
  beforeEach(() => {
    const window = buildNewWindow();
    global.window = window;
    global.document = window.document;
  });

  it('builds accurate dom one level deep', () => {
    const userInputHtml = `
      <div id="someId" class="hello world" test="a-value">
        <p></p>
      </div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml,
      domNode: global.document.createElement('div')
    });
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
  });

  it('builds accurate dom two levels deep', () => {
    const userInputHtml = `
      <div id="someId" class="hello world" test="a-value">
        <div an-attribute="foo"></div>
        <div an-attribute="bar">
          <p a-tag="hi">hello</p>
        </div>
        <div an-attribute="something"></div>
        <div an-attribute="else">
          <p a-tag="hi">world</p>
        </div>
      </div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml,
      domNode: global.document.createElement('div')
    });
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
  });

  it('updates dom on a second pass with no changes', () => {
    const userInputHtml = `
      <div id="someId" class="hello world" test="a-value">
        <div an-attribute="foo"></div>
        <div an-attribute="bar">
          <p a-tag="hi">hello</p>
        </div>
        <div an-attribute="something"></div>
        <div an-attribute="else">
          <p a-tag="hi">world</p>
        </div>
      </div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml,
      domNode: global.document.createElement('div')
    });
    const result = liveDom.setHtml(userInputHtml);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
    assert.ok(result.ok);
  });

  it('updates dom on a second pass with additions', () => {
    const userInputHtml1 = `
      <div id="someId" class="hello world" test="a-value">
        <div an-attribute="foo"></div>
        <div an-attribute="bar">
          <p a-tag="hi">hello</p>
        </div>
        <div an-attribute="something"></div>
        <div an-attribute="else">
          <p a-tag="hi">world</p>
        </div>
      </div>
    `;
    const userInputHtml2 = `
      <div id="someId" class="hello world" test="a-value">
        <div an-attribute="foo"></div>
        <div an-attribute="bar">
          <p a-tag="hi">hello</p>
        </div>
        <div an-attribute="something"></div>
        <div an-attribute="else">
          <p a-tag="hi">world</p>
        </div>
        <p>i am new</p>
      </div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml1,
      domNode: global.document.createElement('div')
    });
    const result = liveDom.setHtml(userInputHtml2);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml2;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
    assert.ok(result.ok);
  });

  it('updates dom on a second pass with removals', () => {
    const userInputHtml1 = `
      <div id="someId" class="hello world" test="a-value">
        <div an-attribute="foo"></div>
        <div an-attribute="bar">
          <p a-tag="hi">hello</p>
        </div>
        <div an-attribute="something"></div>
        <div an-attribute="else">
          <p a-tag="hi">world</p>
        </div>
      </div>
    `;
    const userInputHtml2 = `
      <div id="someId" class="hello world" test="a-value">
        <div an-attribute="foo"></div>
        <div an-attribute="bar">
          <p a-tag="hi">hello</p>
        </div>
      </div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml1,
      domNode: global.document.createElement('div')
    });
    const result = liveDom.setHtml(userInputHtml2);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml2;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
    assert.ok(result.ok);
  });

  it('updates dom on a second pass with updates', () => {
    const userInputHtml1 = `
      <div id="someId" class="hello world" test="a-value">
        <div an-attribute="foo"></div>
        <div an-attribute="bar">
          <p a-tag="hi">hello</p>
        </div>
        <div an-attribute="something"></div>
        <div an-attribute="else">
          <p a-tag="hi">world</p>
        </div>
      </div>
    `;
    const userInputHtml2 = `
      <div id="someId" class="hello" test="a-value">
        <div an-attribute="foo"></div>
        <div>
          <p a-tag="bye">hello</p>
        </div>
        <div an-attribute="something"></div>
        <div an-attribute="else">
          <p>world</p>
        </div>
      </div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml1,
      domNode: global.document.createElement('div')
    });
    const result = liveDom.setHtml(userInputHtml2);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml2;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
    assert.ok(result.ok);
  });

  it('updates dom on a third pass with updates and removals', () => {
    const userInputHtml1 = `
      <div id="someId" class="hello world" test="a-value">
        <div an-attribute="foo"></div>
        <div an-attribute="bar">
          <p a-tag="hi">hello</p>
        </div>
        <div an-attribute="something"></div>
        <div an-attribute="else">
          <p a-tag="hi">world</p>
        </div>
      </div>
    `;
    const userInputHtml2 = `
      <div id="someId" class="hello" test="a-value">
        <div an-attribute="foo"></div>
        <div>
          <p a-tag="bye">hello</p>
        </div>
        <div an-attribute="something"></div>
        <div an-attribute="else">
          <p>world</p>
        </div>
      </div>
    `;
    const userInputHtml3 = `
      <div id="someId" class="hello" test="a-value">
        <div an-attribute="foo"></div>
        <div>
          <p a-tag="bye">hello</p>
        </div>
        <div an-attribute="something"></div>
        <div an-attribute="hello">
        </div>
      </div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml1,
      domNode: global.document.createElement('div')
    });
    const result1 = liveDom.setHtml(userInputHtml2);
    const result2 = liveDom.setHtml(userInputHtml3);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml3;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
    assert.ok(result1.ok);
    assert.ok(result2.ok);
  });

  it('creates attributes', () => {
    const userInputHtml1 = `
      <div></div>
    `;
    const userInputHtml2 = `
      <div id="someId" foo="bar"></div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml1,
      domNode: global.document.createElement('div')
    });
    const result = liveDom.setHtml(userInputHtml2);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml2;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
    assert.ok(result.ok);
  });

  it('handles attributes without values', () => {
    const userInputHtml = `
      <div foo></div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml,
      domNode: global.document.createElement('div')
    });
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
  });

  it('handles livedomignore key attribute', () => {
    const userInputHtml1 = `
      <div id="foo"></div>
    `;
    const userInputHtml2 = `
      <div id="bar"></div>
    `;
    const expectedHtml1 = `
      <div livedomignore id="cool"></div>
      <div id="foo"></div>
    `;
    const expectedHtml2 = `
      <div livedomignore id="cool"></div>
      <div id="bar"></div>
    `;
    const domNode = global.document.createElement('div');
    const terminateNode = global.document.createElement('div');
    terminateNode.setAttribute('livedomignore', '');
    terminateNode.setAttribute('id', 'cool');
    domNode.appendChild(terminateNode);
    const liveDom = new LiveDom({
      html: userInputHtml1,
      domNode
    });
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = expectedHtml1;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
    const result = liveDom.setHtml(userInputHtml2);
    injectedElement.innerHTML = expectedHtml2;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
    assert.ok(result.ok);
  });

  it('handles updats with livedomignore key attribute', () => {
    const userInputHtml1 = `
      <div id="foo"></div>
    `;
    const userInputHtml2 = `
      <div id="bar"></div>
      <p id="hello"></p>
    `;
    const expectedHtml1 = `
      <div livedomignore id="cool"></div>
      <div id="foo"></div>
    `;
    const expectedHtml2 = `
      <div livedomignore id="cool"></div>
      <div id="bar"></div>
      <p id="hello"></p>
    `;
    const domNode = global.document.createElement('div');
    const terminateNode = global.document.createElement('div');
    terminateNode.setAttribute('livedomignore', '');
    terminateNode.setAttribute('id', 'cool');
    domNode.appendChild(terminateNode);
    const liveDom = new LiveDom({
      html: userInputHtml1,
      domNode
    });
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = expectedHtml1;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
    const result = liveDom.setHtml(userInputHtml2);
    injectedElement.innerHTML = expectedHtml2;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
    assert.ok(result.ok);
  });

  it('dispose', () => {
    const userInputHtml = `
      <div id="someId" class="hello world" test="a-value">
        <p></p>
      </div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml,
      domNode: global.document.createElement('div')
    });
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml;
    assert.ok(domEquality(liveDom.domNode, injectedElement));

    liveDom.dispose();
    injectedElement.innerHTML = '';
    assert.ok(domEquality(liveDom.domNode, injectedElement));
  });

  it('returns not OK for invalid HTML', () => {
    const userInputHtml1 = '<div><p>hello</p></div>';
    const userInputHtml2 = '<div><p>';
    const expectedHtml1 = '<div><p>hello</p></div>';
    const expectedHtml2 = '<div><p>hello</p></div>';
    const domNode = global.document.createElement('div');
    const terminateNode = global.document.createElement('div');
    terminateNode.setAttribute('livedomignore', '');
    terminateNode.setAttribute('id', 'cool');
    domNode.appendChild(terminateNode);
    const liveDom = new LiveDom({
      html: userInputHtml1,
      domNode
    });
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = expectedHtml1;
    const result = liveDom.setHtml(userInputHtml2);
    injectedElement.innerHTML = expectedHtml2;
    assert.ok(!result.ok);
    assert.equal(result.message, 'Expected corresponding JSX closing tag for <p> (3:0)');
  });

  it('handles single line JSX comments', () => {
    const userInputHtml = `
      <div id="someId" class="hello world" test="a-value">
        // <p></p>
        <ul></ul>
        // <p></p>
        <aside></aside>
      </div>
    `;
    const expectedHtml = `
      <div id="someId" class="hello world" test="a-value">
        <ul></ul>
        <aside></aside>
      </div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml,
      domNode: global.document.createElement('div')
    });
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = expectedHtml;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
  });

  it('handles single line JSX comments', () => {
    const userInputHtml = `
      <div id="someId" class="hello world" test="a-value">
        // <div>
          <p></p>
          <ul></ul>
        // </div>
      </div>
    `;
    const expectedHtml = `
      <div id="someId" class="hello world" test="a-value">
        <p></p>
        <ul></ul>
      </div>
    `;
    const liveDom = new LiveDom({
      html: userInputHtml,
      domNode: global.document.createElement('div')
    });
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = expectedHtml;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
  });
});
