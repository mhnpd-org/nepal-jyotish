import Link from "next/link";
import Logo from "@internal/layouts/logo";

interface FooterProps {
  variant?: "light" | "dark";
}

export default function Footer({ variant = "light" }: FooterProps) {
  const isDark = variant === "dark";
  
  return (
    <footer className={`${
      isDark 
        ? "bg-gradient-to-b from-transparent to-amber-900/20 border-t border-white/10" 
        : "bg-gradient-to-b from-transparent to-rose-100/30 border-t border-gray-200"
    } mt-20`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <Logo size="sm" variant={isDark ? "light" : "dark"} href="/" className="mb-3" />
            <p className={`text-sm ${isDark ? "text-white/90" : "text-gray-600"} max-w-sm`}>
              परम्परागत नेपाली ज्योतिष प्रणाली र आधुनिक प्रविधिको संगम। सरल, सटीक र विश्वसनीय।
            </p>
          </div>

          <div className="text-left md:text-right">
            <h5 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-3`}>
              लिङ्कहरू
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/" 
                  className={`${
                    isDark 
                      ? "text-white/85 hover:text-amber-200" 
                      : "text-gray-600 hover:text-rose-600"
                  } transition-colors`}
                >
                  मुख्य पृष्ठ
                </Link>
              </li>
              <li>
                <Link 
                  href="/astro/janma" 
                  className={`${
                    isDark 
                      ? "text-white/85 hover:text-amber-200" 
                      : "text-gray-600 hover:text-rose-600"
                  } transition-colors`}
                >
                  एप खोल्नुहोस्
                </Link>
              </li>
              <li>
                <Link 
                  href="/astro/overview" 
                  className={`${
                    isDark 
                      ? "text-white/85 hover:text-amber-200" 
                      : "text-gray-600 hover:text-rose-600"
                  } transition-colors`}
                >
                  अवलोकन
                </Link>
              </li>
              <li>
                <Link 
                  href="/blogs" 
                  className={`${
                    isDark 
                      ? "text-white/85 hover:text-amber-200" 
                      : "text-gray-600 hover:text-rose-600"
                  } transition-colors`}
                >
                  ब्लग
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={`pt-8 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}>
          <p className={`text-sm ${isDark ? "text-white/75" : "text-gray-500"} text-center`}>
            © {new Date().getFullYear()} Nepal Jyotish। सर्वाधिकार सुरक्षित।
          </p>
        </div>
      </div>
    </footer>
  );
}
