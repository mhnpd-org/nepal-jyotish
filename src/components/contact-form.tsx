"use client";

import { useState } from "react";

interface ContactFormData {
  name: string;
  email: string;
  description: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  description?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "कृपया समस्याको विवरण लेख्नुहोस्";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "समस्याको विवरण कम्तिमा १० अक्षरको हुनुपर्छ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get Cloudflare Worker URL from environment variable
      // This should be set in your build environment (Cloudflare Pages)
      const workerUrl = process.env.NEXT_PUBLIC_CONTACT_FORM_WORKER_URL;
      
      if (!workerUrl) {
        throw new Error("Contact form is not configured. Please try again later.");
      }

      // Prepare data for submission to Cloudflare Worker
      const submissionData = {
        timestamp: new Date().toISOString(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        description: formData.description.trim(),
        source: "Nepal Jyotish Contact Form",
        userAgent: navigator.userAgent || "Unknown",
        ip: "Unknown", // Will be filled by Cloudflare Worker from request headers
      };

      const response = await fetch(workerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "समस्या पठाउन सकिएन");
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", description: "" });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : "समस्या पठाउन सकिएन। कृपया फेरि प्रयास गर्नुहोस्।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          धन्यवाद!
        </h3>
        <p className="text-gray-600 mb-6">
          तपाईंको सन्देश सफलतापूर्वक पठाइयो। हामी छिट्टै तपाईंलाई जवाफ दिनेछौं।
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="px-4 py-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
        >
          अर्को सन्देश पठाउनुहोस्
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          तपाईंको नाम <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="आफ्नो नाम लेख्नुहोस्"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          इमेल ठेगाना <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="example@gmail.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          समस्याको विवरण <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors resize-vertical ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="कृपया तपाईंले सामना गर्नुभएको समस्याको विस्तृत विवरण लेख्नुहोस्। जन्म मिति, समय, स्थान र कुन पृष्ठमा समस्या आएको छ सो पनि उल्लेख गर्नुहोस्।"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          कम्तिमा १० अक्षर आवश्यक छ
        </p>
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          <span className="text-red-500">*</span> भएका क्षेत्रहरू अनिवार्य छन्
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-500 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-600 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              पठाउँदै...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              सन्देश पठाउनुहोस्
            </>
          )}
        </button>
      </div>
    </form>
  );
}