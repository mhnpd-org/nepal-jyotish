import React from 'react';
import AstroSidebar from '@internal/components/astro-sidebar';
import Logo from '@internal/layouts/logo';

export default function AstroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-vedanga-gradient w-full overflow-x-hidden">
      <header className="h-16 flex items-center gap-4 px-4 sm:px-5 md:px-8 bg-gradient-to-b from-amber-900/30 via-amber-900/10 to-transparent w-full">
        <Logo size="md" variant="light" href="/" />
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
