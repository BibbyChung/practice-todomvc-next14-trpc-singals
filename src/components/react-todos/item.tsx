import { useEffect } from "react";
import { switchMap, tap } from "rxjs";
import { useSubject } from "~/utils/common/rxjs-interop-react";
import { delTodo, updateTodo, type todoType, refreshTodos } from "~/utils/services/todolist.service";

export default function Item(params: todoType) {
  const destroyBtn$ = useSubject<boolean>();
  const updateItemBtn$ = useSubject<boolean>();

  useEffect(() => {
    const destroySub = destroyBtn$
      .pipe(
        switchMap(() => delTodo(params.id)),
        tap(() => refreshTodos())
      ).subscribe();

    const updateItemSub = updateItemBtn$.pipe(
      switchMap((isChecked) => {
        const newObj = JSON.parse(JSON.stringify(params)) as todoType;
        newObj.completed = isChecked;
        return updateTodo(newObj);
      }),
      tap(() => refreshTodos())
    ).subscribe();

    return () => {
      destroySub.unsubscribe();
      updateItemSub.unsubscribe();
    };
  }, []);

  return (
    <li className={params.completed ? "completed" : ""}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={params.completed}
          onChange={(e) => {
            updateItemBtn$.next(e.target.checked);
          }}
        />
        <label>{params.title}</label>
        <button
          onClick={(e) => {
            destroyBtn$.next(true);
            e.preventDefault();
          }}
          className="destroy"
        ></button>
      </div>
    </li>
  );
}
