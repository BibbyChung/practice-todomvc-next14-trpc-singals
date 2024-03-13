'use client';

import { useTodosStore, type todoType } from "~/utils/services/todolist.service";

export default function Item(params: todoType) {
  const store = useTodosStore();
  const updateItem = (checked: boolean) => {
    store.updateTodo({
      ...params,
      completed: checked
    }).then(() => store.fetchTodos())
  }

  const deleteItem = () => store.delTodo(params.id).then(() => store.fetchTodos())

  return (
    <li className={params.completed ? "completed" : ""}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={params.completed}
          onChange={(e) => {
            updateItem(e.target.checked);
          }}
        />
        <label>{params.title}</label>
        <button
          onClick={(e) => {
            deleteItem()
            e.preventDefault();
          }}
          className="destroy"
        ></button>
      </div>
    </li>
  );
}
