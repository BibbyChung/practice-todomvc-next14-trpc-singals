import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '~/styles/globals.css';
import Link from "next/link"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Create Next App with TypeScript, Tailwind CSS, NextAuth, Prisma, tRPC, and more.',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  )
}


