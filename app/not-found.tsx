import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Bondor Bati',
  description: 'The culinary page you are looking for does not exist or has been moved.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="h-screen max-h-screen w-full bg-[#fdfbf7] flex flex-col justify-between relative overflow-y-auto lg:overflow-hidden text-gray-900 selection:bg-red-100 selection:text-red-900">
      {/* Background Decorative Ambient Circles */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-red-100/60 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-amber-100/70 blur-3xl pointer-events-none"
      />

      {/* Top Simple Brand Bar */}
      <header className="w-full max-w-[1400px] mx-auto px-5 py-3 sm:py-4 flex items-center justify-between relative z-10 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
          aria-label="Bondor Bati Home"
        >
          <img
            src="/assets/logo.png"
            alt="Bondor Bati Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]"
          />
          <div>
            <span className="font-nunito-black text-lg sm:text-xl text-gray-950 tracking-tight leading-none block">
              Bondor Bati
            </span>
            <span className="text-[10px] font-nunito-bold text-[#af0202] tracking-wider uppercase">
              Bondor Bati Cuisine
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 border-black bg-white text-xs font-nunito-extrabold shadow-[2px_2px_0px_#000] hover:bg-amber-50 hover:shadow-[3px_3px_0px_#000] transition-all cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Back to Website
        </Link>
      </header>

      {/* Main 404 Hero Container (Constrained for 100vh viewport) */}
      <div className="flex-1 flex items-center justify-center px-4 py-2 sm:py-4 relative z-10 min-h-0">
        <div className="w-full max-w-2xl bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] text-center relative overflow-hidden my-auto">
          {/* Top Status Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black bg-amber-300 font-nunito-black text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_#000] mb-3 sm:mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Recipe Not Found • 404
          </div>

          {/* Floating Animated Serving Dish / Cloche Illustration */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-black flex items-center justify-center relative shadow-[3px_3px_0px_#000]">
            {/* Steam lines */}
            <div className="absolute -top-3 flex gap-1.5">
              <span className="w-1 h-3 bg-[#af0202]/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-4 bg-[#af0202]/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-3 bg-[#af0202]/40 rounded-full animate-bounce" />
            </div>
            {/* Cloche SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#af0202"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-float"
            >
              <path d="M12 4v2" />
              <path d="M4 18h16" />
              <path d="M20 18a8 8 0 0 0-16 0" />
              <path d="M3 20h18" />
              <circle cx="12" cy="4" r="1" fill="#af0202" />
            </svg>
          </div>

          {/* Big 404 Headline */}
          <h1 className="font-nunito-black text-[56px] sm:text-[76px] md:text-[90px] leading-none text-[#af0202] tracking-tighter drop-shadow-[3px_3px_0px_#000] select-none my-0.5">
            404
          </h1>

          {/* Editorial Title */}
          <h2 className="font-nunito-black text-xl sm:text-2xl md:text-3xl text-gray-900 mb-2 tracking-tight">
            This Tiffin is Empty! (Page Not Found)
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-xs sm:text-sm font-nunito max-w-md mx-auto mb-5 leading-relaxed">
            Oops! The recipe, tiffin meal, or link you are craving seems to have been devoured, taken off the stove, or moved to another table.
          </p>

          {/* Action Button Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto mb-4">
            <Link
              href="/"
              id="btn-return-home"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-full border-2 border-black bg-[#af0202] text-white font-nunito-black text-sm sm:text-base shadow-[3px_3px_0px_#000] hover:bg-[#8f0202] hover:shadow-[5px_5px_0px_#000] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Return Home
            </Link>

            <Link
              href="/#menu"
              id="btn-explore-menu"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-full border-2 border-black bg-white text-gray-900 font-nunito-black text-sm sm:text-base shadow-[3px_3px_0px_#000] hover:bg-amber-50 hover:shadow-[5px_5px_0px_#000] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
                <line x1="15" y1="2" x2="15" y2="22" />
                <line x1="9" y1="2" x2="9" y2="7" />
                <path d="M9 7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2" />
                <path d="M6 2v20" />
              </svg>
              Today&apos;s Menu
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs text-gray-500 font-nunito-bold">
            <Link href="/#catering" className="hover:text-[#af0202] hover:underline transition-colors flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m4 15 11-11 5 5-11 11-5-5Z" />
                <path d="m2 22 5-5" />
              </svg>
              Event Catering Packages
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/#how-it-works" className="hover:text-[#af0202] hover:underline transition-colors flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Order Cut-off & Delivery
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/#reviews" className="hover:text-[#af0202] hover:underline transition-colors flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Customer Reviews
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info (Compact) */}
      <footer className="w-full max-w-[1400px] mx-auto px-5 py-2 sm:py-3 text-center text-[11px] text-gray-500 font-nunito relative z-10 shrink-0">
        <p className="flex items-center justify-center gap-2">
          <span>Need help placing an order? Call Hotline:</span>
          <a
            href="tel:01712345678"
            className="font-nunito-extrabold text-[#af0202] hover:underline inline-flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            01712-345678
          </a>
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          © {new Date().getFullYear()} Bondor Bati • Authentic Chittagong Heritage Cuisine. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
