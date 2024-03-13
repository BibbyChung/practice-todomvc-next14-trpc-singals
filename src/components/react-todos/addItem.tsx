'use client';

import { useRef } from "react";
import { useTodosStore } from "~/utils/services/todolist.service";

export default function AddItem() {
  const inputRef = useRef<HTMLInputElement>(null);
  const store = useTodosStore();

  const formSubmit = () => {
    const v = inputRef.current?.value ?? '';
    if (v !== '' && inputRef.current) {
      store.addTodo(v)
        .then(() => {
          inputRef.current!.value = "";
        })
        .then(() => store.fetchTodos());
    }
  }

  return (
    <header className="header">
      <h1>todos</h1>
      <form
        onSubmit={(e) => {
          formSubmit();
          e.preventDefault();
        }}
      >
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus={true}
          ref={inputRef}
        />
      </form>
    </header>
  );
}
