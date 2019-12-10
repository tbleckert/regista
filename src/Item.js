import set from './lib/set.js';
import get from './lib/get.js';
import getValue from './lib/getValue.js';
import setValue from './lib/setValue.js';

export default class Item {
    constructor(element, store) {
        this.element = element;
        this.type = this.element.tagName.toLowerCase();
        this.key = this.element.getAttribute('data-key');
        this.itemsKey = this.element.getAttribute('data-items');
        this.parent = this.element.parentNode.closest('[data-items]');
        this.template = null;
        this.items = [];

        if (this.parent && this.key) {
            const parentKey = this.parent.getAttribute('data-items');
            const children = this.parent.querySelectorAll(`[data-key="${this.key}"]`);
            const i = Array.from(children).indexOf(this.element);

            this.key = `${parentKey}.${i}.${this.key.replace(/^\.+/g, '')}`.replace(/\.$/, '');
        }

        this.store = store;
        this.unsubscribe = this.store.subscribe(this.storeDidChange.bind(this));

        if (this.key) {
            this.hydrate();
        } else if (this.itemsKey) {
            this.fetchItems();
        }

        if (this.type === 'input' || this.type === 'select') {
            this.attach();
        }

        this.element.setAttribute('data-hydrated', 'true');
    }

    hydrate() {
        const storeValue = get(this.store.state, this.key);

        if (storeValue !== undefined) {
            setValue(this.element, storeValue);

            return;
        }

        const value = getValue(this.element);

        if (value !== undefined) {
            const firstKey = this.key.split('.').shift();
            const newValue = set(this.store.state, this.key, value);

            this.store.dispatch({ type: `${firstKey}Changed`, value: newValue[firstKey], key: firstKey });
        }
    }

    attach() {
        const type = this.element.getAttribute('type');

        if (this.type === 'input' && ['checkbox', 'radio'].indexOf(type) < 0) {
            this.element.addEventListener('input', this.onChange.bind(this));
        } else {
            this.element.addEventListener('change', this.onChange.bind(this));
        }
    }

    fetchItems() {
        this.items = this.element.children;
        this.template = this.items[0];

        if (this.template) {
            this.template = this.template.cloneNode(true);

            this.cleanTemplate();
        }
    }

    cleanTemplate() {
        const values = this.template.querySelectorAll('[data-key]');

        [].forEach.call(values, (value) => {
            value.innerHTML = '';
            value.removeAttribute('data-hydrated');
        });
    }

    onChange(e) {
        const firstKey = this.key.split('.')[0];
        const value = (['checkbox', 'radio'].indexOf(this.element.getAttribute('type')) >= 0) ? e.target.checked : this.element.value;
        const newValue = set(this.store.state, this.key, value ? this.element.value : false);

        this.store.dispatch({
            type: `${firstKey}Changed`,
            value: newValue[firstKey],
            key: firstKey,
            e,
        });
    }

    storeDidChange(state, changed) {
        if (!this.key) {
            if (this.itemsKey && this.itemsKey in changed) {
                this.itemsUpdated(get(changed, this.itemsKey));
            }

            return;
        }

        const firstKey = this.key.split('.')[0];

        if (firstKey in changed && 'valueUpdated' in this && typeof this.valueUpdated === 'function') {
            this.valueUpdated(get(changed, this.key));
        }
    }

    valueUpdated(newValue) {
        setValue(this.element, newValue);
    }

    itemsUpdated(newItems) {
        if (!Array.isArray(newItems)) {
            return;
        }

        newItems.forEach((item, i) => {
            if (!this.items[i]) {
                const newItem = this.template.cloneNode(true);

                this.element.appendChild(newItem);
            }
        });

        this.fetchItems();
    }
}
