"use client";

import { Suspense } from "react";
import AppHeader from "@internal/layouts/app-header";
import Footer from "@internal/layouts/footer";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllAstrologers } from "@internal/api/astrologers";
import { createAppointment } from "@internal/api/appointments";
import { getBookedTimeSlots } from "@internal/api/appointments";
import { getUserById } from "@internal/api/users";
import { auth } from "@internal/api/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import TimeSlotPicker from "@internal/form-components/time-slot-picker";
// @ts-ignore
import NepaliDate from "nepali-date-converter";
import { format } from "date-fns";
import type { Astrologer, AppUser } from "@internal/api/types";

// Set page metadata via side effect
if (typeof document !== 'undefined') {
  document.title = "सेवा अनुरोध फारम | नेपाल ज्योतिष";
}

// Convert AD date to BS date string
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

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  serviceType: string;
  message: string;
  astrologerId: string;
  scheduledDate: string;
  scheduledTime: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  serviceType?: string;
  message?: string;
  astrologerId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

export const services = [
  { id: "muhurta", title: "मुहूर्त निर्धारण", subtitle: "Shubha Muhurta" },
  { id: "graha-shanti", title: "अरिष्ट ग्रह तथा योग शान्ती", subtitle: "Graha Shanti" },
  { id: "birth-chart", title: "चिना एवं जन्मकुण्डली निर्माण", subtitle: "Birth Chart" },
  { id: "vastu", title: "सम्पूर्ण वास्तु परामर्श", subtitle: "Vastu Service" },
  { id: "online-puja", title: "अनलाईन पुजा", subtitle: "Online Puja Service" },
  { id: "gemstones", title: "रत्न पत्थर वारे उचित परामर्श", subtitle: "Gemstones Service" },
  { id: "rashifal", title: "राशिफल दैनिक, साप्ताहिक, मासिक र वार्षिक", subtitle: "Rashifal" },
  { id: "speech", title: "पुराण, उत्प्रेरक एवं आध्यात्मिक प्रवचन", subtitle: "Motivational Speech" },
  { id: "solution", title: "ज्योतिषिय एवं वास्तुशास्त्र अनुसार समस्या समाधान", subtitle: "Astrology & Vastu Solution" },
];

function ServiceRequestForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preSelectedService = searchParams.get("service") || "";
  const preSelectedAstrologer = searchParams.get("astrologer") || "";

  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loadingAstrologers, setLoadingAstrologers] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    serviceType: preSelectedService,
    message: "",
    astrologerId: preSelectedAstrologer,
    scheduledDate: "",
    scheduledTime: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdAppointmentId, setCreatedAppointmentId] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Calculate max date (1 year from today)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate.toISOString().split('T')[0];
  };

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

  // Load astrologers on mount
  useEffect(() => {
    const loadAstrologers = async () => {
      try {
        const astrologersList = await getAllAstrologers();
        // Filter only active astrologers
        const activeAstrologers = astrologersList.filter(a => a.isActive !== false);
        setAstrologers(activeAstrologers);
      } catch (error) {
        console.error("Failed to load astrologers:", error);
      } finally {
        setLoadingAstrologers(false);
      }
    };

    loadAstrologers();
  }, []);

  // Prefill name and email if user is logged in
  useEffect(() => {
    if (userProfile && !formData.name && !formData.email) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.name || "",
        email: userProfile.email || "",
      }));
    }
  }, [userProfile, formData.name, formData.email]);

  // Fetch booked time slots when astrologer and date are selected
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (formData.astrologerId && formData.scheduledDate) {
        setLoadingSlots(true);
        try {
          const slots = await getBookedTimeSlots(formData.astrologerId, formData.scheduledDate);
          setBookedSlots(slots);
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
  }, [formData.astrologerId, formData.scheduledDate]);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Phone validation regex (Nepal format)
  const phoneRegex = /^[0-9]{10}$/;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "कृपया तपाईंको नाम लेख्नुहोस्";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "नाम कम्तिमा २ अक्षरको हुनुपर्छ";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "कृपया इमेल ठेगाना लेख्नुहोस्";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "कृपया मान्य इमेल ठेगाना लेख्नुहोस्";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "कृपया फोन नम्बर लेख्नुहोस्";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "कृपया मान्य १० अङ्कको फोन नम्बर लेख्नुहोस्";
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "कृपया स्थान लेख्नुहोस्";
    }

    // Service type validation
    if (!formData.serviceType) {
      newErrors.serviceType = "कृपया सेवा छान्नुहोस्";
    }

    // Astrologer validation
    if (!formData.astrologerId) {
      newErrors.astrologerId = "कृपया ज्योतिषी छान्नुहोस्";
    }

    // Date validation
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "कृपया मिति छान्नुहोस्";
    } else {
      const selectedDate = new Date(formData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      maxDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.scheduledDate = "कृपया भविष्यको मिति छान्नुहोस्";
      } else if (selectedDate > maxDate) {
        newErrors.scheduledDate = "एक वर्षभन्दा बढी अग्रिम बुकिङ गर्न सकिँदैन";
      }
    }

    // Time validation
    if (!formData.scheduledTime) {
      newErrors.scheduledTime = "कृपया समय छान्नुहोस्";
    } else if (bookedSlots.includes(formData.scheduledTime)) {
      newErrors.scheduledTime = "यो समय पहिले नै बुक भइसकेको छ। कृपया अर्को समय छान्नुहोस्";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "कृपया सन्देश लेख्नुहोस्";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "सन्देश कम्तिमा १० अक्षरको हुनुपर्छ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      setSubmitError("कृपया पहिले लगइन गर्नुहोस्");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const appointmentId = await createAppointment({
        userId: user.uid,
        astrologerId: formData.astrologerId,
        userName: formData.name.trim(),
        userEmail: formData.email.trim(),
        userPhone: formData.phone.trim(),
        userLocation: formData.location.trim(),
        serviceType: formData.serviceType,
        message: formData.message.trim(),
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        duration: 60, // 1 hour appointment
        status: "pending",
      });

      setCreatedAppointmentId(appointmentId);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        serviceType: "",
        message: "",
        astrologerId: "",
        scheduledDate: "",
        scheduledTime: "",
      });
    } catch (error) {
      setSubmitError(
        "अपोइन्टमेन्ट बुक गर्न सकिएन। कृपया पछि पुन: प्रयास गर्नुहोस्।"
      );
      console.error("Appointment creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && createdAppointmentId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
        <AppHeader variant="solid" language="np" />
        
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 sm:p-12 text-center shadow-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 text-white rounded-full mb-6 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              अपोइन्टमेन्ट बुक भयो!
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              तपाईंको अपोइन्टमेन्ट सफलतापूर्वक बुक गरिएको छ। तपाईं अपोइन्टमेन्ट विवरण पृष्ठमा मिटिङ लिङ्क र थप जानकारी पाउन सक्नुहुन्छ।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push(`/accounts/appointments/detail?id=${createdAppointmentId}`)}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
              >
                अपोइन्टमेन्ट विवरण हेर्नुहोस्
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setCreatedAppointmentId(null);
                }}
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-md border border-gray-200"
              >
                अर्को अपोइन्टमेन्ट बुक गर्नुहोस्
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      <AppHeader variant="solid" language="np" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            सेवा अनुरोध फारम
          </h1>
          <p className="text-lg text-gray-600">
            कृपया आफ्नो विवरण र चाहिएको सेवा भर्नुहोस्
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - How it works */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white">कसरी काम गर्छ?</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-sm">
                    १
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">फारम भर्नुहोस्</h4>
                    <p className="text-sm text-gray-600">
                      आफ्नो नाम, इमेल, फोन नम्बर र स्थान भर्नुहोस्। तपाईंलाई चाहिएको सेवा र गुरुजी छान्नुहोस्।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-sm">
                    २
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">मिति र समय छान्नुहोस्</h4>
                    <p className="text-sm text-gray-600">
                      तपाईंलाई उपयुक्त मिति र समय छान्नुहोस्। एक वर्षसम्मको अग्रिम बुकिङ गर्न सकिन्छ।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-sm">
                    ३
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">विवरण लेख्नुहोस्</h4>
                    <p className="text-sm text-gray-600">
                      सन्देश/विवरण खण्डमा तपाईंको समस्या वा छलफलको विषय विस्तृत रूपमा लेख्नुहोस्।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-sm">
                    ४
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">बुकिङ सिर्जना गर्नुहोस्</h4>
                    <p className="text-sm text-gray-600">
                      सबै जानकारी भरेपछि "अपोइन्टमेन्ट बुक गर्नुहोस्" बटन थिच्नुहोस्।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-sm">
                    ५
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">अपोइन्टमेन्ट हेर्नुहोस्</h4>
                    <p className="text-sm text-gray-600">
                      अकाउन्ट → अपोइन्टमेन्टहरू मा गएर तपाईंको सबै बुकिङहरू हेर्न सक्नुहुन्छ।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-sm">
                    ६
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">भिडियो कल सुरु गर्नुहोस्</h4>
                    <p className="text-sm text-gray-600">
                      तोकिएको मितिमा तपाईंको अपोइन्टमेन्ट खोल्नुहोस् र गुरुजीसँग भिडियो कलमा कुरा गर्नुहोस्।
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800">
                      <span className="font-semibold">नोट:</span> प्रत्येक अपोइन्टमेन्ट १ घण्टाको हुन्छ। तपाईं आफ्नो समस्या वा आवश्यकता अनुसार गुरुजीसँग छलफल गर्न सक्नुहुन्छ। आवश्यक भएमा तपाईं मिति पछाडि सार्न सक्नुहुन्छ।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 order-1 lg:order-2">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-rose-600 to-orange-600 px-6 sm:px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  आफ्नो विवरण भर्नुहोस्
                </h2>
                <p className="text-white/90 text-sm">
                  सबै क्षेत्रहरू अनिवार्य छन्
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                पूरा नाम <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  errors.name ? "border-rose-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all`}
                placeholder="तपाईंको पूरा नाम लेख्नुहोस्"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-rose-600">{errors.name}</p>
              )}
            </div>

            {/* Email and Phone in Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  इमेल ठेगाना <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    errors.email ? "border-rose-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-rose-600">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  फोन नम्बर <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    errors.phone ? "border-rose-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all`}
                  placeholder="98XXXXXXXX"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-rose-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Location Field */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                स्थान <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  errors.location ? "border-rose-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all`}
                placeholder="शहर, जिल्ला"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-rose-600">{errors.location}</p>
              )}
            </div>

            {/* Service Type Dropdown */}
            <div>
              <label
                htmlFor="serviceType"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                सेवाको प्रकार <span className="text-rose-600">*</span>
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  errors.serviceType ? "border-rose-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all bg-white`}
              >
                <option value="">सेवा छान्नुहोस्</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title} ({service.subtitle})
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <p className="mt-1 text-sm text-rose-600">{errors.serviceType}</p>
              )}
            </div>

            {/* Astrologer Selection */}
            <div>
              <label
                htmlFor="astrologerId"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                ज्योतिषी छान्नुहोस् <span className="text-rose-600">*</span>
              </label>
              {loadingAstrologers ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  ज्योतिषीहरू लोड हुँदैछ...
                </div>
              ) : astrologers.length === 0 ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  कुनै ज्योतिषी उपलब्ध छैन
                </div>
              ) : (
                <select
                  id="astrologerId"
                  name="astrologerId"
                  value={formData.astrologerId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    errors.astrologerId ? "border-rose-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all bg-white`}
                >
                  <option value="">ज्योतिषी छान्नुहोस्</option>
                  {astrologers.map((astrologer) => {
                    const serviceTitles = astrologer.services?.map((sid: string) => 
                      services.find(s => s.id === sid)?.title
                    ).filter(Boolean).join(", ") || "";
                    
                    return (
                      <option key={astrologer.uid} value={astrologer.uid}>
                        {astrologer.name}
                        {serviceTitles && ` - ${serviceTitles}`}
                      </option>
                    );
                  })}
                </select>
              )}
              {errors.astrologerId && (
                <p className="mt-1 text-sm text-rose-600">{errors.astrologerId}</p>
              )}
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Date Picker */}
              <div>
                <label
                  htmlFor="scheduledDate"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  मिति छान्नुहोस् <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, scheduledDate: e.target.value }));
                    if (errors.scheduledDate) {
                      setErrors(prev => ({ ...prev, scheduledDate: undefined }));
                    }
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  max={getMaxDate()}
                  className={`w-full px-4 py-3 border ${
                    errors.scheduledDate ? "border-rose-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all`}
                />
                {formData.scheduledDate && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ईस्वी:</span>
                      <span className="font-semibold text-gray-900">{formData.scheduledDate}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-600">विक्रम संवत्:</span>
                      <span className="font-semibold text-gray-900">
                        {adToBs(formData.scheduledDate)} ({getNepaliMonth(formData.scheduledDate)})
                      </span>
                    </div>
                  </div>
                )}
                {errors.scheduledDate && (
                  <p className="mt-1 text-sm text-rose-600">{errors.scheduledDate}</p>
                )}
              </div>

              {/* Time Display (Time Slot Picker is below) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  चयनित समय
                </label>
                <div className={`w-full px-4 py-3 border ${
                  errors.scheduledTime ? "border-rose-500" : "border-gray-300"
                } rounded-lg bg-gray-50 text-gray-700 font-medium`}>
                  {formData.scheduledTime || "समय छान्नुहोस्"}
                </div>
                {errors.scheduledTime && (
                  <p className="mt-1 text-sm text-rose-600">{errors.scheduledTime}</p>
                )}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                समय छान्नुहोस् (नेपाल समय) <span className="text-rose-600">*</span>
              </label>
              {!formData.scheduledDate ? (
                <div className="text-sm text-gray-500 py-4 px-4 bg-gray-50 rounded-lg border border-gray-200">
                  समय छान्न पहिले मिति छान्नुहोस्
                </div>
              ) : !formData.astrologerId ? (
                <div className="text-sm text-gray-500 py-4 px-4 bg-gray-50 rounded-lg border border-gray-200">
                  समय छान्न पहिले गुरुजी छान्नुहोस्
                </div>
              ) : loadingSlots ? (
                <div className="text-sm text-gray-500 py-4 px-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  उपलब्ध समय जाँच गर्दै...
                </div>
              ) : (
                <>
                  <TimeSlotPicker
                    selectedDate={formData.scheduledDate}
                    selectedTime={formData.scheduledTime}
                    onTimeSelect={(time) => {
                      setFormData(prev => ({ ...prev, scheduledTime: time }));
                      if (errors.scheduledTime) {
                        setErrors(prev => ({ ...prev, scheduledTime: undefined }));
                      }
                    }}
                    bookedSlots={bookedSlots}
                  />
                  {bookedSlots.length > 0 && (
                    <p className="text-xs text-amber-600 mt-2">
                      {bookedSlots.length} समय पहिले नै बुक भइसकेको छ
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                सन्देश / विवरण <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className={`w-full px-4 py-3 border ${
                  errors.message ? "border-rose-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all resize-none`}
                placeholder="तपाईंलाई चाहिने सेवाको विस्तृत विवरण लेख्नुहोस्..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-rose-600">{errors.message}</p>
              )}
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-rose-600">{submitError}</p>
              </div>
            )}

            {/* Login Notice */}
            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">लगइन आवश्यक छ</p>
                  <p>अपोइन्टमेन्ट बुक गर्न कृपया पहिले लगइन गर्नुहोस्।</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !user}
                className={`w-full px-6 py-4 font-semibold rounded-lg transition-all shadow-md ${
                  isSubmitting || !user
                    ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                    : "bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-700 hover:to-orange-700 hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    बुक हुँदैछ...
                  </span>
                ) : (
                  "अपोइन्टमेन्ट बुक गर्नुहोस्"
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              <span className="text-rose-600">*</span> चिन्ह लागेका क्षेत्रहरू अनिवार्य छन्
            </p>
          </form>
        </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ServiceRequestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
        <AppHeader variant="solid" language="np" />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-rose-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">लोड हुँदैछ...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ServiceRequestForm />
    </Suspense>
  );
}
