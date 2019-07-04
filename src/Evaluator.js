function visitRootNode(astNode, domNode) {
  // TODO: need to use the same child diff method as below
  if (domNode.children.length > astNode.children.length) {
    // remove children
    [ ...domNode.children].slice(astNode.children.length).forEach(child => domNode.removeChild(child));
  }
  astNode.children.forEach((child, index) => visitNode(child, domNode.children[index], domNode));
}

function visitNode(astNode, domNode, parent) {
  if (!astNode) {
    parent.removeChild(domNode);
    return;
  }
  if (!domNode) {
    const newSubtree = bruteForceDomBuilder(astNode);
    parent.appendChild(newSubtree);
    return;
  }
  if (astNode.tagName === domNode.tagName) {
    // update attributes
    for (let attr of domNode.attributes) {
      const { name, value, } = attr;
      const astAttribute = astNode.attributes[name];
      // attribute has been removed
      if (!astAttribute) {
        domNode.removeAttribute(name);
      }
      // attribute has been updated
      else if (astAttribute !== value) {
        domNode.setAttribute(name, astNode.attributes[name]);
      }
    }
    if (domNode.attributes.length < Object.keys(astNode.attributes).length) {
      // attribute as been created
      Object.keys(astNode.attributes)
        .filter(key => !domNode.hasAttribute(key))
        .forEach(key => domNode.setAttribute(key, astNode.attributes[key]));
    }

    if (domNode.children.length > astNode.children.length) {
      // remove children
      [ ...domNode.children].slice(astNode.children.length).forEach(child => domNode.removeChild(child));
    }
    // update or create children
    astNode.children.forEach((child, index) => {
      visitNode(child, domNode.children[index], domNode);
    });
  } else {
    // remove domNode, replace with astNode subtree, exit
    const newSubtree = bruteForceDomBuilder(astNode);
    parent.removeChild(domNode);
    parent.appendChild(newSubtree);
  }  
}

function bruteForceDomBuilder(astNode) {
  const ele = document.createElement(astNode.tagName);
  // create children
  astNode.children
    .map(node => bruteForceDomBuilder(node))
    .forEach(child => ele.appendChild(child));
  // set attributes
  Object.keys(astNode.attributes).forEach(attr => ele.setAttribute(attr, astNode.attributes[attr]));
  return ele;
}

export default function astToDom(astRoot, lastAstRoot, domRoot) {
  visitRootNode(astRoot, domRoot);
}
