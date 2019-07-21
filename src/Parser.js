import * as BabelParser from '@babel/parser';
import AstNode from './AstNode';

const parserOptions = {
  sourceType: 'module',
  plugins: [ 'jsx' ],
};

const transformToAstNode = (oldNode, currentNode) => {
  if (currentNode.type === 'JSXElement') {
    const name = currentNode.openingElement.name.name;
    const attributes = currentNode.openingElement.attributes.reduce((attrs, attribute) => {
      const attributeValue = (attribute.value && attribute.value.value) || '';
      return Object.assign(attrs, { [attribute.name.name]: attributeValue });
    }, {});
    const element = new AstNode(name, attributes);
  
    oldNode.push(element);

    if (currentNode.children) {
      currentNode.children.forEach((childNode) => {
        if (oldNode.length) {
          transformToAstNode(element.children, childNode);
        } else {
          transformToAstNode(oldNode, childNode);
        }
      });
    }
  }
  return oldNode;
};

export default function parseToAst(content) {
  if (typeof content !== 'string') {
    throw new TypeError('Parser requires a string');
  }
  if (!content) {
    return [];
  }
  const rawAst = BabelParser.parse(content, parserOptions);
  const rootNode = rawAst.program.body[0].expression;
  return transformToAstNode([], rootNode);
}
