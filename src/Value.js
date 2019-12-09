import Base from './Base.js';

export default class Value extends Base {
    valueUpdated(newValue) {
        this.element.innerHTML = newValue;
    }
}
