import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AstroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(90deg,#FF910B_0%,#EA5753_87%)]">
      <header className="h-16 flex items-center px-6 bg-transparent">
        <h1 className="text-white text-lg font-semibold">Vedanga Jyotish</h1>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white/95 shadow-inner p-4">
          <nav className="space-y-2">
            <Link href="/astro/janma" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-amber-50">
              <Image src="/file.svg" alt="Janma" width={20} height={20} className="h-5 w-5" />
              <span className="text-amber-800 font-medium">Janma Details</span>
            </Link>

            <Link href="/astro/traditional" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-amber-50">
              <Image src="/globe.svg" alt="Traditional" width={20} height={20} className="h-5 w-5" />
              <span className="text-amber-800 font-medium">Traditional</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6 bg-[rgba(255,255,250,0.9)]">
          {children}
        </main>
      </div>
    </div>
  );
}
