"use client";

import React from "react";

export default function CentralLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-rose-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
