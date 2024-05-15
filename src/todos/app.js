import html from "./app.html?raw";
import todoStore, { Filters } from "../store/todo.store.js";
import { renderTodos, renderPendingTodos } from "./usecases";

const elementIDs = {
    ClearCompleted: ".clear-completed",
    NewTodoInput: "#new-todo-input",
    TodoFilter: ".filtro",
    TodoList: ".todo-list",
    PendingCount: "#pending-count"
}

/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId ) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( elementIDs.TodoList, todos );
        renderPendingCount();
    }
    
    const renderPendingCount = () => {
        renderPendingTodos(elementIDs.PendingCount);
    }

    //Cuando la función App() se llama
    (()=>{
        const app = document.createElement("div");
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    // Referencias HTML
    const newDescriptionInput   = document.querySelector(elementIDs.NewTodoInput);
    const todoListUL            = document.querySelector(elementIDs.TodoList);
    const clearCompletedButton  = document.querySelector(elementIDs.ClearCompleted);
    const filtersLIs             = document.querySelectorAll(elementIDs.TodoFilter);


    // Eventos
    newDescriptionInput.addEventListener("keyup", ( event ) =>{
        if( event.key !== "Enter" ) return;
        if( event.target.value.trim().length === 0 ) return;

        todoStore.addTodo( event.target.value );
        displayTodos();
        event.target.value = "";
    });

    todoListUL.addEventListener("click", (event) => {
        const element = event.target.closest("[data-id]");
        todoStore.toggleTodo(element.getAttribute("data-id"));
        displayTodos();
    });

    todoListUL.addEventListener("click", (event) => {
        const isDestroyElement = event.target.className === "destroy";
        const element = event.target.closest("[data-id]");
        if( !element || !isDestroyElement ) return;

        todoStore.deleteTodo(element.getAttribute("data-id"));
        displayTodos();
    });

    clearCompletedButton.addEventListener("click", () => {
        todoStore.deleteCompleted();
        displayTodos();
    });

    filtersLIs.forEach(element => {
        element.addEventListener("click", (element) => {
            filtersLIs.forEach(el => el.classList.remove("selected"));
            element.target.classList.add("selected");

            switch( element.target.text ) {
                case "Todos":
                    todoStore.setSelectedFilter(Filters.All);
                break
                
                case "Pendientes":
                    todoStore.setSelectedFilter(Filters.Pending);
                break
                
                case "Completados":
                    todoStore.setSelectedFilter(Filters.Completed);
                break
            }

            displayTodos();
        })
    });
}