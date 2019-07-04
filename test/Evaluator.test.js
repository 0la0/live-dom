import assert from 'assert';
import { buildNewWindow, domEquality } from './util';
import LiveDom from '../src/index';

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
    liveDom.setHtml(userInputHtml);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
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
    liveDom.setHtml(userInputHtml2);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml2;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
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
    liveDom.setHtml(userInputHtml2);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml2;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
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
    liveDom.setHtml(userInputHtml2);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml2;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
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
    liveDom.setHtml(userInputHtml2);
    liveDom.setHtml(userInputHtml3);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml3;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
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
    liveDom.setHtml(userInputHtml2);
    const injectedElement = global.document.createElement('div');
    injectedElement.innerHTML = userInputHtml2;
    assert.ok(domEquality(liveDom.domNode, injectedElement));
  });
});
