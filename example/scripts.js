import register from '../src/index.js';
import Store from './Store.js';

const AppStore = new Store({});

register(AppStore, (element, componentName, store) => {
    import(`./components/${componentName}.js`).then(({ default: Component }) => {
        new Component(element, store);
    }).catch((ex) => {
        console.error(ex);
    });
});
