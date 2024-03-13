'use client';

import { useEffect } from "react";
import { useTodosStore } from "~/utils/services/todolist.service";
import AddItem from "./addItem";
import Footer from "./footer";
import Item from "./item";

export default function TodoList() {

  const store = useTodosStore();
  const setAllTodosCompleted = (isC: boolean) => store.setAllTodosCompleted(isC).then(() => store.fetchTodos());

  useEffect(() => {
    store.fetchTodos();
  }, []);

  useEffect(() => {
    const todos = store.todos
    let isSelected = todos.length === todos.filter((a) => a.completed).length;
    if (todos.length === 0) {
      isSelected = false;
    }

    if (document) {
      const elem = document.querySelector('#toggle-all') as HTMLInputElement;
      if (elem) {
        elem.checked = isSelected;
      }
    }
  }, [store.todos])

  return (
    <section className="todoapp">
      <AddItem />
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={(e) => {
            setAllTodosCompleted(e.currentTarget.checked)
            // checkSelectAllBtn$.next(e.currentTarget.checked);
            // e.preventDefault();
          }}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {store.todos.map((item, i) => (
            <Item key={item.id} {...item} />
          ))}
        </ul>
      </section>
      <Footer />
      {/* <div className="absolute right-0 top-0 z-50">
        {JSON.stringify(isCompleted)}
      </div> */}
      {/* {JSON.stringify(todosSig.value)} */}
    </section>
  );
}
