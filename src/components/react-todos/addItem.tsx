import { useEffect, useRef } from "react";
import { EMPTY, switchMap, tap } from "rxjs";
import { useSubject } from "~/utils/common/rxjs-interop-react";
import { addTodo, refreshTodos } from "~/utils/services/todolist.service";

export default function AddItem() {
  const inputRef = useRef<HTMLInputElement>(null);
  const formSubmitForm$ = useSubject<boolean>();

  useEffect(() => {
    const formSubmitSub = formSubmitForm$.pipe(
      switchMap(() => {
        const v = inputRef.current?.value ?? '';
        if (v !== '' && inputRef.current) {
          return addTodo(v ?? '')
            .pipe(
              tap(() => {
                inputRef.current!.value = "";
                refreshTodos();
              }),
            );
        }
        return EMPTY;
      })
    ).subscribe();

    return () => {
      formSubmitSub.unsubscribe();
    };
  }, []);

  return (
    <header className="header">
      <h1>todos</h1>
      <form
        onSubmit={(e) => {
          formSubmitForm$.next(true);
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
