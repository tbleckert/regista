import Item from './Item.js';

let store = null;

function mountComponent(element, initFn) {
    const component = element.getAttribute('data-component');

    initFn(element, component, store);
}

function mount(context, componentLoader) {
    const components = context.querySelectorAll('[data-component]:not([data-hydrated])');
    const values = context.querySelectorAll('[data-key]:not([data-hydrated]),[data-items]:not([data-hydrated])');

    if (components.length) {
        [].forEach.call(components, (element) => mountComponent(element, componentLoader));
    }

    if (values.length) {
        [].forEach.call(values, (element) => new Item(element, store));
    }
}

function handleClick(e) {
    let { target } = e;

    if (!target.hasAttribute('data-action')) {
        target = target.closest('[data-action]');
    }

    if (target && target.hasAttribute('data-action')) {
        store.dispatch({ type: target.getAttribute('data-action'), e });
    }
}

function handleChange(e, type) {
    const { target } = e;

    if (target.hasAttribute('data-key')) {
        const handlesChange = ['checkbox', 'radio'].indexOf(target.getAttribute('type')) >= 0;

        if (type === 'change' && !handlesChange) {
            return;
        }

        if (type === 'input' && handlesChange) {
            return;
        }

        const key = target.getAttribute('data-key');

        store.dispatch({
            type: `${key}Changed`,
            value: target.value,
            key,
            e,
        });
    }
}

function attach() {
    document.body.addEventListener('click', handleClick);
    document.body.addEventListener('change', (e) => handleChange(e, 'change'));
    document.body.addEventListener('input', (e) => handleChange(e, 'input'));
}

export default function register(userStore, componentLoader) {
    store = userStore;

    document.addEventListener('DOMContentLoaded', () => {
        mount(document, componentLoader);
        attach(store);

        const observer = new MutationObserver((mutationsList) => {
            [].forEach.call(mutationsList, (mutation) => {
                const { target } = mutation;
                const parent = target.parentNode;

                mount(parent, componentLoader);
            });
        });

        observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    });
}
