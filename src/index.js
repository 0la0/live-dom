import parseToAst from './Parser';
import astToDom from './Evaluator';

function wrapHtmlStringInDiv(htmlString) {
  return `<div>${htmlString}</div>`;
}

export default class LiveDom {
  constructor({ html = '', domNode }) {
    if (!domNode || !(domNode instanceof window.HTMLElement)) {
      throw new Error('LiveDom constructor requires a dom node');
    }
    this.domNode = domNode;
    this.html = html;
    if (this.domNode.children.length) {
      [ ...this.domNode.children].forEach(child => this.domNode.removeChild(child));
    }
    if (html) {
      this.setHtml(html);
    }
  }

  setHtml(htmlString) {
    const wrappedHtmlString = wrapHtmlStringInDiv(htmlString);
    try {
      const ast = parseToAst(wrappedHtmlString);
      if (ast.length > 1) {
        throw new Error('Ambiguous root node', ast);
      }
      const lastAstRoot = this.lastAst && this.lastAst[0];
      astToDom(ast[0], lastAstRoot, this.domNode, undefined);

      this.lastAst = ast;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
