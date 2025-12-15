"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@internal/api/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserById, updateMyUserProfile } from "@internal/api/users";
import { getAstrologerById, updateAstrologerProfile } from "@internal/api/astrologers";
import { useRouter } from "next/navigation";
import type { Astrologer } from "@internal/api/types";
import type { User } from 'firebase/auth';
import { services } from "@internal/app/service-request/page";
import AppHeader from "@internal/layouts/app-header";
import Footer from "@internal/layouts/footer";
import CentralLoading from '@internal/components/central-loading';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<Partial<Astrologer>>({
    name: "",
    description: "",
    bio: "",
    specialty: [],
    languages: [],
    availabilitySummary: "",
    imageBase64: null,
    isActive: true,
  });
  const [newLanguage, setNewLanguage] = useState("");
  const router = useRouter();

  const getErrorMessage = (e: unknown) => {
    if (typeof e === 'string') return e;
    if (typeof e === 'object' && e !== null && 'message' in e) return String((e as { message?: unknown }).message ?? '');
    return String(e);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/");
        return;
      }

      try {
        const userDoc = await getUserById(u.uid);
        if (userDoc?.role !== "astrologer") {
          router.push("/");
          return;
        }

          setCurrentUser(u);

        // Load astrologer profile
        const astrologerDoc = await getAstrologerById(u.uid);
        setProfile({
          name: astrologerDoc?.name || userDoc?.name || u.displayName || "",
          description: astrologerDoc?.description || "",
          bio: astrologerDoc?.bio || "",
          specialty: astrologerDoc?.specialty || [],
          languages: astrologerDoc?.languages || [],
          availabilitySummary: astrologerDoc?.availabilitySummary || "",
          imageBase64: astrologerDoc?.imageBase64 || null,
          isActive: astrologerDoc?.isActive !== undefined ? astrologerDoc.isActive : true,
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, imageBase64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !profile.languages?.includes(newLanguage.trim())) {
      setProfile((prev) => ({
        ...prev,
        languages: [...(prev.languages || []), newLanguage.trim()],
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (item: string) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages?.filter((l) => l !== item),
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setSaving(true);

    try {
      // Update name in users collection (user-level update)
      if (profile.name) {
        try {
          await updateMyUserProfile(currentUser.uid, { name: profile.name });
        } catch (uErr: unknown) {
          console.error("User update failed:", uErr);
          setErrorMessage(`User update failed: ${getErrorMessage(uErr)}`);
          setSaving(false);
          return;
        }
      }

      // Update astrologer profile in astrologers collection (don't send uid)
      const { uid, ...profileToSave } = profile as Partial<Astrologer> & { uid?: string };
      try {
        await updateAstrologerProfile(currentUser.uid, profileToSave as Partial<Astrologer>);
      } catch (aErr: unknown) {
        console.error("Astrologer update failed:", aErr);
        setErrorMessage(`Profile update failed: ${getErrorMessage(aErr)}`);
        setSaving(false);
        return;
      }

      setSuccessMessage("Profile updated successfully.");
      // Auto-dismiss
      setTimeout(() => setSuccessMessage(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <CentralLoading message="Loading profile..." />;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <AppHeader variant="solid" language="np" />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Astrologer Profile</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <p className="text-gray-600">Manage your professional information</p>
            <div className="flex items-center gap-3">
              {successMessage && (
                <div className="px-4 py-2 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Image
              </label>
              <div className="flex items-center gap-4">
                {profile.imageBase64 && (
                  <img
                    src={profile.imageBase64}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-rose-200"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload a professional photo</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={profile.name || ""}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            {/* Short Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Bio
              </label>
              <input
                type="text"
                value={profile.bio || ""}
                onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Brief introduction (one line)"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                value={profile.description || ""}
                onChange={(e) => setProfile((prev) => ({ ...prev, description: e.target.value }))}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Tell people about your expertise, experience, and approach to astrology..."
              />
            </div>

            {/* Services (replaces Specialties) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Services Offered
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map((svc) => (
                  <label key={svc.id} className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-rose-50">
                    <input
                      type="checkbox"
                      checked={profile.specialty?.includes(svc.id) || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setProfile((prev) => {
                          const current = prev.specialty || [];
                          if (checked) {
                            return { ...prev, specialty: Array.from(new Set([...current, svc.id])) };
                          }
                          return { ...prev, specialty: current.filter((c) => c !== svc.id) };
                        });
                      }}
                      className="w-4 h-4 text-rose-600 border-gray-300 rounded"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{svc.title}</div>
                      <div className="text-xs text-gray-500">{svc.subtitle}</div>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Select services you provide. These will be shown on your public profile.</p>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Languages
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="e.g., English, Hindi, Nepali"
                />
                <button
                  onClick={addLanguage}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.languages?.map((l) => (
                  <span
                    key={l}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {l}
                    <button onClick={() => removeLanguage(l)} className="text-blue-600 hover:text-blue-900">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Availability Summary */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Availability Summary
              </label>
              <input
                type="text"
                value={profile.availabilitySummary || ""}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, availabilitySummary: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="e.g., Mon–Fri, 10am–6pm"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={profile.isActive || false}
                onChange={(e) => setProfile((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                Active (Available for appointments)
              </label>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </div>
  );
}
