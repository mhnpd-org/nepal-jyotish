import React from "react";
import Link from "next/link";

type BlogCardProps = {
  title: string;
  excerpt: string;
  href?: string;
};

export default function BlogCard({ title, excerpt, href }: BlogCardProps) {
  const cardContent = (
    <>
      {/* Decorative gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/0 to-amber-50/0 group-hover:from-rose-50/50 group-hover:to-amber-50/30 transition-all duration-300 rounded-xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Accent line */}
        <div className="w-12 h-1 bg-gradient-to-r from-rose-600 to-orange-500 rounded-full mb-4 group-hover:w-16 transition-all duration-300"></div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rose-700 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        {href && (
          <div className="flex items-center text-sm font-medium text-rose-600 group-hover:text-rose-700">
            <span>थप पढ्नुहोस्</span>
            <svg 
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Corner decoration */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-rose-100/20 to-amber-100/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
    </>
  );

  const baseClasses = "group relative bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-rose-200/50 overflow-hidden block";

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {cardContent}
      </Link>
    );
  }

  return (
    <article className={baseClasses}>
      {cardContent}
    </article>
  );
}
