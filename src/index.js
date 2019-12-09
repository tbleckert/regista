import Value from './Value.js';
import Input from './Input.js';
import Button from './Button.js';
import Items from './Items.js';

function mountComponent(element, initFn, store) {
    const component = element.getAttribute('data-component');

    initFn(element, component, store);
}

function mount(context, store, componentLoader) {
    const components = context.querySelectorAll('[data-component]:not([data-hydrated])');
    const values = context.querySelectorAll('x-value[data-key]:not([data-hydrated])');
    const inputs = context.querySelectorAll('input[data-key]:not([data-hydrated])');
    const buttons = context.querySelectorAll('button[data-action]:not([data-hydrated])');
    const items = context.querySelectorAll('x-items[data-key]:not([data-hydrated])');

    if (components.length) {
        [].forEach.call(components, (element) => mountComponent(element, componentLoader, store));
    }

    if (inputs.length) {
        [].forEach.call(inputs, (element) => new Input(element, store));
    }

    if (values.length) {
        [].forEach.call(values, (element) => new Value(element, store));
    }

    if (buttons.length) {
        [].forEach.call(buttons, (element) => new Button(element, store));
    }

    if (items.length) {
        [].forEach.call(items, (element) => new Items(element, store));
    }
}

export default function register(store, componentLoader) {
    document.addEventListener('DOMContentLoaded', () => {
        mount(document, store, componentLoader);

        const observer = new MutationObserver((mutationsList) => {
            [].forEach.call(mutationsList, (mutation) => {
                const { target } = mutation;
                const parent = target.parentNode;

                mount(parent, store, componentLoader);
            });
        });

        observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    });
}
