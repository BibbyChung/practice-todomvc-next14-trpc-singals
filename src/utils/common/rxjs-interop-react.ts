import { computed, effect, signal, untracked, type Signal } from "@preact/signals-react";
import { useMemo, useRef, type MutableRefObject } from "react";
import { Observable, ReplaySubject, type Subscribable } from 'rxjs';
import { getSubject } from "./util";

type FunctionOrNullType = typeof Function | null;

const registry = new FinalizationRegistry((cleanupRef: MutableRefObject<FunctionOrNullType>) => {
  cleanupRef.current?.();
});

export default function useMemoCleanup<T>(callback: () => [T, FunctionOrNullType], deps: unknown[]) {
  const cleanupRef = useRef<FunctionOrNullType>(null); // holds a cleanup value
  const unmountRef = useRef(false); // the GC-triggering candidate

  if (!unmountRef.current) {
    unmountRef.current = true;
    // this works since refs are preserved for the component's lifetime
    registry.register(unmountRef, cleanupRef);
  }

  const returned = useMemo(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    const [returned, cleanup] = callback();
    cleanupRef.current = typeof cleanup === "function" ? cleanup : null;

    return returned;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return returned;
}

// ====

type State<T> = NoValueState | ValueState<T> | ErrorState;

interface NoValueState {
  kind: StateKind.NoValue;
}

interface ValueState<T> {
  kind: StateKind.Value;
  value: T;
}

interface ErrorState {
  kind: StateKind.Error;
  error: unknown;
}

const enum StateKind {
  NoValue,
  Value,
  Error,
}

export interface ToSignalOptions {
  initialValue?: unknown;
  rejectErrors?: boolean;
}

export function toSignal<T, U = undefined>(
  source: Observable<T> | Subscribable<T>,
  options?: ToSignalOptions & { initialValue?: U }
): Signal<T | U | null | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemoCleanup(() => {
    const state: Signal<State<T | U>> = signal<State<T | U>>({ kind: StateKind.Value, value: options?.initialValue as U });
    const sub = source.subscribe({
      next: value => {
        let v: unknown;
        try {
          if (typeof value === 'object' && value !== null) {
            v = Array.isArray(value) ? [...value] : { ...value };
          } else {
            v = value;
          }
        } catch (err) {
          v = value;
        }
        state.value = { kind: StateKind.Value, value: v as any as T };
      },
      error: error => {
        if (options?.rejectErrors) {
          throw error;
        }
        state.value = { kind: StateKind.Error, error };
      }
    });

    const disponseFunc = () => {
      sub.unsubscribe();
    };

    return [
      computed(() => {
        const current = state.value;
        switch (current.kind) {
          case StateKind.Value:
            return current.value;
          case StateKind.Error:
            throw current.error;
        }
      }),
      disponseFunc as FunctionOrNullType
    ];
  }, []);
}

export function toObservable<T>(
  source: Signal<T>
): Observable<T> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemoCleanup(() => {
    const subject = new ReplaySubject<T>(1);

    const dispose = effect(() => {
      let value: T;
      try {
        value = source.value;
      } catch (err) {
        untracked(() => subject.error(err));
        return;
      }
      untracked(() => subject.next(value));
    });

    const disposeFunc = () => {
      dispose();
      subject.complete();
    };

    return [
      subject.asObservable(),
      disposeFunc as FunctionOrNullType
    ];
  }, []);
}

export const useSubject = <T>() => {
  return useMemoCleanup(() => {
    const subject = getSubject<T>();

    const disposeFunc = () => {
      subject.complete();
    };

    return [
      subject,
      disposeFunc as FunctionOrNullType
    ];
  }, []);
};
