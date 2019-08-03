# Live-DOM
A lightweight HTML parser & virtual DOM implementation intended for live coding

## Install / Build
install dependencies: `npm i`  
build: `npm run build`  
run tests: `npm test`  
run linter: `npm run lint`  

---

## Usage
```js
import LiveDom from 'live-dom';

const targetElement = document.getElementById('foo');

const liveDom = new LiveDom({
  domNode: targetElement, // render input to this DOM node
  htmlString: '<p>hello</p>', // optional string
});

liveDom.setHtml('<p id="cool">hello</p>'); // apply document changes
```
