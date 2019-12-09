import Base from './Base.js';

export default class Items extends Base {
    constructor(element, store) {
        super(element, store);

        this.fetchItems();
    }

    fetchItems() {
        this.items = this.element.querySelectorAll('x-item');
        this.template = this.items[0];

        if (this.template) {
            this.template = this.template.cloneNode(true);

            this.cleanTemplate();
        }
    }

    hydrate() {
        return false;
    }

    cleanTemplate() {
        const values = this.template.querySelectorAll('x-value[data-key]');

        [].forEach.call(values, (value) => {
            value.innerHTML = '';
            value.removeAttribute('data-hydrated');
        });
    }

    valueUpdated(newValue) {
        if (!Array.isArray(newValue)) {
            return;
        }

        newValue.forEach((item, i) => {
            if (!this.items[i]) {
                const newItem = this.template.cloneNode(true);

                this.element.appendChild(newItem);
            }
        });

        this.fetchItems();
    }
}
