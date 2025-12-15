"use client";

import React, { useState, useEffect } from 'react';
import { auth } from '@internal/api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserById as getUserDoc } from '@internal/api/users';
import { updateUserById } from '@internal/api/admin';
import { isSuperAdmin } from '@internal/api/roleGuards';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@internal/api/firebase';
import type { AppUser } from '@internal/api/types';
import CentralLoading from '@internal/components/central-loading';
import { useRouter } from 'next/navigation';

export default function AccountsUsersPage() {
  const [_currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[]>([]);
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

  const handleRoleChange = async (userId: string, newRole: 'user' | 'astrologer') => {
    try {
      await updateUserById(userId, { role: newRole });
      // Refresh users list
      const snap = await getDocs(collection(db, 'users'));
      const allUsers = snap.docs.map(d => ({ uid: d.id, ...(d.data() as Record<string, unknown>) } as AppUser));
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('भूमिका अद्यावधिक गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।');
    }
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
      
      // Fetch all users
      const snap = await getDocs(collection(db, 'users'));
      const allUsers = snap.docs.map(d => ({ uid: d.id, ...(d.data() as Record<string, unknown>) } as AppUser));
      setUsers(allUsers);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return <CentralLoading message="लोड हुँदैछ..." />;
  }

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 प्रयोगकर्ताहरू</h1>
        <p className="text-gray-600">सबै प्रयोगकर्ताहरू व्यवस्थापन गर्नुहोस्</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-orange-50">
          <h2 className="text-xl font-semibold text-gray-900">सबै प्रयोगकर्ताहरू</h2>
          <p className="text-sm text-gray-600 mt-1">जम्मा: {users.length} प्रयोगकर्ताहरू</p>
        </div>
        <div className="overflow-x-auto">
          {paginatedUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-12">कुनै प्रयोगकर्ता फेला परेन</p>
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
                  {paginatedUsers.map((u, idx) => (
                    <tr key={getUid(u)} className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-900">{(page - 1) * itemsPerPage + idx + 1}</td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">{u.name || 'N/A'}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{u.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'astrologer' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role === 'super_admin' ? 'सुपर एडमिन' :
                           u.role === 'astrologer' ? 'ज्योतिषी' : 'प्रयोगकर्ता'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatCreatedAt(u.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          {u.role === 'super_admin' ? (
                            <span className="px-3 py-1 text-xs text-gray-500 italic">सुरक्षित</span>
                          ) : u.role !== 'astrologer' ? (
                            <button
                              onClick={() => handleRoleChange(getUid(u), 'astrologer')}
                              className="px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700 transition-colors"
                              title="ज्योतिषीमा स्तरोन्नति गर्नुहोस्"
                            >
                              ⭐ स्तरोन्नति
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRoleChange(getUid(u), 'user')}
                              className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 transition-colors"
                              title="प्रयोगकर्तामा अवनति गर्नुहोस्"
                            >
                              👤 अवनति
                            </button>
                          )}
                        </div>
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
