import React from 'react';
import Image from 'next/image';
import AstroSidebar from '@internal/components/astro-sidebar';

export default function AstroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-vedanga-gradient w-full overflow-x-hidden">
      <header className="h-16 flex items-center gap-4 px-4 sm:px-5 md:px-8 bg-gradient-to-b from-amber-900/30 via-amber-900/10 to-transparent w-full">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Vedanga Logo" width={38} height={38} className="rounded-sm shadow-[0_0_0_1px_rgba(255,255,255,0.3)]" />
          <h1 className="text-white font-semibold text-lg tracking-wide drop-shadow-sm select-none">
            Vedanga <span className="text-amber-200 font-light">Jyotish</span>
          </h1>
        </div>
      </header>
      <div className="flex flex-1 relative w-full min-w-0">
        <AstroSidebar />
        <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-7 bg-[rgba(255,255,250,0.82)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(255,255,250,0.72)] shadow-inner">
          <div className="mx-auto max-w-6xl w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
