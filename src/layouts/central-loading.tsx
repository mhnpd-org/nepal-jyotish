"use client";

import React from "react";

export default function CentralLoading({ message = "Loading...", fullScreen = true }: { message?: string; fullScreen?: boolean }) {
  const containerClass = fullScreen
    ? "min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex items-center justify-center"
    : "flex items-center justify-center py-6";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-rose-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
