'use client';

import { TableOfContentsItem } from '@internal/lib/books';
import { useState, useEffect } from 'react';

interface TableOfContentsSidebarProps {
  items: TableOfContentsItem[];
}

export default function TableOfContentsSidebar({
  items,
}: TableOfContentsSidebarProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2[id], h3[id]');
      let current = '';

      for (const heading of headings) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        } else {
          break;
        }
      }

      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (items.length === 0) {
    return null;
  }

  const tocContent = (
    <nav className="space-y-2">
      {items.map((item) => {
        const isActive = activeId === item.slug;

        return (
          <a
            key={item.id}
            href={`#${item.slug}`}
            onClick={() => setMobileOpen(false)}
            className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
              item.level === 3 ? 'ml-4 text-sm' : 'font-medium text-base'
            } ${
              isActive
                ? 'bg-rose-100 text-rose-700 border-l-4 border-rose-600'
                : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
            }`}
          >
            {item.title}
          </a>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-100 h-fit sticky top-20 overflow-y-auto max-h-[calc(100vh-100px)]">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Table of Contents</h2>
          {tocContent}
        </div>
      </aside>

      {/* Mobile Toggle Button - Fixed in header area */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 transition-colors"
          aria-label="Toggle table of contents"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto animate-in slide-in-from-right">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Table of Contents</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {tocContent}
            </div>
          </div>
        </>
      )}
    </>
  );
}
