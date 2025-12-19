"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { useSearchParams, useRouter } from "next/navigation";
import { getAppointmentById } from "@internal/api/appointments";
import { getAstrologerById } from "@internal/api/astrologers";
import { getUserById } from "@internal/api/users";
import { auth } from "@internal/api/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { Appointment, Astrologer, AppUser } from "@internal/api/types";
import CentralLoading from "@internal/layouts/central-loading";

type JitsiExternalAPI = {
  addEventListeners: (handlers: Record<string, () => void>) => void;
  dispose: () => void;
  executeCommand: (command: string, ...args: unknown[]) => void;
};

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: unknown) => JitsiExternalAPI;
  }
}

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
        router.push("/accounts/appointments");
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

  return (
    <VideoCallRenderer
      appointment={appointment}
      appointmentId={appointmentId}
      user={user}
      astrologer={astrologer}
      userProfile={userProfile}
    />
  );
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<JitsiExternalAPI | null>(null);

  const [instanceKey, setInstanceKey] = useState(0);

  const [externalReady, setExternalReady] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [embedError, setEmbedError] = useState<string | null>(null);
  const [callHeight, setCallHeight] = useState<number | null>(null);
  const iframeObsRef = useRef<MutationObserver | null>(null);
  const resizeObsRef = useRef<ResizeObserver | null>(null);

  const roomName = useMemo(() => {
    try {
      const url = new URL(appointment.meetingLink!);
      const segments = url.pathname.split("/").filter(Boolean);
      const path = segments[segments.length - 1] || "";
      return path || appointmentId || "appointment-room";
    } catch (err) {
      console.error("Failed to parse meeting link:", err);
      return appointmentId || "appointment-room";
    }
  }, [appointment.meetingLink, appointmentId]);

  const isUserView = user?.uid === appointment.userId;

  const jitsiHost = useMemo(() => {
    try {
      return new URL(appointment.meetingLink!).hostname || "meet.jit.si";
    } catch (err) {
      console.error("Failed to parse meeting link domain:", err);
      return "meet.jit.si";
    }
  }, [appointment.meetingLink]);

  const displayName = useMemo(() => {
    if (isUserView) {
      return userProfile?.name || appointment.userName || user?.displayName || "ग्राहक";
    }
    return astrologer?.name || user?.displayName || "ज्योतिषी";
  }, [astrologer?.name, appointment.userName, isUserView, user?.displayName, userProfile?.name]);

  useEffect(() => {
    setCallEnded(false);
    setEmbedError(null);
  }, [appointmentId]);

  useEffect(() => {
    const updateHeight = () => {
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      const viewport = window.innerHeight;
      setCallHeight(Math.max(viewport - headerHeight, 320));
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.addEventListener("orientationchange", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
    };
  }, []);

  useEffect(() => {
    if (!externalReady || callEnded) return;
    if (!containerRef.current) return;
    if (!window.JitsiMeetExternalAPI) return;
    if (apiRef.current) return;

    if (typeof window.JitsiMeetExternalAPI !== "function") {
      setEmbedError("Jitsi API उपलब्ध छैन");
      return;
    }

    const api = new window.JitsiMeetExternalAPI(jitsiHost, {
      roomName,
      parentNode: containerRef.current,
      // width: "100%",
      height: "80vh",
      userInfo: { displayName },
      configOverwrite: {
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
      },
      interfaceConfigOverwrite: {
        MOBILE_APP_PROMO: false,
        SHOW_JITSI_WATERMARK: false,
        SHOW_POWERED_BY: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        HIDE_INVITE_MORE_HEADER: true,
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "desktop",
          "chat",
          "raisehand",
          "tileview",
          "hangup",
          "settings",
        ],
      },
    });

    const onEnd = () => {
      setCallEnded(true);
      api.dispose();
      apiRef.current = null;
    };

    api.addEventListeners({
      readyToClose: onEnd,
      videoConferenceLeft: onEnd,
    });

    apiRef.current = api;

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [externalReady, appointment.meetingLink, roomName, displayName, callEnded, jitsiHost]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const applySize = () => {
      container.style.position = "relative";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.minHeight = "320px";
      container.style.maxHeight = "100%";

      const iframe = container.querySelector<HTMLIFrameElement>("iframe");
      if (!iframe) return;
      iframe.style.position = "absolute";
      iframe.style.inset = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "0";
      iframe.style.display = "block";
      iframe.setAttribute("allow", "camera; microphone; fullscreen; display-capture; clipboard-write");
    };

    applySize();

    const mo = new MutationObserver(applySize);
    mo.observe(container, { childList: true, subtree: true });
    iframeObsRef.current = mo;

    const ro = new ResizeObserver(applySize);
    ro.observe(container);
    resizeObsRef.current = ro;

    return () => {
      iframeObsRef.current?.disconnect();
      resizeObsRef.current?.disconnect();
      iframeObsRef.current = null;
      resizeObsRef.current = null;
    };
  }, [externalReady, callEnded]);

  const handleLeave = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("hangup");
      setCallEnded(true);
      return;
    }
    router.push(`/accounts/appointments/detail?id=${appointmentId}`);
  };

  const handleBackToDetails = () => {
    router.push(`/accounts/appointments/detail?id=${appointmentId}`);
  };

  const handleRetry = () => {
    setEmbedError(null);
    setCallEnded(false);
    apiRef.current?.dispose();
    apiRef.current = null;
    setInstanceKey((k) => k + 1);
  };

  return (
    <>
      <Script
        src={`https://${jitsiHost}/external_api.js`}
        strategy="afterInteractive"
        onLoad={() => setExternalReady(true)}
        onError={() => setEmbedError("Jitsi UI स्क्रिप्ट लोड हुन सकेन")}
      />

      <div key={instanceKey} style={{ height: callHeight ? `${callHeight}px` : "calc(100vh - 64px)" }} className="w-full max-w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col overflow-hidden">
        <div
          ref={headerRef}
          className="bg-gray-900/70 border-b border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0 backdrop-blur"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-xs text-gray-400">भिडियो परामर्श</p>
              <p className="text-sm md:text-base font-semibold">
                {appointment.scheduledDate} • {appointment.scheduledTime}
              </p>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-rose-600/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden md:inline">विवरणमा फर्कनुहोस्</span>
            <span className="md:hidden">पछाडि</span>
          </button>
        </div>

          <div
            className="flex-1 relative min-h-0 w-full overflow-hidden"
            style={{ height: callHeight ? `${callHeight}px` : "calc(100vh - 64px)" }}
          >
          {(!externalReady) && !callEnded && !embedError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <CentralLoading message="भिडियो कल तयार हुँदैछ..." fullScreen={false} />
            </div>
          ) : null}

            <div className={`${callEnded || embedError ? "hidden" : "block"} w-full h-full overflow-hidden relative`}>
              <div
                ref={containerRef}
                className="absolute inset-0"
                style={{ backgroundColor: "#000" }}
              />
            </div>

          {callEnded || embedError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-gray-950 via-gray-900 to-black">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">{embedError ? "भिडियो कल सुरु गर्न सकिएन" : "कल समाप्त भयो"}</p>
                <p className="text-gray-400 text-sm">
                  {embedError || "ज्योतिषी वा तपाईंको आग्रहमा कल बन्द गरिएको छ।"}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBackToDetails}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium border border-gray-700"
                >
                  अपोइन्टमेन्ट विवरण
                </button>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold shadow-lg shadow-emerald-600/30"
                >
                  पुन: जडान प्रयास गर्नुहोस्
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default function VideoCallPage() {
  return (
    <Suspense fallback={<CentralLoading message="भिडियो कल लोड हुँदैछ..." fullScreen={true} />}>
      <VideoCallContent />
    </Suspense>
  );
}
