import Link from "next/link";

interface ContactButtonProps {
  variant?: "primary" | "secondary" | "minimal";
  size?: "sm" | "md" | "lg";
  className?: string;
  context?: string; // To help identify which page the user came from
}

export default function ContactButton({ 
  variant = "secondary", 
  size = "md", 
  className = "",
  context = ""
}: ContactButtonProps) {
  const href = context ? `/contact?from=${encodeURIComponent(context)}` : "/contact";

  // Base styles
  const baseStyles = "inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Size variants
  const sizeStyles = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  // Color variants
  const variantStyles = {
    primary: "bg-gradient-to-r from-rose-600 to-orange-500 text-white hover:from-rose-700 hover:to-orange-600 shadow-md hover:shadow-lg focus:ring-rose-500",
    secondary: "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 shadow-sm hover:shadow-md focus:ring-rose-500",
    minimal: "text-rose-600 hover:text-rose-700 underline underline-offset-2 hover:no-underline focus:ring-rose-500 focus:ring-offset-0"
  };

  // Icon based on variant
  const IconComponent = () => (
    <svg 
      className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <Link
      href={href}
      className={combinedStyles}
      aria-label="समस्या रिपोर्ट गर्नुहोस् वा सहायता माग्नुहोस्"
    >
      <IconComponent />
      <span>
        {size === 'sm' ? 'सम्पर्क' : 'समस्या रिपोर्ट गर्नुहोस्'}
      </span>
    </Link>
  );
}

// Helper component for fixed position button (for pages where users might get stuck)
export function FloatingContactButton({ context = "" }: { context?: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ContactButton 
        variant="primary" 
        size="md" 
        context={context}
        className="shadow-lg hover:scale-105 transform"
      />
    </div>
  );
}