"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAppointmentById, addComment, updateAppointmentStatus } from "@internal/api/appointments";
import { getBookedTimeSlots } from "@internal/api/appointments";
import { getAstrologerById } from "@internal/api/astrologers";
import { getUserById } from "@internal/api/users";
import { updateAppointmentSchedule } from '@internal/api/appointments';
import { auth } from "@internal/api/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { Appointment, Astrologer, AppUser } from "@internal/api/types";
import { services } from "@internal/app/service-request/page";
import TimeSlotPicker from "@internal/form-components/time-slot-picker";
import CentralLoading from "@internal/layouts/central-loading";
// @ts-ignore
import NepaliDate from "nepali-date-converter";
import { format } from "date-fns";

// Set page metadata via side effect
if (typeof document !== 'undefined') {
  document.title = "अपोइन्टमेन्ट विवरण | नेपाल ज्योतिष";
}

// Convert AD date to BS date string for display
const adToBs = (adDate: string): string => {
  try {
    if (!adDate || !/^\d{4}-\d{2}-\d{2}$/.test(adDate)) return "";
    const [year, month, day] = adDate.split("-").map(Number);
    const nd = new NepaliDate(new Date(year, month - 1, day));
    return nd.format ? nd.format("YYYY-MM-DD") : `${nd.getYear()}-${String(nd.getMonth() + 1).padStart(2, "0")}-${String(nd.getDate()).padStart(2, "0")}`;
  } catch {
    return adDate;
  }
};

// Get Nepali month name
const getNepaliMonth = (adDate: string): string => {
  try {
    const [year, month, day] = adDate.split("-").map(Number);
    const nd = new NepaliDate(new Date(year, month - 1, day));
    const monthNames = ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"];
    return monthNames[nd.getMonth()] || "";
  } catch {
    return "";
  }
};

// Convert BS date to AD date string (currently unused but kept for potential future use)
const _bsToAd = (bsDate: string): string => {
  try {
    if (!bsDate || !/^\d{4}-\d{2}-\d{2}$/.test(bsDate)) return "";
    const nd = new NepaliDate(bsDate);
    const jsDate = nd.toJsDate();
    return format(jsDate, "yyyy-MM-dd");
  } catch {
    return bsDate;
  }
};

function AppointmentDetailContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("id");

  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserById(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadAppointment = async () => {
      if (!appointmentId || !user) {
        if (!appointmentId) {
          setError("अपोइन्टमेन्ट ID फेला परेन");
          setLoading(false);
        }
        return;
      }

      try {
        const appt = await getAppointmentById(appointmentId);
        
        if (!appt) {
          setError("अपोइन्टमेन्ट फेला परेन");
          setLoading(false);
          return;
        }

        // Check if user has access to this appointment
        if (user.uid !== appt.userId && user.uid !== appt.astrologerId) {
          const isSuperAdmin = userProfile?.role === 'super_admin';
          if (!isSuperAdmin) {
            setError("तपाईंलाई यो अपोइन्टमेन्ट हेर्ने अनुमति छैन");
            setLoading(false);
            return;
          }
        }

        setAppointment(appt);

        // Load astrologer details
        const astro = await getAstrologerById(appt.astrologerId);
        setAstrologer(astro);
      } catch (err) {
        console.error("Failed to load appointment:", err);
        setError("अपोइन्टमेन्ट लोड गर्न सकिएन");
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [appointmentId, user, userProfile]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appointmentId || !user || !userProfile || !commentText.trim()) {
      return;
    }

    setIsSubmittingComment(true);
    
    try {
      await addComment(appointmentId, {
        userId: user.uid,
        userName: userProfile.name || "Unknown",
        text: commentText.trim(),
        timestamp: new Date().toISOString(),
      });

      // Reload appointment to get updated comments
      const updatedAppt = await getAppointmentById(appointmentId);
      if (updatedAppt) {
        setAppointment(updatedAppt);
      }

      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("टिप्पणी थप्न सकिएन");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleStatusChange = async (newStatus: Appointment['status']) => {
    if (!appointmentId || !user) return;

    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      
      // Reload appointment
      const updatedAppt = await getAppointmentById(appointmentId);
      if (updatedAppt) {
        setAppointment(updatedAppt);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("स्थिति अपडेट गर्न सकिएन");
    }
  };

  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState(appointment?.scheduledDate || '');
  const [newTime, setNewTime] = useState(appointment?.scheduledTime || '');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    setNewDate(appointment?.scheduledDate || '');
    setNewTime(appointment?.scheduledTime || '');
  }, [appointment]);

  // Fetch booked time slots when rescheduling and date is selected
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (showReschedule && newDate && appointment?.astrologerId) {
        setLoadingSlots(true);
        try {
          const slots = await getBookedTimeSlots(appointment.astrologerId, newDate);
          // Filter out current appointment's time slot if it's the same date
          const filteredSlots = slots.filter(slot => 
            !(newDate === appointment.scheduledDate && slot === appointment.scheduledTime)
          );
          setBookedSlots(filteredSlots);
        } catch (error) {
          console.error("Failed to fetch booked slots:", error);
          setBookedSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      } else {
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [showReschedule, newDate, appointment?.astrologerId, appointment?.scheduledDate, appointment?.scheduledTime]);

  const handleReschedule = async () => {
    if (!appointmentId || !user) return;
    if (!newDate || !newTime) {
      alert('कृपया नयाँ मिति र समय चयन गर्नुहोस्');
      return;
    }
    
    // Check if time slot is already booked
    if (bookedSlots.includes(newTime)) {
      alert('यो समय पहिले नै बुक भइसकेको छ। कृपया अर्को समय छान्नुहोस्');
      return;
    }
    
    // Validate date
    const selectedDate = new Date(newDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if past date
    if (selectedDate < today) {
      alert('विगतको मिति चयन गर्न सकिँदैन');
      return;
    }
    
    // Validate date is not more than 1 year in advance
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    
    if (selectedDate > maxDate) {
      alert('एक वर्षभन्दा बढी अग्रिम बुकिङ गर्न सकिँदैन');
      return;
    }
    
    // Prevent selecting past date/time in Nepal time
    const confirmMsg = `के तपाईं पक्का हुनुहुन्छ कि तपाईं यो अपोइन्टमेन्ट ${newDate} ${newTime} मा सार्न चाहनुहुन्छ?`;
    if (!confirm(confirmMsg)) return;

    setIsRescheduling(true);
    try {
      await updateAppointmentSchedule(appointmentId, newDate, newTime);
      const updatedAppt = await getAppointmentById(appointmentId);
      if (updatedAppt) setAppointment(updatedAppt);
      setShowReschedule(false);
    } catch (err) {
      console.error('Failed to reschedule:', err);
      alert('मिति परिवर्तन गर्न सकेन');
    } finally {
      setIsRescheduling(false);
    }
  };

  if (loading) {
    return <CentralLoading message="लोड हुँदैछ..." fullScreen={false} />;
  }

  if (error || !appointment) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 text-rose-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">त्रुटि</h1>
          <p className="text-gray-600">{error || "अपोइन्टमेन्ट फेला परेन"}</p>
          <a
            href="/accounts/appointments"
            className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all shadow-md"
          >
            अपोइन्टमेन्टहरू हेर्नुहोस्
          </a>
        </div>
      </div>
    );
  }

  const serviceTitle = services.find(s => s.id === appointment.serviceType)?.title || appointment.serviceType;
  const isUserView = user?.uid === appointment.userId;
  const isAstrologerView = user?.uid === appointment.astrologerId;
  const canManageStatus = isAstrologerView || userProfile?.role === 'super_admin';

  // Check if today is the scheduled date
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const isScheduledToday = appointment.scheduledDate === today;
  const scheduledDateObj = new Date(appointment.scheduledDate);
  const isPastAppointment = scheduledDateObj < new Date(today);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const statusLabels = {
    pending: "विचाराधीन",
    confirmed: "पुष्टि भयो",
    completed: "पूरा भयो",
    cancelled: "रद्द गरियो",
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              अपोइन्टमेन्ट विवरण
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              ID: <span className="font-mono text-xs">{appointmentId}</span>
            </p>
          </div>
          <Link
            href="/accounts/appointments"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← पछाडि जानुहोस्
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Meeting Card */}
          {appointment.meetingLink && appointment.status !== 'cancelled' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">भिडियो मिटिङ</h2>
                </div>
              </div>

              <div className="p-6">
                {!isScheduledToday ? (
                  <div className="text-center py-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      isPastAppointment 
                        ? 'bg-gray-100 text-gray-400' 
                        : 'bg-gray-100 text-rose-600'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {isPastAppointment ? 'मिटिङ समाप्त भयो' : 'मिटिङ आउँदै छ'}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {isPastAppointment 
                        ? 'यो अपोइन्टमेन्टको मिति बितिसकेको छ।'
                        : `तपाईंको मिटिङ ${adToBs(appointment.scheduledDate)} (विक्रम संवत्) मा ${appointment.scheduledTime} बजे शेड्युल गरिएको छ।`
                      }
                    </p>
                    {!isPastAppointment && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-w-md mx-auto">
                        <div className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-xs text-gray-800 text-left">
                            भिडियो मिटिङमा जोडिने विकल्प शेड्युल गरिएको मितिमा मात्र उपलब्ध हुनेछ।
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      मिटिङमा सामेल हुनुहोस्
                    </h3>
                    <p className="text-gray-600 mb-1 text-sm">
                      तपाईंको भिडियो परामर्श सुरु गर्न तयार छ
                    </p>
                    <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 mb-6">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-xs text-gray-700 font-semibold">
                        आज {appointment.scheduledTime} बजे • लाइभ
                      </p>
                    </div>
                    <Link
                      href={`/accounts/appointments/call?id=${appointmentId}`}
                      className="inline-block px-8 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-base font-bold rounded-xl hover:from-rose-700 hover:to-orange-700 transition-all shadow-sm hover:shadow-md"
                    >
                      🎥 मिटिङ सुरु गर्नुहोस्
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appointment Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">अपोइन्टमेन्ट जानकारी</h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-sm font-bold text-gray-700">स्थिति:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${statusColors[appointment.status]}`}>
                  {statusLabels[appointment.status]}
                </span>
              </div>

              {/* Service Type */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-sm font-bold text-gray-700">सेवा:</span>
                <span className="text-gray-900 font-semibold">{serviceTitle}</span>
              </div>

              {/* Scheduled Date & Time */}
              <div className="pb-4 border-b border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">मिति (विक्रम संवत्):</span>
                  <span className="text-gray-900 font-semibold text-sm">
                    {adToBs(appointment.scheduledDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">महिना:</span>
                  <span className="text-gray-900 font-semibold text-sm">
                    {getNepaliMonth(appointment.scheduledDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">मिति (ईस्वी):</span>
                  <span className="text-gray-600 font-semibold text-sm">
                    {appointment.scheduledDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">समय:</span>
                  <span className="text-gray-900 font-bold text-base">
                    {appointment.scheduledTime}
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-sm font-bold text-gray-700">अवधि:</span>
                <span className="text-gray-900 font-semibold">{appointment.duration} मिनेट</span>
              </div>

              {/* Astrologer Info */}
              {astrologer && (
                <div className="pb-4 border-b border-gray-200">
                  <span className="text-sm font-bold text-gray-700 block mb-3">ज्योतिषी:</span>
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-xl">
                    {astrologer.imageBase64 ? (
                      <img
                        src={astrologer.imageBase64}
                        alt={astrologer.name || "Astrologer"}
                        className="w-14 h-14 rounded-full object-cover border-2 border-rose-300"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {(astrologer.name || "A").charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{astrologer.name}</p>
                      {astrologer.languages && astrologer.languages.length > 0 && (
                        <p className="text-sm text-gray-600">{astrologer.languages.join(", ")}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* User Info (visible to astrologer/admin) */}
              {(isAstrologerView || userProfile?.role === 'super_admin') && (
                <div className="pb-4 border-b border-gray-200">
                  <span className="text-sm font-bold text-gray-700 block mb-3">ग्राहक जानकारी:</span>
                  <div className="grid grid-cols-1 gap-3 text-sm bg-gray-50 border border-gray-200 p-4 rounded-xl">
                    <div>
                      <span className="text-gray-600 font-medium">नाम:</span>
                      <span className="ml-2 text-gray-900 font-bold">{appointment.userName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">इमेल:</span>
                      <span className="ml-2 text-gray-900 font-semibold break-all">{appointment.userEmail}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">स्थान:</span>
                      <span className="ml-2 text-gray-900 font-semibold">{appointment.userLocation}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              {appointment.message && (
                <div>
                  <span className="text-sm font-bold text-gray-700 block mb-3">सन्देश:</span>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{appointment.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Actions Card */}
          {(canManageStatus || (isUserView && appointment.status !== 'completed' && appointment.status !== 'cancelled' && !isPastAppointment)) && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">कार्यहरू</h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Management (for astrologer/admin) */}
                {canManageStatus && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      स्थिति परिवर्तन गर्नुहोस्:
                    </label>
                    <div className="flex flex-col gap-2">
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange('confirmed')}
                          className="w-full px-5 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl hover:from-rose-700 hover:to-orange-700 transition-all text-sm font-bold shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          पुष्टि गर्नुहोस्
                        </button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange('completed')}
                          className="w-full px-5 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl hover:from-rose-700 hover:to-orange-700 transition-all text-sm font-bold shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          पूरा भयो
                        </button>
                      )}
                      {userProfile?.role === 'super_admin' && (
                        <button
                          onClick={() => handleStatusChange('cancelled')}
                          className="w-full px-5 py-3 bg-white text-rose-700 border border-rose-200 rounded-xl hover:border-rose-300 transition-all text-sm font-bold shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          रद्द गर्नुहोस्
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Reschedule (postpone) for users */}
                {isUserView && appointment.status !== 'completed' && appointment.status !== 'cancelled' && !isPastAppointment && (
                  <div className={canManageStatus ? 'pt-6 border-t border-gray-200' : ''}>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      मिति परिवर्तन (पछाडि सर्नुहोस्):
                    </label>
                    {!showReschedule ? (
                      <button
                        onClick={() => setShowReschedule(true)}
                        className="w-full px-5 py-3 border border-gray-200 text-gray-800 rounded-xl hover:bg-gray-50 transition-all text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        पछाडि सर्नुहोस्
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2">
                            मिति छान्नुहोस्
                          </label>
                          <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            max={(() => {
                              const maxDate = new Date();
                              maxDate.setFullYear(maxDate.getFullYear() + 1);
                              return maxDate.toISOString().split('T')[0];
                            })()}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                          />
                          {newDate && (
                            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-600 font-medium">ईस्वी:</span>
                                <span className="font-bold text-gray-900">{newDate}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">विक्रम संवत्:</span>
                                <span className="font-bold text-gray-900">
                                  {adToBs(newDate)} ({getNepaliMonth(newDate)})
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2">
                            समय
                          </label>
                          {loadingSlots ? (
                            <div className="text-sm text-gray-500 py-6 px-4 bg-gray-50 rounded-xl border-2 border-gray-200 flex items-center justify-center gap-2">
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              उपलब्ध समय जाँच गर्दै...
                            </div>
                          ) : (
                            <>
                              <TimeSlotPicker
                                selectedDate={newDate}
                                selectedTime={newTime}
                                onTimeSelect={(time) => setNewTime(time)}
                                bookedSlots={bookedSlots}
                              />
                              {bookedSlots.length > 0 && (
                                <p className="text-xs text-amber-700 mt-2 font-medium">
                                  ⚠️ {bookedSlots.length} समय पहिले नै बुक भइसकेको छ
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleReschedule}
                            disabled={isRescheduling || !newDate || !newTime}
                            className={`flex-1 px-5 py-3 rounded-xl text-white font-bold ${isRescheduling || !newDate || !newTime ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700'} shadow-sm hover:shadow-md`}
                          >
                            {isRescheduling ? 'रिच्छित हुँदैछ...' : 'पुष्टि गर्नुहोस्'}
                          </button>
                          <button
                            onClick={() => setShowReschedule(false)}
                            className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold"
                          >
                            रद्द
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">टिप्पणीहरू</h2>
              </div>
            </div>

            <div className="p-6">
              {/* Comment Form */}
              {user && (isUserView || isAstrologerView || userProfile?.role === 'super_admin') && (
                <form onSubmit={handleAddComment} className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    नयाँ टिप्पणी थप्नुहोस्
                  </label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="टिप्पणी लेख्नुहोस्..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className={`mt-3 w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                      isSubmittingComment || !commentText.trim()
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-700 hover:to-orange-700 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {isSubmittingComment ? "पठाउँदै..." : "टिप्पणी थप्नुहोस्"}
                  </button>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {appointment.comments && appointment.comments.length > 0 ? (
                  appointment.comments.map((comment, index) => (
                    <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-600 to-orange-600 flex items-center justify-center text-white font-bold">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{comment.userName}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleString('ne-NP')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">
                      अहिलेसम्म कुनै टिप्पणी छैन
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentDetailPage() {
  return (
    <Suspense fallback={<CentralLoading message="लोड हुँदैछ..." fullScreen={false} />}>
      <AppointmentDetailContent />
    </Suspense>
  );
}
