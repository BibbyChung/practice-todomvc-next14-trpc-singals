import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useRef, useState } from "react";
import { filter, map, switchMap, take, tap } from "rxjs";
import { toSignal, useSubject } from "~/utils/common/rxjs-interop-react";
import { getTodos, refreshTodos, setAllTodosCompleted } from "~/utils/services/todolist.service";
import AddItem from "./addItem";
import Footer from "./footer";
import Item from "./item";



// let isCompleted = false;

export default function TodoList() {
  useSignals();
  // const checkboxToggleRef = useRef<HTMLInputElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const isReady$ = useSubject<boolean>();
  const checkSelectAllBtn$ = useSubject<boolean>();
  const todosSig = toSignal(getTodos());

  // console.log(isCompleted);

  useEffect(() => {

    const toggleCheckboxSub = isReady$.pipe(
      filter(a => a),
      switchMap(() => getTodos()),
      map((todos) => {
        const total = todos.length;
        const selectedCount = todos.filter((a) => a.completed).length;
        if (total === 0) {
          return false;
        }
        return total === selectedCount;
      }),
      tap((isSelected) => {
        if (document) {
          const elem = document.querySelector('#toggle-all') as HTMLInputElement;
          elem.checked = isSelected;
        }
      })
    ).subscribe();

    const checkSelectAllSub = checkSelectAllBtn$.pipe(
      switchMap((isC) => setAllTodosCompleted(isC)),
      tap(() => refreshTodos())
    ).subscribe();

    isReady$.next(true);

    return () => {
      toggleCheckboxSub.unsubscribe();
      checkSelectAllSub.unsubscribe();
    };
  }, []);

  return (
    <section className="todoapp">
      <AddItem />

      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={(e) => {
            setIsCompleted(e.currentTarget.checked)
            checkSelectAllBtn$.next(e.currentTarget.checked);
            // e.preventDefault();
          }}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todosSig.value?.map((item, i) => (
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
