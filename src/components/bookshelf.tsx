'use client';

import { ReactNode } from 'react';

interface BookshelfProps {
  children: ReactNode;
}

export default function Bookshelf({ children }: BookshelfProps) {
  return (
    <div className="relative">
      {/* Wooden shelf background */}
      <div className="space-y-16">
        {/* Each shelf row */}
        <div className="relative">
          {/* Shelf platform */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-amber-900/80 to-amber-950/90 rounded-sm shadow-2xl" 
               style={{
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.3)',
               }}>
            {/* Wood grain texture */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.1)_50%,transparent_100%)] bg-[length:4px_100%]" />
            {/* Shelf edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-amber-700/50" />
          </div>

          {/* Books on shelf */}
          <div className="relative pb-8 px-4">
            <div className="flex flex-wrap gap-8 justify-center items-end">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Shelf shadow on wall */}
      <div className="absolute -bottom-2 left-8 right-8 h-3 bg-black/5 blur-md rounded-full" />
    </div>
  );
}
