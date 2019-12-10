<h1 align="center">Regista</h1>
<p align="center">Progressive enhancement with an HTML-first approach.</p>

_This is a POC only, and a work in progress. Not meant for production_

## Install
Simply `npm i regista` and you're good to go.

## Quick example

First thing you need to do is create a store that holds the app state and the logic to update it.

```js
import { Store } from 'regista';

export default class AppStore extends Store {
    state = {};
}
```
Next we need to register our store
```js
import { register } from 'regista';
import Store from './Store';

const AppStore = new Store({/* default state */});

register(AppStore);
```

Finally, let's add some HTML

```html
<label>Your name:</label>
<input type="text" data-key="name">
<p>Hello, <span data-key="name">world</span></p>
```
