import { combineLatest, from, map, of, shareReplay, switchMap, take, tap } from "rxjs";
import { getBehaviorSubject, getUUID } from "../common/util";
import { trpc } from '~/utils/trpc';

export type todosFilterType = "all" | "active" | "completed";

export type todoType = {
  id: string;
  title: string;
  completed: boolean;
};
const todosFilter$ = getBehaviorSubject<todosFilterType>("all");
export const setTodosFilter = (ff: todosFilterType) => todosFilter$.next(ff);
export const getTodosFilter = () => todosFilter$.asObservable();

const refreshTodos$ = getBehaviorSubject<boolean>(true);
export const refreshTodos = () => refreshTodos$.next(true);

const getAllTodos$ = refreshTodos$
  .pipe(
    switchMap(() => from(trpc.todos.getAll.query())),
    shareReplay(1)
  );

export const getTodos = () =>
  getTodosFilter().pipe(
    switchMap((f) => combineLatest([
      getAllTodos$,
      of(f)
    ])),
    map(([todos, f]) => {
      switch (f) {
        case "active":
          return todos.filter((a) => !a.completed);
        case "completed":
          return todos.filter((a) => a.completed);
        default:
          return todos;
      }
    }),
    shareReplay(1)
  );
export const addTodo = (title: string) => {
  const todo = {
    title,
    id: getUUID(),
    completed: false
  };
  return from(trpc.todos.add.mutate(todo))
};
export const delTodo = (id: string) => from(trpc.todos.del.mutate({ id }));

export const updateTodo = (todo: todoType) => from(trpc.todos.update.mutate(todo));

export const setAllTodosCompleted = (isCompleted: boolean) =>
  getTodos().pipe(
    take(1),
    switchMap((todos) => {
      const pArr = todos.map((a) => {
        a.completed = isCompleted
        return trpc.todos.update.mutate(a);
      });
      return from(Promise.all(pArr));
    })
  );
export const removeAllTodosCompleted = () =>
  getTodos().pipe(
    take(1),
    switchMap((todos) => {
      const newTodos = todos.filter((a) => a.completed);
      const pArr = newTodos.map(a => trpc.todos.del.mutate({ id: a.id }));
      return from(Promise.all(pArr));
    })
  );
