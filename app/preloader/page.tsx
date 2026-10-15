'use client';

/**
 * app/preloader/page.tsx — Dedicated Preloader Page
 *
 * Dedicated showcase and testing page for the Bondor Bati theme preloader:
 *  - Interactive cooking progress simulation
 *  - Authentic Chittagong bati/cloche illustration with animated steam
 *  - Replay button to test the experience at any time
 *  - Direct link back to Home
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const COOKING_STAGES = [
  'Preparing authentic Chittagong spices...',
  'Arranging fresh tiffin boxes...',
  'Slow-cooking traditional recipes...',
  'Welcome to Bondor Bati...',
];

export default function PreloaderPage() {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [key, setKey] = useState(0); // For replay

  useEffect(() => {
    setProgress(0);
    setStageIndex(0);
    setIsCompleted(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          return 100;
        }
        const increment = Math.floor(Math.random() * 12) + 5;
        const next = Math.min(100, prev + increment);

        if (next > 75) setStageIndex(3);
        else if (next > 50) setStageIndex(2);
        else if (next > 25) setStageIndex(1);

        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [key]);

  function handleReplay() {
    setKey((prev) => prev + 1);
  }

  return (
    <main className="h-screen max-h-screen w-full bg-[#fdfbf7] flex flex-col justify-between relative overflow-hidden text-gray-900 selection:bg-red-100 selection:text-red-900">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-100/60 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-100/70 blur-3xl pointer-events-none"
      />

      {/* Top Bar with Home Link & Replay Control */}
      <header className="w-full max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between relative z-10 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <img
            src="/assets/logo.png"
            alt="Bondor Bati Logo"
            className="w-10 h-10 object-contain rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]"
          />
          <div>
            <span className="font-nunito-black text-xl text-gray-950 tracking-tight leading-none block">
              Bondor Bati
            </span>
            <span className="text-[10px] font-nunito-bold text-[#af0202] tracking-wider uppercase">
              Preloader Preview
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-black bg-white text-xs font-nunito-extrabold shadow-[2px_2px_0px_#000] hover:bg-amber-50 hover:shadow-[3px_3px_0px_#000] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
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
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Replay Preloader
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-black bg-[#af0202] text-white text-xs font-nunito-extrabold shadow-[2px_2px_0px_#000] hover:bg-[#8f0202] hover:shadow-[3px_3px_0px_#000] transition-all cursor-pointer"
          >
            Go to Website
          </Link>
        </div>
      </header>

      {/* Main Preloader Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 relative z-10 min-h-0">
        <div className="w-full max-w-sm bg-white border-2 border-black rounded-3xl p-8 shadow-[8px_8px_0px_#000] text-center flex flex-col items-center my-auto transition-all">
          {/* Animated Tiffin / Bati Cloche Motif */}
          <div className="relative w-24 h-24 mb-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
            {/* Steam lines */}
            <div className="absolute -top-4 flex items-end gap-1.5 pointer-events-none">
              <span className="w-1.5 h-4 bg-[#af0202]/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-6 bg-[#af0202]/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-4 bg-[#af0202]/40 rounded-full animate-bounce" />
            </div>

            {/* SVG Food Plate Cloche */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="52"
              height="52"
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

            {/* Brand Accent Badge */}
            <div className="absolute -bottom-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#af0202] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>

          {/* Brand Name */}
          <h2 className="font-nunito-black text-2xl text-gray-950 tracking-tight leading-none mb-1">
            Bondor Bati
          </h2>
          <p className="text-[11px] font-nunito-extrabold text-[#af0202] uppercase tracking-widest mb-5">
            Bondor Bati • Heritage Cuisine
          </p>

          {/* Progress Bar Container */}
          <div className="w-full h-3.5 bg-gray-100 border-2 border-black rounded-full overflow-hidden p-0.5 shadow-inner mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#af0202] via-red-600 to-amber-500 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentage & Status Label */}
          <div className="w-full flex items-center justify-between text-xs font-nunito-bold text-gray-600 px-0.5">
            <span className="text-[11px] font-nunito-bold text-[#af0202] truncate max-w-[200px] text-left">
              {COOKING_STAGES[stageIndex]}
            </span>
            <span className="font-mono text-xs font-black text-gray-900 tabular-nums">
              {progress}%
            </span>
          </div>

          {/* Completion state button */}
          {isCompleted && (
            <div className="mt-5 w-full animate-in fade-in zoom-in-95 duration-200">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-black bg-[#af0202] text-white font-nunito-black text-sm shadow-[3px_3px_0px_#000] hover:bg-[#8f0202] transition-all"
              >
                Enter Bondor Bati
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-[1400px] mx-auto px-6 py-3 text-center text-xs font-nunito-bold text-gray-400 relative z-10 shrink-0">
        Authentic Chittagong Recipes Prepared Daily • Bondor Bati
      </footer>
    </main>
  );
}
