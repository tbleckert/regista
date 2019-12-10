function camelize(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export default class Component {
    constructor(element, store) {
        this.element = element;
        this.store = store;
        this.unsubscribe = this.store.subscribe(this.storeDidChange);
        this.attrs = this.parseAttrs();

        this.element.setAttribute('data-hydrated', 'true');
    }

    storeDidChange(/* changed */) {
        // Override in component
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
