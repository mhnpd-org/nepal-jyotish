"use client";

import React, { useState, useEffect } from "react";
import { getAllAstrologers } from "@internal/api/astrologers";
import type { Astrologer } from "@internal/api/types";
import Link from "next/link";
import AppHeader from "@internal/layouts/app-header";
import Footer from "@internal/layouts/footer";
import LoginDialog from "@internal/components/login-dialog";
import { auth } from "@internal/api/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AstrologersPage() {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setShowLoginDialog(true);
        setLoading(false);
      } else {
        loadAstrologers();
      }
    });
    return () => unsub();
  }, []);

  const loadAstrologers = async () => {
    try {
      const data = await getAllAstrologers();
      console.log('Loaded astrologers:', data);
      setAstrologers(data);
    } catch (error) {
      console.error("Error loading astrologers:", error);
    } finally {
      setLoading(false);
    }
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

  if (!user) {
    return (
      <>
        <AppHeader variant="solid" language="np" />
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">लगइन आवश्यक छ</h2>
            <p className="text-gray-600 mb-6">
              ज्योतिषीहरूको सूची हेर्न कृपया लगइन गर्नुहोस्।
            </p>
            <button
              onClick={() => setShowLoginDialog(true)}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all"
            >
              लगइन गर्नुहोस्
            </button>
          </div>
        </div>
        <Footer />
        <LoginDialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
      </>
    );
  }

  return (
    <>
      <AppHeader variant="solid" language="np" />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">हाम्रा ज्योतिषीहरू</h1>
          <p className="text-lg text-gray-600">
            व्यक्तिगत मार्गदर्शनका लागि अनुभवी पेशेवरहरूसँग जोडिनुहोस्
          </p>
        </div>

        {/* Astrologers Grid */}
        {astrologers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">कुनै ज्योतिषी फेला परेन।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {astrologers.map((astrologer) => (
              <div
                key={astrologer.uid}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6"
              >
                {/* Profile Image */}
                <div className="flex items-start gap-4 mb-4">
                  {astrologer.imageBase64 ? (
                    <img
                      src={astrologer.imageBase64}
                      alt={astrologer.name || "Astrologer"}
                      className="w-20 h-20 rounded-full object-cover border-2 border-rose-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-200 to-orange-200 flex items-center justify-center text-2xl font-bold text-white">
                      {astrologer.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {astrologer.name || "Unnamed Astrologer"}
                    </h3>
                    <div className="flex items-center gap-2">
                      {astrologer.verified && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          ✓ Verified
                        </span>
                      )}
                      {astrologer.isActive !== false && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {astrologer.bio && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{astrologer.bio}</p>
                )}

                {/* Description */}
                {astrologer.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {astrologer.description}
                  </p>
                )}

                {/* Rating */}
                {astrologer.ratingAvg !== undefined && astrologer.ratingCount !== undefined && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="text-lg">★</span>
                      <span className="font-semibold text-gray-900">{astrologer.ratingAvg.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-500">({astrologer.ratingCount} reviews)</span>
                  </div>
                )}

                {/* Specialties */}
                {astrologer.specialty && astrologer.specialty.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {astrologer.specialty.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                      {astrologer.specialty.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                          +{astrologer.specialty.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {astrologer.languages && astrologer.languages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Languages:</p>
                    <p className="text-sm text-gray-700">{astrologer.languages.join(", ")}</p>
                  </div>
                )}

                {/* Availability */}
                {astrologer.availabilitySummary && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Availability:</p>
                    <p className="text-sm text-gray-700">{astrologer.availabilitySummary}</p>
                  </div>
                )}
  <LoginDialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
    
                {/* Book Button */}
                <Link
                  href={`/kundali-matching?astrologer=${astrologer.uid}`}
                  className="block w-full py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-center font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all"
                >
                  Book Consultation
                </Link>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
      <Footer />
    </>
  );
}
