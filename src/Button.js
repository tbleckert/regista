import Base from './Base.js';

export default class Button extends Base {
    constructor(element, store) {
        super(element, store);

        this.action = this.element.getAttribute('data-action');

        if (this.action) {
            this.attach();
        }
    }

    attach() {
        this.element.addEventListener('click', this.onClick.bind(this));
    }

    onClick(e) {
        this.store.dispatch({ type: this.action, e });
    }
}
