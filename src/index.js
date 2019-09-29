import parseToAst from './Parser';
import astToDom from './Evaluator';

function wrapHtmlStringInDiv(htmlString) {
  return `<div>${htmlString}</div>`;
}

export default class LiveDom {
  constructor({ html = '', domNode, evalWrapperFn = wrapHtmlStringInDiv }) {
    if (!domNode || !(domNode instanceof window.HTMLElement)) {
      throw new Error('LiveDom constructor requires a dom node');
    }
    this.domNode = domNode;
    this.html = html;
    this.evalWrapperFn = evalWrapperFn;
    // if (this.domNode.children.length) {
    //   [ ...this.domNode.children].forEach(child => this.domNode.removeChild(child));
    // }
    if (html) {
      this.setHtml(html);
    }
  }

  setHtml(htmlString) {
    const wrappedHtmlString = this.evalWrapperFn(htmlString);
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

  dispose() {
    [ ...this.domNode.children].forEach(child => this.domNode.removeChild(child));
    setTimeout(() => {
      if (this.domNode.parentElement) {
        this.domNode.parentElement.removeChild(this.domNode);
      }
      this.domNode = null;
      this.html = null;
      this.evalWrapperFn = null;
      this.lastAst = null;
    });
  }
}
