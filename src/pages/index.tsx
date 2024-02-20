import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

import { trpc } from '~/utils/trpc';

const func = async () => {
  const result0 = await trpc.greeting.query({ name: 'bb' });
  return { result0 }
}

export default function Home() {
  const [msg, setMsg] = useState<string>();

  useEffect(() => {
    func().then(obj => setMsg(obj.result0.text));
  }, []);

  return (
    <>
      <h1>{msg}</h1>
    </>
  )

}
