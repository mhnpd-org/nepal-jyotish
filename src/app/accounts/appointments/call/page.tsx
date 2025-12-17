"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAppointmentById } from "@internal/api/appointments";
import { getAstrologerById } from "@internal/api/astrologers";
import { getUserById } from "@internal/api/users";
import { auth } from "@internal/api/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { Appointment, Astrologer, AppUser } from "@internal/api/types";
import CentralLoading from "@internal/layouts/central-loading";
import CustomJitsiCall from "@internal/components/custom-jitsi-call";

function VideoCallContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get("id");

  const [user, setUser] = useState<User | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        router.push('/accounts/appointments');
      }
    });

    return () => unsubscribe();
  }, [router]);

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
          setError("तपाईंलाई यो भिडियो कल हेर्ने अनुमति छैन");
          setLoading(false);
          return;
        }

        // Check if appointment has a meeting link
        if (!appt.meetingLink) {
          setError("यो अपोइन्टमेन्टको लागि मिटिङ लिङ्क उपलब्ध छैन");
          setLoading(false);
          return;
        }

        setAppointment(appt);

        // Load astrologer and user profiles for display names
        try {
          const [astrologerData, userData] = await Promise.all([
            getAstrologerById(appt.astrologerId),
            user.uid === appt.userId ? getUserById(user.uid) : null
          ]);
          
          if (astrologerData) setAstrologer(astrologerData);
          if (userData) setUserProfile(userData);
        } catch (profileErr) {
          console.error("Failed to load profiles:", profileErr);
          // Continue anyway, we'll use fallback names
        }
      } catch (err) {
        console.error("Failed to load appointment:", err);
        setError("अपोइन्टमेन्ट लोड गर्न सकिएन");
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [appointmentId, user]);

  if (loading) {
    return <CentralLoading message="भिडियो कल लोड हुँदैछ..." fullScreen={true} />;
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 text-rose-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">त्रुटि</h1>
          <p className="text-gray-600 mb-6">{error || "भिडियो कल फेला परेन"}</p>
          <button
            onClick={() => router.push('/accounts/appointments')}
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all shadow-md"
          >
            अपोइन्टमेन्टहरू हेर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return <VideoCallRenderer appointment={appointment} appointmentId={appointmentId} user={user} astrologer={astrologer} userProfile={userProfile} />;
}

function VideoCallRenderer({ 
  appointment, 
  appointmentId, 
  user, 
  astrologer, 
  userProfile,
}: { 
  appointment: Appointment; 
  appointmentId: string | null; 
  user: User | null; 
  astrologer: Astrologer | null; 
  userProfile: AppUser | null;
}) {
  const router = useRouter();

  // Parse Jitsi meeting URL to get room name
  let roomName = "";
  
  try {
    const url = new URL(appointment.meetingLink!);
    roomName = url.pathname.substring(1); // Remove leading slash
  } catch (err) {
    console.error("Failed to parse meeting link:", err);
    // Fallback: use appointment ID as room name
    roomName = appointmentId || `appointment-${Date.now()}`;
  }

  const isUserView = user?.uid === appointment.userId;
  
  // Get the actual display name for the current user
  let displayName = "अतिथि"; // Guest fallback
  
  if (isUserView) {
    // User joining the call
    displayName = userProfile?.name || appointment.userName || user?.displayName || "ग्राहक";
  } else {
    // Astrologer joining the call
    displayName = astrologer?.name || user?.displayName || "ज्योतिषी";
  }

  const handleLeave = () => {
    router.push(`/accounts/appointments/detail?id=${appointmentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h1 className="text-white font-bold text-sm md:text-base">
            भिडियो परामर्श • {appointment.scheduledDate} • {appointment.scheduledTime}
          </h1>
        </div>
        <button
          onClick={handleLeave}
          className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden md:inline">विवरणमा फर्कनुहोस्</span>
          <span className="md:hidden">पछाडि</span>
        </button>
      </div>

      {/* Video Call Component */}
      <div className="flex-1 overflow-hidden">
        <CustomJitsiCall 
          displayName={displayName}
          roomName={roomName}
          onLeave={handleLeave}
          autoStart={true}
        />
      </div>

      {/* Footer Info - Only visible on larger screens */}
      <div className="hidden md:block bg-gray-800 border-t border-gray-700 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>सुरक्षित इन्क्रिप्टेड कनेक्शन</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>तपाईंको गोपनीयता सुरक्षित छ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoCallPage() {
  return (
    <Suspense fallback={<CentralLoading message="भिडियो कल लोड हुँदैछ..." fullScreen={true} />}>
      <VideoCallContent />
    </Suspense>
  );
}
