'use client';

import { useTodosStore, type todosFilterType } from "~/utils/services/todolist.service";

export default function Footer() {
  const store = useTodosStore();

  const isShowClearCompleted = store.todos.filter(a => a.completed).length !== 0;
  const uncompletedCount = store.todos.filter(a => !a.completed).length;
  const todoFilter = store.filter;

  const removeAllTodos = () => store.removeAllTodosCompleted().then(() => store.fetchTodos())
  const setTodosFilter = (type: todosFilterType) => {
    store.setFilter(type);
    store.fetchTodos();
  }

  return (
    <footer className="footer">
      <span>
        {uncompletedCount === 1
          ? "1 uncompleted item left"
          : `${uncompletedCount} uncompleted items left`}
      </span>
      <ul className="filters">
        <li>
          <a
            onClick={(e) => {
              setTodosFilter('all');
              e.preventDefault();
            }}
            href="#/"
            className={todoFilter === "all" ? "selected" : ""}
          >All</a>
        </li>
        <li>
          <a
            onClick={(e) => {
              setTodosFilter('active');
              e.preventDefault();
            }}
            href="#/"
            className={todoFilter === "active" ? "selected" : ""}
          >Active</a>
        </li>
        <li>
          <a
            onClick={(e) => {
              setTodosFilter('completed');
              e.preventDefault();
            }}
            href="#/"
            className={todoFilter === "completed" ? "selected" : ""}
          >Completed</a>
        </li>
      </ul>
      <div>
        {isShowClearCompleted
          ? (
            <button
              onClick={(e) => {
                removeAllTodos();
              }}
              className="clear-completed"
            >
              Clear completed
            </button>
          )
          : (
            ""
          )}
      </div>
    </footer>
  );
}
