"use client";

import React, { useEffect, useState } from 'react';
import { auth } from '@internal/api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserAppointments, getAstrologerAppointments } from '@internal/api/appointments';
import { getUserById } from '@internal/api/users';
import { getAstrologerById } from '@internal/api/astrologers';
import { isAstrologer, isNormalUser, isSuperAdmin } from '@internal/api/roleGuards';
import AppHeader from '@internal/layouts/app-header';
import Footer from '@internal/layouts/footer';
import type { Appointment, Astrologer, AppUser } from '@internal/api/types';
import { services } from '@internal/app/service-request/page';

export default function AppointmentsPage() {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [astroAppointments, setAstroAppointments] = useState<Appointment[]>([]);
  const [astrologersCache, setAstrologersCache] = useState<Record<string, Astrologer>>({});
  const [tab, setTab] = useState<'user' | 'astrologer'>('user');
  const [loading, setLoading] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [astroPage, setAstroPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(u);
      const doc = await getUserById(u.uid);
      setProfile(doc);

      if (isNormalUser(doc)) {
        setTab('user');
        const list = await getUserAppointments(u.uid);
        setUserAppointments(list);
        
        // Load astrologers for user appointments
        const astrologerIds = [...new Set(list.map(a => a.astrologerId))];
        const astrologers = await Promise.all(
          astrologerIds.map(id => getAstrologerById(id))
        );
        const cache: Record<string, Astrologer> = {};
        astrologers.forEach(a => {
          if (a) cache[a.uid] = a;
        });
        setAstrologersCache(cache);
      } else if (isAstrologer(doc)) {
        setTab('astrologer');
        const list = await getAstrologerAppointments(u.uid);
        setAstroAppointments(list);
      } else if (isSuperAdmin(doc)) {
        setTab('user');
        const [uList, aList] = await Promise.all([
          getUserAppointments(u.uid),
          getAstrologerAppointments(u.uid),
        ]);
        setUserAppointments(uList);
        setAstroAppointments(aList);
        
        // Load astrologers for user appointments
        const astrologerIds = [...new Set(uList.map(a => a.astrologerId))];
        const astrologers = await Promise.all(
          astrologerIds.map(id => getAstrologerById(id))
        );
        const cache: Record<string, Astrologer> = {};
        astrologers.forEach(a => {
          if (a) cache[a.uid] = a;
        });
        setAstrologersCache(cache);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

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

  if (!user) {
    return (
      <>
        <AppHeader variant="solid" language="np" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-amber-50">
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Login Required</h1>
            <p className="text-gray-600">Please login to view your appointments.</p>
          </div>
        </div>
        <Footer variant="light" />
      </>
    );
  }

  // Pagination logic
  const userTotalPages = Math.ceil(userAppointments.length / itemsPerPage);
  const astroTotalPages = Math.ceil(astroAppointments.length / itemsPerPage);
  
  const paginatedUserAppointments = userAppointments.slice(
    (userPage - 1) * itemsPerPage,
    userPage * itemsPerPage
  );
  
  const paginatedAstroAppointments = astroAppointments.slice(
    (astroPage - 1) * itemsPerPage,
    astroPage * itemsPerPage
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
          ))}
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-2">
              📅 Appointments
            </h1>
            <p className="text-gray-600">View and manage your consultations</p>
          </div>

          <div className="mb-6 flex gap-2 flex-wrap">
            {(isNormalUser(profile) || isSuperAdmin(profile)) && (
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  tab === 'user'
                    ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-rose-300'
                }`}
                onClick={() => setTab('user')}
              >
                📅 My Bookings ({userAppointments.length})
              </button>
            )}
            {(isAstrologer(profile) || isSuperAdmin(profile)) && (
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  tab === 'astrologer'
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300'
                }`}
                onClick={() => setTab('astrologer')}
              >
                ⭐ To Attend ({astroAppointments.length})
              </button>
            )}
          </div>

          {tab === 'user' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-orange-50">
                <h2 className="text-xl font-semibold text-gray-900">Your Bookings</h2>
                <p className="text-sm text-gray-600 mt-1">Total: {userAppointments.length} appointments</p>
              </div>
              <div className="overflow-x-auto">
                {paginatedUserAppointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No appointments yet</p>
                ) : (
                  <>
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">#</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Astrologer</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Service</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Date & Time</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUserAppointments.map((a, idx) => {
                          const astrologer = astrologersCache[a.astrologerId];
                          const serviceTitle = services.find(s => s.id === a.serviceType)?.title || a.serviceType;
                          
                          return (
                            <tr key={a.id} className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors">
                              <td className="py-4 px-6 text-sm text-gray-900">{(userPage - 1) * itemsPerPage + idx + 1}</td>
                              <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                                {astrologer ? astrologer.name : a.astrologerId.substring(0, 12) + '...'}
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-600">{serviceTitle}</td>
                              <td className="py-4 px-6 text-sm text-gray-600">
                                {a.scheduledDate} {a.scheduledTime}
                              </td>
                              <td className="py-4 px-6">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  a.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                  a.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  a.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {a.status === 'pending' ? 'विचाराधीन' :
                                   a.status === 'confirmed' ? 'पुष्टि भयो' :
                                   a.status === 'completed' ? 'पूरा भयो' :
                                   a.status === 'cancelled' ? 'रद्द गरियो' : a.status}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <a
                                  href={`/appointments/detail?id=${a.id}`}
                                  className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all inline-block"
                                >
                                  विवरण हेर्नुहोस्
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="p-4">
                      <Pagination 
                        currentPage={userPage} 
                        totalPages={userTotalPages} 
                        onPageChange={setUserPage} 
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {tab === 'astrologer' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-rose-50">
                <h2 className="text-xl font-semibold text-gray-900">Appointments To Attend</h2>
                <p className="text-sm text-gray-600 mt-1">Total: {astroAppointments.length} appointments</p>
              </div>
              <div className="overflow-x-auto">
                {paginatedAstroAppointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No appointments scheduled</p>
                ) : (
                  <>
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">#</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Client</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Service</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Date & Time</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAstroAppointments.map((a, idx) => {
                          const serviceTitle = services.find(s => s.id === a.serviceType)?.title || a.serviceType;
                          
                          return (
                            <tr key={a.id} className="border-b border-gray-100 hover:bg-amber-50/30 transition-colors">
                              <td className="py-4 px-6 text-sm text-gray-900">{(astroPage - 1) * itemsPerPage + idx + 1}</td>
                              <td className="py-4 px-6 text-sm text-gray-900 font-medium">{a.userName}</td>
                              <td className="py-4 px-6 text-sm text-gray-600">{serviceTitle}</td>
                              <td className="py-4 px-6 text-sm text-gray-600">
                                {a.scheduledDate} {a.scheduledTime}
                              </td>
                              <td className="py-4 px-6">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  a.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                  a.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  a.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {a.status === 'pending' ? 'विचाराधीन' :
                                   a.status === 'confirmed' ? 'पुष्टि भयो' :
                                   a.status === 'completed' ? 'पूरा भयो' :
                                   a.status === 'cancelled' ? 'रद्द गरियो' : a.status}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <a
                                  href={`/appointments/detail?id=${a.id}`}
                                  className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all inline-block"
                                >
                                  विवरण हेर्नुहोस्
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="p-4">
                      <Pagination 
                        currentPage={astroPage} 
                        totalPages={astroTotalPages} 
                        onPageChange={setAstroPage} 
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
