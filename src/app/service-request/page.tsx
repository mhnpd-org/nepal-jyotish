"use client";

import { Suspense } from "react";
import AppHeader from "@internal/layouts/app-header";
import Footer from "@internal/layouts/footer";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

// Set page metadata via side effect
if (typeof document !== 'undefined') {
  document.title = "सेवा अनुरोध फारम | नेपाल ज्योतिष";
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  serviceType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  serviceType?: string;
  message?: string;
}

const services = [
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
  const preSelectedService = searchParams.get("service") || "";

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    serviceType: preSelectedService,
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/service-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        serviceType: "",
        message: "",
      });
    } catch (error) {
      setSubmitError(
        "फारम पेश गर्न सकिएन। कृपया पछि पुन: प्रयास गर्नुहोस्।"
      );
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
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
              धन्यवाद!
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              तपाईंको सेवा अनुरोध सफलतापूर्वक पेश गरिएको छ। हामी चाँडै तपाईंलाई सम्पर्क गर्नेछौं।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
              >
                अर्को अनुरोध पठाउनुहोस्
              </button>
              <a
                href="/services"
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-md border border-gray-200"
              >
                सेवाहरू हेर्नुहोस्
              </a>
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            सेवा अनुरोध फारम
          </h1>
          <p className="text-lg text-gray-600">
            कृपया आफ्नो विवरण र चाहिएको सेवा भर्नुहोस्
          </p>
        </div>

        {/* Form Card */}
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

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    पठाइदै छ...
                  </span>
                ) : (
                  "अनुरोध पठाउनुहोस्"
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              <span className="text-rose-600">*</span> चिन्ह लागेका क्षेत्रहरू अनिवार्य छन्
            </p>
          </form>
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
