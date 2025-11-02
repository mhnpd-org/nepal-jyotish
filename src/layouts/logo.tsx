import React from "react";
import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  className?: string;
  variant?: "light" | "dark"; // light for dark backgrounds, dark for light backgrounds
};

const sizeConfig = {
  sm: {
    text: "text-base",
    accent: "text-sm",
    icon: "w-8 h-8",
    gap: "gap-2",
  },
  md: {
    text: "text-xl",
    accent: "text-lg",
    icon: "w-10 h-10",
    gap: "gap-2.5",
  },
  lg: {
    text: "text-2xl",
    accent: "text-xl",
    icon: "w-12 h-12",
    gap: "gap-3",
  },
  xl: {
    text: "text-4xl",
    accent: "text-3xl",
    icon: "w-16 h-16",
    gap: "gap-4",
  },
};

export default function Logo({ size = "md", href = "/", className = "", variant = "dark" }: LogoProps) {
  const config = sizeConfig[size];

  const logoContent = (
    <div className={`flex items-center ${config.gap} ${className}`}>
      {/* Clean Om Icon - No background box */}
      <div className="relative flex-shrink-0">
        <div className={`${config.icon} flex items-center justify-center`}>
          {/* Om symbol with gradient */}
          <span className={`${
            variant === "light" 
              ? "text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-white to-rose-200" 
              : "text-transparent bg-clip-text bg-gradient-to-br from-rose-600 via-orange-500 to-amber-600"
          } font-bold leading-none`} style={{ 
            fontSize: size === "sm" ? "1.5rem" : size === "md" ? "2rem" : size === "lg" ? "2.5rem" : "3rem",
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            filter: variant === "light" ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}>
            ॐ
          </span>
        </div>
      </div>

      {/* Text Content - Perfectly Aligned */}
      <div className="flex flex-col justify-between leading-none" style={{
        height: size === "sm" ? "2rem" : size === "md" ? "2.5rem" : size === "lg" ? "3rem" : "4rem"
      }}>
        <span className={`${config.text} font-bold tracking-tight leading-none ${
          variant === "light"
            ? "text-white drop-shadow-md"
            : "text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-rose-600 to-orange-600"
        }`}>
          नेपाल ज्योतिष
        </span>
        <span className={`${config.accent} font-light leading-none ${
          variant === "light" ? "text-amber-200/90" : "text-gray-600"
        }`} style={{ fontSize: size === "sm" ? "0.65rem" : size === "md" ? "0.75rem" : size === "lg" ? "0.875rem" : "1rem" }}>
          परम्परागत विज्ञान
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block group transition-transform hover:scale-105">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
