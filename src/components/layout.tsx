import Link from "next/link";

export default function Layout({ children }: { children: any}) {
  return (
    <div className="w-full h-screen p-4">
      <nav className="mb-4">
        <ul className="flex gap-2">
          <li><Link className="text-blue-600 underline" href="/">Home</Link></li>
          <li><Link className="text-blue-600 underline" href="/todos">Todos</Link></li>
        </ul>
      </nav>
      <main>
        {children}
      </main>
    </div>
  )
}


