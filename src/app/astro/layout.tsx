import React from 'react';
import Link from 'next/link';

export default function AstroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(90deg,#FF910B_0%,#EA5753_87%)]">
      <header className="h-16 flex items-center px-6 bg-transparent">
        <h1 className="text-white text-lg font-semibold">Vedanga Jyotish</h1>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white/95 shadow-inner p-4">
          <nav className="space-y-2">
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-amber-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v3a2 2 0 002 2h10z" />
              </svg>
              <span className="text-amber-800 font-medium">Janma Details</span>
            </Link>

            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-amber-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
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
