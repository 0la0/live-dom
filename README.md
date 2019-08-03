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

const domNode = document.getElementById('foo'); // render input to this DOM node

const liveDom = new LiveDom({ domNode });

// or initialize with an html string
// new LiveDom({ domNode, htmlString: '<p>hello</p>' })

liveDom.setHtml('<p id="cool">hello</p>'); // apply document changes
liveDom.setHtml('<p id="something-else">hello</p>'); // apply more changes
```
