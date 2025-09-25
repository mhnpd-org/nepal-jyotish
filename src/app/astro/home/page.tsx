import React from 'react';

export default function AstroHome() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold text-amber-800 mb-2">Welcome to Vedanga Jyotish</h2>
        <p className="text-sm text-slate-600">This is the dashboard. Use the sidebar to navigate.</p>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-amber-50 rounded-lg">
            <h3 className="font-medium text-amber-800">Janma Details</h3>
            <p className="text-sm text-slate-600">Enter birth details to generate charts and reports.</p>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg">
            <h3 className="font-medium text-amber-800">Traditional</h3>
            <p className="text-sm text-slate-600">Generate traditional readings and insights.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
