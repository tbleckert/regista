import set from './lib/set.js';
import get from './lib/get.js';

export default class Base {
    constructor(element, store) {
        this.element = element;
        this.key = this.element.getAttribute('data-key');
        this.parent = this.element.closest('x-items');

        if (this.parent && this.parent !== this.element && this.key) {
            const parentKey = this.parent.getAttribute('data-key');
            const children = this.parent.querySelectorAll(`[data-key="${this.key}"]`);
            const i = Array.from(children).indexOf(this.element);

            this.key = `${parentKey}.${i}.${this.key.replace(/^\.+/g, '')}`.replace(/\.$/, '');
        }

        this.store = store;
        this.unsubscribe = this.store.subscribe(this.storeDidChange.bind(this));

        if (this.key) {
            this.hydrate();
        }

        this.element.setAttribute('data-hydrated', 'true');
    }

    hydrate() {
        const value = this.element.innerHTML;

        if (value) {
            const firstKey = this.key.split('.').shift();
            const newValue = set(this.store.state, this.key, value);

            this.store.dispatch({ type: `${firstKey}Changed`, value: newValue[firstKey], key: firstKey });
        } else {
            this.element.innerHTML = get(this.store.state, this.key);
        }
    }

    storeDidChange(state, changed) {
        if (!this.key) {
            return;
        }

        const firstKey = this.key.split('.')[0];

        if (firstKey in changed && 'valueUpdated' in this && typeof this.valueUpdated === 'function') {
            this.valueUpdated(get(changed, this.key));
        }
    }
}
