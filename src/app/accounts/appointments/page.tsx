"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { auth } from '@internal/api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserAppointments, getAstrologerAppointments, getAllAppointments } from '@internal/api/appointments';
import { getUserById } from '@internal/api/users';
import { getAstrologerById } from '@internal/api/astrologers';
import { isAstrologer, isNormalUser, isSuperAdmin } from '@internal/api/roleGuards';
import type { Appointment, Astrologer, AppUser } from '@internal/api/types';
import { services } from '@internal/app/service-request/page';
import CentralLoading from '@internal/layouts/central-loading';

export default function AccountsAppointmentsPage() {
  const [_user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [astroAppointments, setAstroAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [astrologersCache, setAstrologersCache] = useState<Record<string, Astrologer>>({});
  const [tab, setTab] = useState<'user' | 'astrologer' | 'all'>('user');
  const [loading, setLoading] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [astroPage, setAstroPage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const [userPastPage, setUserPastPage] = useState(1);
  const [astroPastPage, setAstroPastPage] = useState(1);
  const itemsPerPage = 9;

  // Helper function to parse appointment date and sort
  const parseAppointmentDate = (date: string): Date => {
    // Expected format: YYYY-MM-DD or similar
    return new Date(date);
  };

  // Helper function to check if appointment is older than 7 days
  const isOlderThan7Days = (date: string): boolean => {
    const appointmentDate = parseAppointmentDate(date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return appointmentDate < sevenDaysAgo;
  };

  // Sort and filter appointments by date
  const { upcomingUserAppointments, pastUserAppointments } = useMemo(() => {
    const sorted = [...userAppointments].sort((a, b) => {
      const dateA = parseAppointmentDate(a.scheduledDate);
      const dateB = parseAppointmentDate(b.scheduledDate);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });

    const upcoming = sorted.filter(a => !isOlderThan7Days(a.scheduledDate));
    const past = sorted.filter(a => isOlderThan7Days(a.scheduledDate));
    
    return { upcomingUserAppointments: upcoming, pastUserAppointments: past };
  }, [userAppointments]);

  const { upcomingAstroAppointments, pastAstroAppointments } = useMemo(() => {
    const sorted = [...astroAppointments].sort((a, b) => {
      const dateA = parseAppointmentDate(a.scheduledDate);
      const dateB = parseAppointmentDate(b.scheduledDate);
      return dateB.getTime() - dateA.getTime();
    });

    const upcoming = sorted.filter(a => !isOlderThan7Days(a.scheduledDate));
    const past = sorted.filter(a => isOlderThan7Days(a.scheduledDate));
    
    return { upcomingAstroAppointments: upcoming, pastAstroAppointments: past };
  }, [astroAppointments]);

  const sortedAllAppointments = useMemo(() => {
    return [...allAppointments].sort((a, b) => {
      const dateA = parseAppointmentDate(a.scheduledDate);
      const dateB = parseAppointmentDate(b.scheduledDate);
      return dateB.getTime() - dateA.getTime();
    });
  }, [allAppointments]);

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
        setTab('all');
        const [uList, aList, allList] = await Promise.all([
          getUserAppointments(u.uid),
          getAstrologerAppointments(u.uid),
          getAllAppointments(),
        ]);
        setUserAppointments(uList);
        setAstroAppointments(aList);
        setAllAppointments(allList);
        
        // Load astrologers for all appointments
        const astrologerIds = [...new Set(allList.map(a => a.astrologerId))];
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
    return <CentralLoading message="लोड हुँदैछ..." />;
  }

  // Pagination logic
  const userTotalPages = Math.ceil(upcomingUserAppointments.length / itemsPerPage);
  const astroTotalPages = Math.ceil(upcomingAstroAppointments.length / itemsPerPage);
  const allTotalPages = Math.ceil(sortedAllAppointments.length / itemsPerPage);
  const userPastTotalPages = Math.ceil(pastUserAppointments.length / itemsPerPage);
  const astroPastTotalPages = Math.ceil(pastAstroAppointments.length / itemsPerPage);
  
  const paginatedUserAppointments = upcomingUserAppointments.slice(
    (userPage - 1) * itemsPerPage,
    userPage * itemsPerPage
  );
  
  const paginatedAstroAppointments = upcomingAstroAppointments.slice(
    (astroPage - 1) * itemsPerPage,
    astroPage * itemsPerPage
  );

  const paginatedAllAppointments = sortedAllAppointments.slice(
    (allPage - 1) * itemsPerPage,
    allPage * itemsPerPage
  );

  const paginatedUserPastAppointments = pastUserAppointments.slice(
    (userPastPage - 1) * itemsPerPage,
    userPastPage * itemsPerPage
  );

  const paginatedAstroPastAppointments = pastAstroAppointments.slice(
    (astroPastPage - 1) * itemsPerPage,
    astroPastPage * itemsPerPage
  );

  const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          अघिल्लो
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}
        
        <div className="flex gap-1">
          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                currentPage === page
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          अर्को
        </button>
      </div>
    );
  };

  // Appointment Card Component
  const AppointmentCard = ({ 
    appointment, 
    astrologer, 
    showClient = false,
    variant = 'user'
  }: { 
    appointment: Appointment; 
    astrologer?: Astrologer | null;
    showClient?: boolean;
    variant?: 'user' | 'astrologer' | 'admin';
  }) => {
    const serviceTitle = services.find(s => s.id === appointment.serviceType)?.title || appointment.serviceType;
    
    const variantColors = {
      user: 'from-rose-600 to-orange-600',
      astrologer: 'from-amber-600 to-rose-600',
      admin: 'from-purple-600 to-blue-600'
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className={`h-1.5 bg-gradient-to-r ${variantColors[variant]}`} />
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {showClient ? appointment.userName : (astrologer?.name || 'ज्योतिषी')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{serviceTitle}</p>
            </div>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
              appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
              appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
              appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {appointment.status === 'pending' ? 'विचाराधीन' :
               appointment.status === 'confirmed' ? 'पुष्टि भयो' :
               appointment.status === 'completed' ? 'पूरा भयो' :
               appointment.status === 'cancelled' ? 'रद्द गरियो' : appointment.status}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{appointment.scheduledDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{appointment.scheduledTime}</span>
            </div>
            {variant === 'admin' && astrologer && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="truncate">ज्योतिषी: {astrologer.name}</span>
              </div>
            )}
          </div>

          <Link
            href={`/accounts/appointments/detail?id=${appointment.id}`}
            className={`block w-full text-center px-4 py-2.5 text-sm font-semibold bg-gradient-to-r ${variantColors[variant]} text-white rounded-lg hover:shadow-md transition-all`}
          >
            विवरण हेर्नुहोस्
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 अपोइन्टमेन्टहरू</h1>
        <p className="text-gray-600">आफ्नो परामर्श हेर्नुहोस् र व्यवस्थापन गर्नुहोस्</p>
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
            📅 मेरो बुकिङ ({upcomingUserAppointments.length})
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
            ⭐ उपस्थित हुने ({upcomingAstroAppointments.length})
          </button>
        )}
        {isSuperAdmin(profile) && (
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              tab === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setTab('all')}
          >
            👑 सबै अपोइन्टमेन्टहरू ({sortedAllAppointments.length})
          </button>
        )}
      </div>

      {tab === 'user' && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-orange-50">
              <h2 className="text-xl font-semibold text-gray-900">तपाईंको बुकिङहरू</h2>
              <p className="text-sm text-gray-600 mt-1">जम्मा: {upcomingUserAppointments.length} अपोइन्टमेन्टहरू</p>
            </div>
            <div className="p-4 sm:p-6">
              {paginatedUserAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-12">अहिलेसम्म कुनै अपोइन्टमेन्ट छैन</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedUserAppointments.map((a) => {
                      const astrologer = astrologersCache[a.astrologerId];
                      return (
                        <AppointmentCard 
                          key={a.id} 
                          appointment={a} 
                          astrologer={astrologer}
                          variant="user"
                        />
                      );
                    })}
                  </div>
                  <Pagination 
                    currentPage={userPage} 
                    totalPages={userTotalPages} 
                    onPageChange={setUserPage} 
                  />
                </>
              )}
            </div>
          </div>

          {/* Past Appointments Section */}
          {pastUserAppointments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
                <h2 className="text-xl font-semibold text-gray-900">विगतको अपोइन्टमेन्टहरू</h2>
                <p className="text-sm text-gray-600 mt-1">जम्मा: {pastUserAppointments.length} अपोइन्टमेन्टहरू</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedUserPastAppointments.map((a) => {
                    const astrologer = astrologersCache[a.astrologerId];
                    return (
                      <AppointmentCard 
                        key={a.id} 
                        appointment={a} 
                        astrologer={astrologer}
                        variant="user"
                      />
                    );
                  })}
                </div>
                <Pagination 
                  currentPage={userPastPage} 
                  totalPages={userPastTotalPages} 
                  onPageChange={setUserPastPage} 
                />
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'astrologer' && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-rose-50">
              <h2 className="text-xl font-semibold text-gray-900">उपस्थित हुने अपोइन्टमेन्टहरू</h2>
              <p className="text-sm text-gray-600 mt-1">जम्मा: {upcomingAstroAppointments.length} अपोइन्टमेन्टहरू</p>
            </div>
            <div className="p-4 sm:p-6">
              {paginatedAstroAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-12">कुनै अपोइन्टमेन्ट तालिकाबद्ध छैन</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedAstroAppointments.map((a) => (
                      <AppointmentCard 
                        key={a.id} 
                        appointment={a}
                        showClient={true}
                        variant="astrologer"
                      />
                    ))}
                  </div>
                  <Pagination 
                    currentPage={astroPage} 
                    totalPages={astroTotalPages} 
                    onPageChange={setAstroPage} 
                  />
                </>
              )}
            </div>
          </div>

          {/* Past Appointments Section */}
          {pastAstroAppointments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
                <h2 className="text-xl font-semibold text-gray-900">विगतको अपोइन्टमेन्टहरू</h2>
                <p className="text-sm text-gray-600 mt-1">जम्मा: {pastAstroAppointments.length} अपोइन्टमेन्टहरू</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedAstroPastAppointments.map((a) => (
                    <AppointmentCard 
                      key={a.id} 
                      appointment={a}
                      showClient={true}
                      variant="astrologer"
                    />
                  ))}
                </div>
                <Pagination 
                  currentPage={astroPastPage} 
                  totalPages={astroPastTotalPages} 
                  onPageChange={setAstroPastPage} 
                />
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'all' && isSuperAdmin(profile) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
            <h2 className="text-xl font-semibold text-gray-900">सबै अपोइन्टमेन्टहरू</h2>
            <p className="text-sm text-gray-600 mt-1">जम्मा: {sortedAllAppointments.length} अपोइन्टमेन्टहरू</p>
          </div>
          <div className="p-4 sm:p-6">
            {paginatedAllAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-12">कुनै अपोइन्टमेन्ट छैन</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedAllAppointments.map((a) => {
                    const astrologer = astrologersCache[a.astrologerId];
                    return (
                      <AppointmentCard 
                        key={a.id} 
                        appointment={a}
                        astrologer={astrologer}
                        showClient={true}
                        variant="admin"
                      />
                    );
                  })}
                </div>
                <Pagination 
                  currentPage={allPage} 
                  totalPages={allTotalPages} 
                  onPageChange={setAllPage} 
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
