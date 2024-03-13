'use client'
import { useState, useEffect } from "react";
import { trpc } from '~/utils/trpc';

const func = async () => {
  const result0 = await trpc.greeting.query({ name: 'bb' });
  return { result0 }
}

export default function Page() {
  const [msg, setMsg] = useState<string>();

  useEffect(() => {
    func().then(obj => setMsg(obj.result0.text));
  }, []);

  return (
    <>
      <h1>{msg}</h1>
    </>
  );
}
