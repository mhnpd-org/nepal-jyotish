"use client";

import React, { useState, useEffect } from 'react';
import { getAllAstrologers, getAllAppointments, updateUserById } from '@internal/api/admin';
import { auth } from '@internal/api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserById as getUserDoc } from '@internal/api/users';
import { isSuperAdmin } from '@internal/api/roleGuards';
import AppHeader from '@internal/layouts/app-header';
import Footer from '@internal/layouts/footer';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@internal/api/firebase';
import type { AppUser, Appointment } from '@internal/api/types';

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [astrologers, setAstrologers] = useState<AppUser[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tab, setTab] = useState<'users' | 'astrologers' | 'appointments'>('users');
  const [usersPage, setUsersPage] = useState(1);
  const [astrologersPage, setAstrologersPage] = useState(1);
  const [appointmentsPage, setAppointmentsPage] = useState(1);
  const itemsPerPage = 10;

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

  const toStringSafe = (v: unknown) => (v === null || v === undefined ? '' : String(v));

  const handleRoleChange = async (userId: string, newRole: 'user' | 'astrologer') => {
    try {
      await updateUserById(userId, { role: newRole });
      // Refresh users list
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ uid: d.id, ...(d.data() as Record<string, unknown>) } as AppUser)));
      // Refresh astrologers list if needed
      const astros = await getAllAstrologers();
      setAstrologers(astros);
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update role. Check console for details.');
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const doc = await getUserDoc(u.uid);
      setCurrentUser(doc);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!currentUser || !isSuperAdmin(currentUser)) return;

    // Fetch all users
    getDocs(collection(db, 'users')).then(snap => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...(d.data() as Record<string, unknown>) } as AppUser)));
    });

    getAllAstrologers().then(setAstrologers);
    getAllAppointments().then(setAppointments);
  }, [currentUser]);

  if (loading) {
    return (
      <>
        <AppHeader variant="solid" language="np" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-rose-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer variant="light" />
      </>
    );
  }

  if (!currentUser || !isSuperAdmin(currentUser)) {
    return (
      <>
        <AppHeader variant="solid" language="np" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-amber-50">
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to view this page.</p>
          </div>
        </div>
        <Footer variant="light" />
      </>
    );
  }

  // Pagination logic
  const usersTotalPages = Math.ceil(users.length / itemsPerPage);
  const astrologersTotalPages = Math.ceil(astrologers.length / itemsPerPage);
  const appointmentsTotalPages = Math.ceil(appointments.length / itemsPerPage);
  
  const paginatedUsers = users.slice(
    (usersPage - 1) * itemsPerPage,
    usersPage * itemsPerPage
  );
  
  const paginatedAstrologers = astrologers.slice(
    (astrologersPage - 1) * itemsPerPage,
    astrologersPage * itemsPerPage
  );
  
  const paginatedAppointments = appointments.slice(
    (appointmentsPage - 1) * itemsPerPage,
    appointmentsPage * itemsPerPage
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
          Previous
        </button>
        
        <div className="flex gap-1">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            const page = i + 1;
            if (totalPages > 10 && page > 5 && page < totalPages - 4 && Math.abs(page - currentPage) > 2) {
              return null;
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <AppHeader variant="solid" language="np" currentPage="home" />
      <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage users, astrologers, and appointments</p>
          </div>

          <div className="mb-6 flex gap-2 flex-wrap">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                tab === 'users'
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-rose-300'
              }`}
              onClick={() => setTab('users')}
            >
              👥 Users ({users.length})
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                tab === 'astrologers'
                  ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300'
              }`}
              onClick={() => setTab('astrologers')}
            >
              ⭐ Astrologers ({astrologers.length})
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                tab === 'appointments'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setTab('appointments')}
            >
              📅 Appointments ({appointments.length})
            </button>
          </div>

          {tab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-orange-50">
                <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
                <p className="text-sm text-gray-600 mt-1">Total: {users.length} users</p>
              </div>
              <div className="overflow-x-auto">
                {paginatedUsers.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No users found</p>
                ) : (
                  <>
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">#</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Name</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Email</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Role</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Created</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.map((u, idx) => (
                          <tr key={getUid(u)} className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors">
                            <td className="py-4 px-6 text-sm text-gray-900">{(usersPage - 1) * itemsPerPage + idx + 1}</td>
                            <td className="py-4 px-6 text-sm text-gray-900 font-medium">{u.name || 'N/A'}</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{u.email}</td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                                u.role === 'astrologer' ? 'bg-amber-100 text-amber-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {u.role || 'user'}
                              </span>
                            </td>
                              <td className="py-4 px-6 text-sm text-gray-600">
                              {formatCreatedAt(u.createdAt)}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex gap-2">
                                {u.role !== 'super_admin' && u.role !== 'astrologer' && (
                                  <button
                                    onClick={() => handleRoleChange(getUid(u), 'astrologer')}
                                    className="px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700 transition-colors"
                                    title="Promote to Astrologer"
                                  >
                                    ⭐ Promote
                                  </button>
                                )}
                                {u.role === 'astrologer' && (
                                  <button
                                    onClick={() => handleRoleChange(getUid(u), 'user')}
                                    className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 transition-colors"
                                    title="Demote to User"
                                  >
                                    👤 Demote
                                  </button>
                                )}
                                {u.role === 'super_admin' && getUid(u) !== currentUser?.uid && (
                                  <span className="px-3 py-1 text-xs text-gray-500 italic">Protected</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-4">
                      <Pagination 
                        currentPage={usersPage} 
                        totalPages={usersTotalPages} 
                        onPageChange={setUsersPage} 
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {tab === 'astrologers' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-rose-50">
                <h2 className="text-xl font-semibold text-gray-900">All Astrologers</h2>
                <p className="text-sm text-gray-600 mt-1">Total: {astrologers.length} astrologers</p>
              </div>
              <div className="overflow-x-auto">
                {paginatedAstrologers.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No astrologers found</p>
                ) : (
                  <>
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">#</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Name</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Email</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Role</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAstrologers.map((a, idx) => (
                          <tr key={getUid(a)} className="border-b border-gray-100 hover:bg-amber-50/30 transition-colors">
                            <td className="py-4 px-6 text-sm text-gray-900">{(astrologersPage - 1) * itemsPerPage + idx + 1}</td>
                            <td className="py-4 px-6 text-sm text-gray-900 font-medium">{a.name || 'N/A'}</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{a.email}</td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                {a.role}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">
                              {formatCreatedAt(a.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-4">
                      <Pagination 
                        currentPage={astrologersPage} 
                        totalPages={astrologersTotalPages} 
                        onPageChange={setAstrologersPage} 
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {tab === 'appointments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <h2 className="text-xl font-semibold text-gray-900">All Appointments</h2>
                <p className="text-sm text-gray-600 mt-1">Total: {appointments.length} appointments</p>
              </div>
              <div className="overflow-x-auto">
                {paginatedAppointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No appointments found</p>
                ) : (
                  <>
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">#</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">User</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Astrologer</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Date/Time</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Room</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAppointments.map((ap, idx) => (
                          <tr key={toStringSafe(ap.id)} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                            <td className="py-4 px-6 text-sm text-gray-900">{(appointmentsPage - 1) * itemsPerPage + idx + 1}</td>
                            <td className="py-4 px-6 text-sm text-gray-900 font-medium">{ap.userId.substring(0, 12)}...</td>
                            <td className="py-4 px-6 text-sm text-gray-900">{ap.astrologerId.substring(0, 12)}...</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{toStringSafe((ap as unknown as Record<string, unknown>)['datetime']) || 'Not scheduled'}</td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                ap.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                ap.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {ap.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">{toStringSafe((ap as unknown as Record<string, unknown>)['callRoomId']) || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-4">
                      <Pagination 
                        currentPage={appointmentsPage} 
                        totalPages={appointmentsTotalPages} 
                        onPageChange={setAppointmentsPage} 
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer variant="light" />
    </>
  );
}
