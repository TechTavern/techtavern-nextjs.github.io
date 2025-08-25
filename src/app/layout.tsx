import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b">
          <nav className="mx-auto max-w-3xl p-4 flex gap-4">
            <Link href="/" className="font-semibold">Home</Link>
            <Link href="/blog/" className="font-semibold">Blog</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
