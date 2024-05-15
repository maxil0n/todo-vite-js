import { Todo } from "../todos/models/todo.model.js";

export const Filters = {
    All: "all",
    Completed: "Completed",
    Pending: "Pending",
}

const state = {
    todos: [
        new Todo("Computadora"),
        new Todo("Televisor"),
        new Todo("Auto"),
    ],
    filter: Filters.All,
}

const initStore = () => {
    loadStore();
    console.log("InitStore 🛒");
}

const loadStore = () => {
    if( !sessionStorage.getItem("state") ) return;

    const {todos = [], filter = Filters.All} = JSON.parse(sessionStorage.getItem("state"));
    state.todos = todos;
    state.filter = filter;
}

const saveStateToSessionStorage = () => {
    sessionStorage.setItem("state", JSON.stringify(state));
}

const getTodos = (filter = Filters.All) => {
    switch(filter) {
        case Filters.All:
            return [...state.todos];

        case Filters.Completed:
            return state.todos.filter(todo => todo.done);

        case Filters.Pending:
            return state.todos.filter(todo => !todo.done);

        default:
            throw new Error(`Option ${filter} is not valid.`);
    }
}

/**
 * 
 * @param {String} description 
 */
const addTodo = (description) => {
    if( !description ) throw new Error("Description is required");
    state.todos.push( new Todo(description) );
 
    saveStateToSessionStorage();
}

/**
 * 
 * @param {String} todoId 
 */
const toggleTodo = (todoId) => {
    state.todos = state.todos.map( todo => {
        if( todo.id === todoId ) {
            todo.done = !todo.done;
        }
        return todo;
    });

    saveStateToSessionStorage();
}


/**
 * 
 * @param {String} todoId 
 */
const deleteTodo = (todoId) => {
    state.todos = state.todos.filter( todo => todo.id !== todoId );

    saveStateToSessionStorage();
}

const deleteCompleted = () => {
    state.todos = state.todos.filter( todo => !todo.done );
    saveStateToSessionStorage();
}

const setSelectedFilter = (newFilter = Filters.All ) => {
    state.filter = newFilter;
    saveStateToSessionStorage();
}

const getCurrentFilter = () => {
    return state.filter;
}

export default {
    addTodo,
    deleteCompleted,
    deleteTodo,
    getCurrentFilter,
    getTodos,
    initStore,
    setSelectedFilter,
    toggleTodo,
}