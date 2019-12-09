export default class Store {
    constructor() {
        this.subscribers = [];
    }

    setState(nextState) {
        const prevState = this.state;

        this.state = { ...this.state, ...nextState };
        this.emit(this.state, nextState, prevState);
    }

    emit(...args) {
        this.subscribers.forEach((cb) => cb.call(null, ...args));
    }

    subscribe(cb) {
        this.subscribers.push(cb);

        return {
            unsubscribe: () => {
                this.subscribers = this.subscribers.filter((subscribedCb) => subscribedCb !== cb);
            },
        };
    }

    dispatch(payload = {}) {
        const { type, ...data } = payload;
        const method = `on${type.charAt(0).toUpperCase() + type.slice(1)}`;

        if (!(method in this) || typeof this[method] !== 'function') {
            if ('key' in data && 'value' in data) {
                this.setState({ [data.key]: data.value });

                return;
            }

            console.warn(`Handler missing for action ${method}`);

            return;
        }

        const updatedState = this[method](this.state, data);

        if (updatedState) {
            this.setState(updatedState);
        }
    }
}
