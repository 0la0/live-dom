import jsdom from 'jsdom';

export function buildNewWindow() {
  const html = '<!DOCTYPE html><html><body></body></html>';
  return new jsdom.JSDOM(html).window;
}

function tagEquality(node1, node2) {
  return node1.tagName === node2.tagName;
}

function attributeEquality(node1, node2) {
  if (node1.attributes.length !== node2.attributes.length) {
    console.log('attribute length equality failed');
    return false;
  }
  return [...node1.attributes].every(({ name }) => node1.getAttribute(name) === node2.getAttribute(name));
}

function childEquality(node1, node2) {
  if (node1.children.length !== node2.children.length) {
    return false;
  }
  return [...node1.children].every((child, index) => domEquality(child, node2.children[index]));
}

export function domEquality(node1, node2) {
  if (!node1 || !node2) {
    throw new Error(`Node does not exist ${node1}, ${node2}`);
  }
  return tagEquality(node1, node2) && attributeEquality(node1, node2) && childEquality(node1, node2);
}
