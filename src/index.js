import parseToAst from './Parser.js';
import astToDom from './Evaluator.js';
import LiveDomSubmissionResult from './LiveDomSubmissionResult.js';

const SINGLE_LINE_JSX_COMMENT = /^\s*\/\//;
const HTML_COMMENT = /<!--(.|\n)*?-->/g;

function wrapHtmlStringInDiv(htmlString) {
  return `<div>\n${htmlString}\n</div>`;
}

function getHtmlWithoutSingleLineJsxComments(htmlString = '') {
  return htmlString.split('\n')
    .filter(line => {
      const isSingleLineComment = line.match(SINGLE_LINE_JSX_COMMENT);
      return !isSingleLineComment;
    })
    .join('\n');
}

function getHtmlWithoutHtmlComments(htmlString = '') {
  return htmlString.replace(HTML_COMMENT, '');
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

  setHtml(rawHtmlString = '') {
    const htmlString = getHtmlWithoutSingleLineJsxComments(getHtmlWithoutHtmlComments(rawHtmlString));
    const wrappedHtmlString = this.evalWrapperFn(htmlString);
    try {
      const ast = parseToAst(wrappedHtmlString);
      if (ast.length > 1) {
        throw new Error('Ambiguous root node', ast);
      }
      const lastAstRoot = this.lastAst && this.lastAst[0];
      astToDom(ast[0], lastAstRoot, this.domNode, undefined);

      this.lastAst = ast;
      return new LiveDomSubmissionResult(true);
    } catch (error) {
      return new LiveDomSubmissionResult(false, error.message);
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
