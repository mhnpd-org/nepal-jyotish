import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AstroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(90deg,#FF910B_0%,#EA5753_87%)]">
      <header className="h-16 flex items-center px-6 bg-transparent">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Vedanga Logo" width={36} height={36} className="rounded-sm" />
          <h1 className="text-white text-lg font-semibold">Vedanga Jyotish</h1>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Responsive sidebar: icon-only on small screens, full on md+ */}
        <aside className="w-16 md:w-64 bg-white/95 shadow-inner p-2 md:p-4">
          <nav className="space-y-1 md:space-y-2 flex flex-col items-center md:items-start">
            <Link href="/astro/janma" title="Janma Details" className="flex items-center gap-3 md:gap-3 px-2 md:px-3 py-2 rounded hover:bg-amber-50 w-full justify-center md:justify-start">
              <Image src="/logo.svg" alt="Janma" width={20} height={20} className="h-5 w-5" />
              <span className="hidden md:inline text-amber-800 font-medium">Janma Details</span>
            </Link>

            <Link href="/astro/traditional" title="Traditional" className="flex items-center gap-3 md:gap-3 px-2 md:px-3 py-2 rounded hover:bg-amber-50 w-full justify-center md:justify-start">
              <Image src="/logo.svg" alt="Traditional" width={20} height={20} className="h-5 w-5" />
              <span className="hidden md:inline text-amber-800 font-medium">Traditional</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 bg-[rgba(255,255,250,0.9)]">
          {children}
        </main>
      </div>
    </div>
  );
}
