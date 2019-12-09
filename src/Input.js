import Base from './Base.js';

export default class Input extends Base {
    constructor(element, store) {
        super(element, store);

        this.hydrate();
        this.attach();
    }

    hydrate() {
        if (this.element.value) {
            this.dispatchChange(this.element.value);
        }
    }

    attach() {
        const type = this.element.getAttribute('type');

        if (type === 'checkbox' || type === 'radio') {
            this.element.addEventListener('change', this.onChange.bind(this));
        } else {
            this.element.addEventListener('input', this.onChange.bind(this));
        }
    }

    onChange(e) {
        this.dispatchChange(e.target.value);
    }

    dispatchChange(value) {
        this.store.dispatch({ type: `${this.key}Changed`, value, key: this.key });
    }

    valueUpdated(newValue) {
        this.element.value = newValue;
    }
}
