function camelize(str) {
    return str.replace(/-([a-z])/g, (g) => { return g[1].toUpperCase(); });
}

export default class Component {
    constructor(element, store) {
        this.element = element;
        this.store = store;
        this.unsubscribe = this.store.subscribe(this.storeDidChange);
        this.attrs = this.parseAttrs();

        this.attach();

        this.element.setAttribute('data-hydrated', 'true');
    }

    storeDidChange(/* changed */) {
        // Override in component
    }

    attach() {
        const elementType = this.element.tagName.toLowerCase();

        // eslint-disable-next-line default-case
        switch (elementType) {
            case 'button':
                this.attachButtonListeners();
                break;
        }
    }

    attachButtonListeners() {
        this.element.addEventListener('click', (e) => this.fireIfExists('onClick', e));
    }

    fireIfExists(fn, e) {
        if (fn in this && typeof this[fn] === 'function') {
            this[fn](e);
        }
    }

    parseAttrs() {
        const attrs = {};

        [].forEach.call(this.element.attributes, ({ nodeName, nodeValue}) => {
            if (nodeName) {
                const attrName = camelize(nodeName);
                attrs[attrName] = nodeValue;
            }
        });

        return attrs;
    }
}
