import { Store as RegistaStore } from '../src/index.js';

export default class Store extends RegistaStore {
    constructor() {
        super();

        this.state = {};
    }

    onTodosChanged(state, { value }) {
        const completedTodos = value.filter(todo => todo.completed).length;

        return { todos: value, totalTodos: value.length, completedTodos };
    }

    onAddTodo(state) {
        if (!state.addingTodo.length) {
            return;
        }

        const todos = state.todos.slice();

        todos.unshift({ completed: false, name: state.addingTodo });

        this.dispatch({ type: 'todosChanged', value: todos });
    }
}
