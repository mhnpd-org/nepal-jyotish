"use client";

import React, { useState, useEffect } from 'react';
import { auth } from '@internal/api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserById as getUserDoc } from '@internal/api/users';
import { getAllAstrologers } from '@internal/api/admin';
import { isSuperAdmin } from '@internal/api/roleGuards';
import type { AppUser } from '@internal/api/types';
import CentralLoading from '@internal/layouts/central-loading';
import { useRouter } from 'next/navigation';

export default function AccountsAstrologersPage() {
  const [_currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [astrologers, setAstrologers] = useState<AppUser[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  const getUid = (u: unknown): string => {
    if (!u || typeof u !== 'object') return '';
    const o = u as Record<string, unknown>;
    const uidVal = o['uid'];
    if (typeof uidVal === 'string') return uidVal;
    const idVal = o['id'];
    if (typeof idVal === 'string') return idVal;
    return '';
  };

  const formatCreatedAt = (ts: unknown) => {
    const s = ts as { seconds?: number } | undefined;
    if (s && typeof s.seconds === 'number') return new Date(s.seconds * 1000).toLocaleDateString();
    return '—';
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/');
        return;
      }

      const doc = await getUserDoc(u.uid);
      if (!isSuperAdmin(doc)) {
        router.push('/accounts/appointments');
        return;
      }

      setCurrentUser(doc);
      
      // Fetch all astrologers
      const astros = await getAllAstrologers();
      setAstrologers(astros);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return <CentralLoading message="लोड हुँदैछ..." />;
  }

  // Pagination logic
  const totalPages = Math.ceil(astrologers.length / itemsPerPage);
  const paginatedAstrologers = astrologers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          अघिल्लो
        </button>
        
        <div className="flex gap-1">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded ${
                currentPage === p
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          अर्को
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-2">⭐ ज्योतिषीहरू</h1>
        <p className="text-gray-600">सबै ज्योतिषीहरू हेर्नुहोस्</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">सबै ज्योतिषीहरू</h2>
          <p className="text-sm text-gray-600 mt-1">जम्मा: {astrologers.length} ज्योतिषीहरू</p>
        </div>
        <div className="overflow-x-auto">
          {paginatedAstrologers.length === 0 ? (
            <p className="text-gray-500 text-center py-12">कुनै ज्योतिषी फेला परेन</p>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">#</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">नाम</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">इमेल</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">भूमिका</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">सिर्जना मिति</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">कार्यहरू</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAstrologers.map((a, idx) => (
                    <tr key={getUid(a)} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-900">{(page - 1) * itemsPerPage + idx + 1}</td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">{a.name || 'N/A'}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{a.email}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 text-xs font-medium rounded-full border border-orange-200 text-orange-700 bg-white">
                          ज्योतिषी
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatCreatedAt(a.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={`/astrologers/detail?id=${getUid(a)}`}
                          className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all inline-block shadow-sm"
                        >
                          विवरण हेर्नुहोस्
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4">
                <Pagination 
                  currentPage={page} 
                  totalPages={totalPages} 
                  onPageChange={setPage} 
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
