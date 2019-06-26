export default class AstNode {
  constructor(tagName = '', attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = attributes;
    this.children = [];
  }

  addChildren(children) {
    this.children = this.children.concat(children);
    return this;
  }
}
