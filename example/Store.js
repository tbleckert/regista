import UIStore from '../src/Store.js';

const quotes = [
    'I\'m not a great programmer; I\'m just a good programmer with great habits.',
    'How you look at it is pretty much how you\'ll see it',
    'You\'ve baked a really lovely cake, but then you\'ve used dog shit for frosting.',
    'A conscious human is driven by their conscience, not popular opinion.',
];

export default class Store extends UIStore {
    constructor() {
        super();

        this.state = {};
    }

    onIncrement(state) {
        return { clicks: parseInt(state.clicks, 10) + 1 };
    }

    onAddQuote(state) {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        const stateQuotes = (state.quotes || []).slice();

        stateQuotes.push(quote);

        return { quotes: stateQuotes };
    }
}
