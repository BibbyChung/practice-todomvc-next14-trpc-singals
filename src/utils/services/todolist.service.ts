// import { combineLatest, from, map, of, shareReplay, switchMap, take, tap } from "rxjs";
import { getUUID } from "../common/util";
import { trpc } from '~/utils/trpc';
import { create } from 'zustand'

export type todosFilterType = "all" | "active" | "completed";

export type todoType = {
  id: string;
  title: string;
  completed: boolean;
};

type TodosStoreType = {
  filter: todosFilterType;
  setFilter: (v: todosFilterType) => void;
  todos: todoType[];
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  delTodo: (id: string) => Promise<void>;
  updateTodo: (todo: todoType) => Promise<void>;
  setAllTodosCompleted: (isCompleted: boolean) => Promise<void>;
  removeAllTodosCompleted: () => Promise<void>;
}

export const useTodosStore = create<TodosStoreType>()((set, get) => ({
  filter: 'all',
  setFilter: (v: todosFilterType) => set((obj) => {
    obj.filter = v
    return { ...obj };
  }),
  todos: [],
  fetchTodos: async () => {
    const filter = get().filter;
    let todos = await trpc.todos.getAll.query();
    switch (filter) {
      case "active":
        todos = todos.filter((a) => !a.completed);
        break;
      case "completed":
        todos = todos.filter((a) => a.completed);
        break;
    }
    set({
      ...get(),
      todos
    });
  },
  addTodo: async (title: string) => {
    const todo = {
      title,
      id: getUUID(),
      completed: false
    };
    await trpc.todos.add.mutate(todo)
  },
  delTodo: async (id: string) => await trpc.todos.del.mutate({ id }),
  updateTodo: async (todo: todoType) => await trpc.todos.update.mutate(todo),
  setAllTodosCompleted: async (isCompleted: boolean) => {
    const todos = get().todos;
    const pArr = todos.map((a) => {
      a.completed = isCompleted
      return trpc.todos.update.mutate(a);
    });
    await Promise.all(pArr);
  },
  removeAllTodosCompleted: async () => {
    const todos = get().todos;
    const newTodos = todos.filter((a) => a.completed);
    const pArr = newTodos.map(a => trpc.todos.del.mutate({ id: a.id }));
    await Promise.all(pArr);
  }
}))
