"use client";

import React, { useState, useEffect } from "react";
import { getAstrologerById } from "@internal/api/astrologers";
import type { Astrologer } from "@internal/api/types";
import Link from "next/link";
import { services } from "@internal/app/service-request/page";
import AppHeader from "@internal/layouts/app-header";
import Footer from "@internal/layouts/footer";
import { useRouter, useSearchParams } from "next/navigation";
import LoginDialog from "@internal/components/login-dialog";
import { auth } from "@internal/api/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserById } from "@internal/api/users";

export default function AstrologerDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');
  
  const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userDoc = await getUserById(u.uid);
        setUser({ ...u, profile: userDoc });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (uid) {
      loadAstrologer();
    } else {
      setLoading(false);
    }
  }, [uid]);

  const loadAstrologer = async () => {
    if (!uid) return;
    try {
      const data = await getAstrologerById(uid);
      setAstrologer(data);
    } catch (error) {
      console.error("Error loading astrologer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookConsultation = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    router.push(`/kundali-matching?astrologer=${uid}`);
  };

  if (loading) {
    return (
      <>
        <AppHeader variant="solid" language="np" />
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!uid || !astrologer) {
    return (
      <>
        <AppHeader variant="solid" language="np" />
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ज्योतिषी फेला परेन</h2>
            <p className="text-gray-600 mb-6">माफ गर्नुहोस्, यो ज्योतिषी उपलब्ध छैन।</p>
            <Link
              href="/astrologers"
              className="inline-block px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all"
            >
              सबै ज्योतिषीहरू हेर्नुहोस्
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AppHeader variant="solid" language="np" />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-rose-600 to-orange-600 p-8 text-white">
              <div className="flex items-start gap-6">
                {astrologer.imageBase64 ? (
                  <img
                    src={astrologer.imageBase64}
                    alt={astrologer.name || "ज्योतिषी"}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-5xl font-bold shadow-lg">
                    {astrologer.name?.charAt(0).toUpperCase() || "ज्"}
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{astrologer.name || "नामविहीन ज्योतिषी"}</h1>
                  {astrologer.bio && (
                    <p className="text-white/90 text-lg mb-3">{astrologer.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {astrologer.verified && (
                      <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                        ✓ प्रमाणित
                      </span>
                    )}
                    {astrologer.isActive !== false && (
                      <span className="px-3 py-1 text-rose-50 text-rose-600 border border-rose-600 text-sm font-medium rounded-full bg-white">
                        सक्रिय
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Rating */}
              {astrologer.ratingAvg !== undefined && astrologer.ratingCount !== undefined && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-amber-500">
                      <span className="text-3xl">★</span>
                      <span className="text-2xl font-bold text-gray-900">{astrologer.ratingAvg.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-600">({astrologer.ratingCount} समीक्षाहरू)</span>
                  </div>
                </div>
              )}

              {/* Description */}
              {astrologer.description && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">परिचय</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{astrologer.description}</p>
                </div>
              )}

              {/* Specialties */}
              {astrologer.specialty && astrologer.specialty.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">विशेषज्ञता</h2>
                  <div className="flex flex-wrap gap-2">
                    {astrologer.specialty.map((s) => (
                      <span
                        key={s}
                        className="px-4 py-2 bg-amber-50 text-amber-700 font-medium rounded-lg border border-amber-200"
                      >
                        {services.find((svc) => svc.id === s)?.title || s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {astrologer.languages && astrologer.languages.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">भाषाहरू</h2>
                  <div className="flex flex-wrap gap-2">
                    {astrologer.languages.map((l) => (
                      <span
                        key={l}
                        className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg border border-blue-200"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              {astrologer.availabilitySummary && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">उपलब्धता</h2>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 font-medium">{astrologer.availabilitySummary}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <Link
                  href="/astrologers"
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
                >
                  ← पछाडि जानुहोस्
                </Link>
                <button
                  onClick={handleBookConsultation}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-center font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all shadow-md"
                >
                  परामर्श बुक गर्नुहोस्
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <LoginDialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
    </>
  );
}
