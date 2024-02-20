import * as React from 'react';
import TodoApp from '~/components/react-todos/app';


export interface IAppProps {
}

export default function App (props: IAppProps) {
  return (
    <div className="mt-12 w-full flex flex-col items-center">
      <TodoApp />
    </div>
  );
}
