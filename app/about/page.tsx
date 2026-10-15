'use client';

/**
 * app/about/page.tsx — Bondor Bati "Our Story"
 *
 * Same-to-same design PATTERN (brand tokens, brutalist borders, Nunito Black typography,
 * warm cream background, marquee + nav-pill navbar, responsive mobile menu, and footer)
 * with a FRESH, EXCITING, EDITORIAL STORYTELLING STYLE.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MarqueeNotice } from '@/types';
import { NoticeIcon, DotSeparator } from '@/components/SvgIcons';

const DEFAULT_MARQUEE_NOTICES: MarqueeNotice[] = [
  { id: 1, text: 'Order Cut-off Time: 10:00 PM for Next Day Lunch', icon: 'clock', display_order: 1, is_active: true },
  { id: 2, text: 'Serving specific delivery zones in Dhaka', icon: 'truck', display_order: 2, is_active: true },
  { id: 3, text: 'Authentic Chittagong Heritage Cuisine', icon: 'food', display_order: 3, is_active: true },
];

const SIGNATURE_SPICES = [
  {
    name: 'Radhuni Spices',
    role: 'The Soul of Mezban',
    desc: 'The rare wild celery seed that gives Chittagong Mezbani beef its signature aromatic fragrance that impossible to replicate with ordinary garam masala.',
    badge: 'Signature',
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    icon: '🌿',
  },
  {
    name: 'Cold-Pressed Mustard Oil',
    role: 'Ghani-Extracted Gold',
    desc: 'We use exclusively 100% wooden-mill mustard oil. No industrial palm blends. It imparts the unmistakable pungent heat and golden sheen to every gravy.',
    badge: '100% Pure',
    bg: 'bg-red-50',
    border: 'border-red-400',
    icon: '🛢️',
  },
  {
    name: 'Sun-Dried Whole Chilies',
    role: 'Slow-Roasted Smoke',
    desc: 'Handpicked dried red chilies, roasted slowly over embers before stone-grinding. Creates deep crimson color and rich warmth without stinging acidity.',
    badge: 'Stone-Ground',
    bg: 'bg-orange-50',
    border: 'border-orange-400',
    icon: '🌶️',
  },
  {
    name: 'Caramelized Beresta',
    role: 'Natural Richness',
    desc: 'Crisp fried local shallots simmered slowly into the braising gravy to form a thick, silky, naturally sweet base without any cornstarch or fillers.',
    badge: 'Heirloom Method',
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    icon: '🧅',
  },
];

const KITCHEN_TIMELINE = [
  {
    time: '04:30 AM',
    title: 'The Morning Grind',
    kicker: 'Stone Sheel-Pata',
    desc: 'Before dawn, whole spices are washed, roasted, and crushed on traditional stone mortars to release essential fragrant oils.',
    icon: '🥣',
  },
  {
    time: '06:00 AM',
    title: 'Brass Degchi Slow Simmer',
    kicker: 'Low-Flame Braising',
    desc: 'Fresh cuts of beef and poultry are layered with mustard oil in heavy brass cauldrons, braising on low heat for over 4 to 5 hours.',
    icon: '🔥',
  },
  {
    time: '09:30 AM',
    title: 'Hygiene & Quality Inspection',
    kicker: 'Clinical Standards',
    desc: 'Temperature readings, sensory taste checks, and portion audits are conducted by senior chefs in sanitized kitchen attire.',
    icon: '✨',
  },
  {
    time: '11:00 AM',
    title: 'Insulated Tiffin Dispatch',
    kicker: 'Hot to Doorstep',
    desc: 'Sealed into leak-proof, food-grade thermal tiffins and dispatched via express temperature-controlled transit to arrive steaming hot.',
    icon: '🚀',
  },
];

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [marqueeNotices, setMarqueeNotices] = useState<MarqueeNotice[]>(DEFAULT_MARQUEE_NOTICES);

  // Scroll detection for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch live marquee notices
  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch(`/api/notices?_t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMarqueeNotices(data.data);
        }
      } catch {
        // Keep default notices
      }
    }
    fetchNotices();
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const observeElements = () => {
      const targets = document.querySelectorAll(
        '.scroll-reveal:not(.is-revealed), .reveal-left:not(.is-revealed), .reveal-right:not(.is-revealed), .reveal-scale:not(.is-revealed)'
      );
      targets.forEach((el) => observer.observe(el));
    };

    observeElements();
    const timer = setTimeout(observeElements, 200);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const activeMarqueeList = marqueeNotices.filter((n) => n.is_active);
  const hasMarquee = activeMarqueeList.length > 0;

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-gray-800 antialiased font-plus-jakarta selection:bg-[#af0202] selection:text-white">
      {/* ── Top Notice Marquee (Site Brand Pattern) ─────────────────────────── */}
      {hasMarquee && (
        <div className="fixed top-0 left-0 w-full bg-[#af0202] text-white text-[13px] font-nunito-bold py-1.5 z-[110] flex overflow-hidden shadow-md border-b border-white/10 h-7 select-none">
          <div className="flex whitespace-nowrap animate-marquee w-max" id="topMarquee">
            <div className="flex items-center px-4">
              {activeMarqueeList.map((notice, idx) => (
                <span key={`notice-1-${notice.id || idx}`} className="inline-flex items-center mx-4">
                  <NoticeIcon name={notice.icon} className="w-3.5 h-3.5 mr-1.5 inline-block shrink-0 text-amber-200" />
                  <span>{notice.text}</span>
                  <DotSeparator />
                </span>
              ))}
            </div>
            <div className="flex items-center px-4" aria-hidden="true">
              {activeMarqueeList.map((notice, idx) => (
                <span key={`notice-2-${notice.id || idx}`} className="inline-flex items-center mx-4">
                  <NoticeIcon name={notice.icon} className="w-3.5 h-3.5 mr-1.5 inline-block shrink-0 text-amber-200" />
                  <span>{notice.text}</span>
                  <DotSeparator />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Global Fixed Navbar (Site Brand Pattern) ────────────────────────── */}
      <nav
        id="mainNavbar"
        className={`fixed ${
          hasMarquee ? 'has-marquee top-7' : 'no-marquee top-0'
        } left-0 right-0 z-[100] w-full ${isScrolled ? 'scrolled' : ''}`}
      >
        <div
          id="navbarInner"
          className="flex justify-between items-center py-3 px-4 sm:py-5 sm:px-6 md:py-8 lg:py-10 md:px-[30px] lg:px-[150px] max-w-[1600px] mx-auto w-full"
        >
          {/* Brand Logo */}
          <div className="relative z-[60]">
            <Link href="/">
              <img
                id="navLogo"
                src="/assets/logo.png"
                alt="Bondor Bati"
                className="h-10 sm:h-12 md:h-16 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Nav Pill */}
          <div className="hidden lg:flex nav-pill items-center gap-3 px-5 py-2.5">
            <Link href="/" className="nav-item" id="nav-home">
              Home
            </Link>
            <Link href="/#menu" className="nav-item" id="nav-menu">
              Menu
            </Link>
            <Link href="/about" className="nav-item nav-item-active" id="nav-about">
              Our Story
            </Link>
            <Link href="/#contact" className="nav-item" id="nav-contact">
              Contact Us
            </Link>
            <Link
              href="/#menu"
              aria-label="Order menu"
              className="relative ml-3 cursor-pointer group flex items-center justify-center w-9 h-9 bg-[#1a1a1d] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5),_0px_1px_1px_rgba(255,255,255,0.05)] hover:bg-[#25252a] hover:scale-105 active:scale-95 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#b5b5b5] group-hover:text-white transition-colors"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 lg:hidden relative z-[60]">
            <Link
              href="/#menu"
              aria-label="View menu"
              className="relative p-2.5 flex items-center justify-center w-11 h-11 bg-white rounded-full border border-gray-200 shadow-sm text-gray-700 hover:text-[#af0202] hover:bg-gray-50 active:scale-95 transition-all focus:outline-none cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </Link>

            <button
              id="mobileMenuBtn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 flex items-center justify-center w-11 h-11 bg-white rounded-full border border-gray-200 shadow-sm text-gray-700 hover:text-[#af0202] hover:bg-gray-50 active:scale-95 transition-all duration-300 focus:outline-none cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              <svg
                id="menuIcon"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ──────────────────────────────────────────────── */}
      <div
        id="mobileMenu"
        className={`fixed inset-0 bg-white/95 backdrop-blur-xl z-[90] flex flex-col items-center justify-center gap-5 transition-all duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto visible translate-y-0'
            : 'opacity-0 pointer-events-none invisible -translate-y-4'
        }`}
      >
        <img src="/assets/logo.png" alt="Bondor Bati" className="h-14 w-auto object-contain mb-4" />
        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">
          Home
        </Link>
        <Link href="/#menu" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">
          Menu
        </Link>
        <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item text-[#af0202] font-nunito-black">
          Our Story
        </Link>
        <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">
          Contact Us
        </Link>

        <Link
          href="/#menu"
          onClick={() => setMobileMenuOpen(false)}
          className="btn-primary mt-2 px-8 py-3 text-base shadow-[4px_4px_0px_#000]"
        >
          Order Now
        </Link>
      </div>

      {/* ── Main Content Container ───────────────────────────────────────────── */}
      <div
        className={`min-h-screen w-full flex flex-col relative px-3 sm:px-6 md:px-10 lg:px-[100px] pb-8 max-w-[1600px] mx-auto ${
          hasMarquee ? 'mt-6 sm:mt-4' : 'mt-0 sm:mt-0'
        }`}
      >
        {/* ── Section 1: Fresh Editorial Story Hero (Different Layout, Same Pattern) ── */}
        <section
          className={`relative z-10 w-full mb-16 sm:mb-20 ${
            hasMarquee
              ? 'pt-28 sm:pt-36 md:pt-44 lg:pt-52'
              : 'pt-24 sm:pt-32 md:pt-40 lg:pt-48'
          }`}
        >
          {/* Subtle Ambient Background Watermark */}
          <div className="absolute top-24 sm:top-32 lg:top-36 right-0 -z-10 pointer-events-none select-none opacity-[0.03] text-gray-950 font-nunito-black text-[120px] sm:text-[180px] lg:text-[240px] leading-none whitespace-nowrap overflow-hidden">
            Bondor Bati
          </div>

          {/* Top Brand Badges */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6 reveal-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-black bg-[#af0202] text-white font-nunito-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000]">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
              The Heritage Chronicles
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 font-nunito-bold text-xs shadow-sm">
              <span>📍</span> Chattogram, Bangladesh
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 font-nunito-bold text-xs shadow-sm">
              <span>🏺</span> Brass Cauldron Cooking
            </span>
          </div>

          {/* Editorial Split Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Headline & Manifesto */}
            <div className="lg:col-span-7 flex flex-col items-start reveal-left">
              <h1 className="font-nunito-black text-3xl sm:text-5xl lg:text-6xl xl:text-[68px] leading-[1.08] text-gray-900 mb-6 tracking-tight">
                Crafted by Fire.{' '}
                <span className="text-[#af0202] block sm:inline">
                  Spiced by Tradition.
                </span>{' '}
                Served with Soul.
              </h1>

              <div className="p-4 sm:p-6 bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0px_#000] mb-6 relative">
                <span className="absolute -top-3 left-6 bg-amber-300 text-black border border-black px-3 py-0.5 rounded-full text-[11px] font-nunito-black uppercase tracking-wider">
                  The Bondor Bati Manifesto
                </span>
                <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
                  “We built Bondor Bati because the world doesn’t need another rushed, oily restaurant delivery. We need the deep, soul-satisfying taste of traditional home cooking — where spices are hand-crushed on stone, mustard oil is unadulterated, and meat is simmered patiently for hours in authentic brass degchis.”
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full">
                <Link
                  href="/#menu"
                  className="btn-hero-primary !w-auto !max-w-none flex-initial px-6 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all whitespace-nowrap"
                >
                  Explore Weekly Tiffins
                </Link>
                <Link
                  href="/#catering"
                  className="btn-hero-secondary !w-auto !max-w-none flex-initial px-6 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all whitespace-nowrap"
                >
                  Event Catering
                </Link>
              </div>
            </div>

            {/* Right Editorial Tilted Picture Frame */}
            <div className="lg:col-span-5 flex justify-center items-center reveal-right mt-4 lg:mt-0">
              <div className="relative w-full max-w-[420px]">
                {/* Background Shadow Box */}
                <div className="absolute inset-0 bg-[#af0202] rounded-3xl rotate-3 border-2 border-black translate-x-2 translate-y-2 -z-10" />

                {/* Main Framed Card */}
                <div className="bg-white border-2 border-black rounded-3xl p-3 sm:p-4 shadow-[8px_8px_0px_#000] -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="overflow-hidden rounded-2xl relative aspect-[4/3] border border-black/10">
                    <img
                      src="/assets/our-story.jpg"
                      alt="Bondor Bati Authentic Culinary Tradition"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md rounded-xl p-2.5 text-white flex items-center justify-between">
                      <div>
                        <p className="font-nunito-black text-xs leading-none">Traditional Degchi Cooking</p>
                        <p className="text-[10px] text-amber-300 font-nunito-bold mt-0.5">Central Kitchen, Chattogram</p>
                      </div>
                      <span className="text-xl">🔥</span>
                    </div>
                  </div>

                  {/* Stamp / Seal Badge */}
                  <div className="mt-3.5 pt-3 border-t border-dashed border-gray-300 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 border border-black flex items-center justify-center text-xs font-nunito-black text-[#af0202]">
                        BB
                      </div>
                      <div>
                        <p className="font-nunito-black text-xs text-gray-900 leading-tight">100% Authentic</p>
                        <p className="text-[10px] text-gray-500 font-nunito-bold">Heritage Certified</p>
                      </div>
                    </div>
                    <span className="font-nunito-black text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                      Est. 2022
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Editorial Bento Grid (Roots, Heritage, & Craft) ────────── */}
        <section className="w-full mb-20 scroll-reveal">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="commerce-kicker text-[#af0202]">The Heritage Chronicles</p>
            <h2 className="font-nunito-black text-3xl sm:text-4xl md:text-5xl text-gray-900 my-2">
              Why Chittagong Cuisine is Different.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              A confluence of maritime spice routes, deep brass cauldrons, and royal hospitality that cannot be faked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento Card 1: Port City Legacy (Col 7) */}
            <div className="md:col-span-7 minimal-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white via-white to-amber-50/40">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-red-100 text-[#af0202] border border-red-300 font-nunito-black text-xs px-3 py-1 rounded-full">
                    Ancient Port of Bengal
                  </span>
                  <span className="text-3xl">⚓</span>
                </div>
                <h3 className="font-nunito-black text-2xl sm:text-3xl text-gray-900 mb-3">
                  The Historic Port of Spices
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                  For over a thousand years, Chittagong’s seaport was Bengal’s gateway to the world. Arab, Persian, and Portuguese merchants traded precious black peppers, star anise, cardamom, and clove right at the port mouth.
                </p>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Chittagong cooks absorbed these exotic foreign aromatics and fused them with native mustard oil and stone-ground chilies — giving birth to Bengal’s most fragrant, robust, and regal cuisine.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs font-nunito-bold text-gray-500">
                <span>✓ Arabian Spices</span>
                <span>•</span>
                <span>✓ Bengal Mustard</span>
                <span>•</span>
                <span>✓ Mughal Slow Braise</span>
              </div>
            </div>

            {/* Bento Card 2: The Brass Cauldron (Col 5) */}
            <div className="md:col-span-5 minimal-card p-6 sm:p-8 flex flex-col justify-between relative bg-white">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-nunito-black text-xs px-3 py-1 rounded-full">
                    The Sacred Vessel
                  </span>
                  <span className="text-3xl">🍲</span>
                </div>
                <h3 className="font-nunito-black text-2xl sm:text-3xl text-gray-900 mb-3">
                  The Heavy Brass Degchi
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                  You cannot make true Kala Bhuna or Mezbani Beef in thin stainless steel. The secret lives in our massive, heavy-bottomed brass cauldrons.
                </p>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Brass distributes thermal heat gently and evenly, allowing the natural beef juices to caramelize slowly without burning the delicate spices.
                </p>
              </div>

              <div className="mt-6 bg-gray-50 rounded-2xl p-3 border border-gray-200 text-xs text-gray-700 font-nunito-bold flex items-center gap-2">
                <span className="text-base text-[#af0202]">⚡</span>
                Slow-braised for 5+ hours on gentle embers
              </div>
            </div>

            {/* Bento Card 3: The Hospitality of Mezban (Col 5) */}
            <div className="md:col-span-5 minimal-card p-6 sm:p-8 flex flex-col justify-between relative bg-white">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-red-100 text-[#af0202] border border-red-300 font-nunito-black text-xs px-3 py-1 rounded-full">
                    Mezban Spirit
                  </span>
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="font-nunito-black text-2xl sm:text-3xl text-gray-900 mb-3">
                  Open Doors, Full Bowls
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                  In Chittagong, a Mezban host never asks who you are or whether you were invited. If you walk past the courtyard, you are seated and served.
                </p>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  At Bondor Bati, we maintain that same royal generosity. Our tiffin portions are hearty, meat cuts are tender and ample, and every box is filled with care.
                </p>
              </div>

              <div className="mt-6 bg-red-50 rounded-2xl p-3 border border-red-200 text-xs text-[#af0202] font-nunito-bold flex items-center gap-2">
                <span>❤️</span> Generous meal portions in every delivery
              </div>
            </div>

            {/* Bento Card 4: Daily Tiffin Comfort (Col 7) */}
            <div className="md:col-span-7 minimal-card p-6 sm:p-8 flex flex-col justify-between relative bg-gradient-to-br from-white to-red-50/30">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-green-100 text-green-800 border border-green-300 font-nunito-black text-xs px-3 py-1 rounded-full">
                    Daily Life Balance
                  </span>
                  <span className="text-3xl">🍱</span>
                </div>
                <h3 className="font-nunito-black text-2xl sm:text-3xl text-gray-900 mb-3">
                  Wholesome Food for Working Days
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                  Why should office lunches feel like a daily sacrifice? Commercial takeout leaves you lethargic and bloated with excessive palm oil and sodium.
                </p>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Bondor Bati balances indulgent heritage taste with digestive wellness: pure mustard oil, fresh river Rui fish, seasonal greens, and light fragrant polao that nourishes your body throughout the afternoon.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-nunito-bold text-gray-500">Weekly rotating lunch schedule</span>
                <Link
                  href="/#menu"
                  className="inline-flex items-center gap-1.5 text-xs font-nunito-black text-[#af0202] hover:underline"
                >
                  View Weekly Schedule →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Signature Spice Anatomy (Interactive & Fresh Showcase) ─ */}
        <section className="w-full mb-20 scroll-reveal">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="commerce-kicker text-[#af0202]">The Spice Anatomy</p>
            <h2 className="font-nunito-black text-3xl sm:text-4xl md:text-5xl text-gray-900 my-2">
              Four Elements Behind the Taste.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              We never use pre-packaged boxed seasonings. Each ingredient is sourced directly from heritage spice farmers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SIGNATURE_SPICES.map((spice, idx) => (
              <div
                key={spice.name}
                className="clay-card p-6 flex flex-col justify-between relative w-full border border-black/10 hover:-translate-y-2 hover:shadow-[10px_10px_0px_#000] transition-all duration-300"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 rounded-2xl bg-white border-2 border-black flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                      {spice.icon}
                    </span>
                    <span className="font-nunito-black text-[11px] uppercase tracking-wider bg-black text-white px-3 py-1 rounded-full">
                      {spice.badge}
                    </span>
                  </div>

                  <h3 className="font-nunito-black text-xl text-gray-900 mb-1">{spice.name}</h3>
                  <p className="text-xs font-nunito-bold text-[#af0202] mb-3">{spice.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{spice.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-nunito-bold text-gray-400">
                  <span>Authentic Chittagong Formula</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: A Day in Our Kitchen (Visual Stepper) ─────────────────── */}
        <section className="w-full max-w-5xl mx-auto mb-20 scroll-reveal">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="commerce-kicker text-[#af0202]">The Craft in Motion</p>
            <h2 className="font-nunito-black text-3xl sm:text-4xl md:text-5xl text-gray-900 my-2">
              From Dawn to Your Desk.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              How your lunch travels from our central brass cauldrons to your workplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {KITCHEN_TIMELINE.map((step, idx) => (
              <div
                key={step.time}
                className="minimal-card p-6 flex flex-col justify-between relative bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-nunito-black text-xs text-white bg-[#af0202] px-2.5 py-1 rounded-lg border border-black shadow-[2px_2px_0px_#000]">
                      {step.time}
                    </span>
                    <span className="text-2xl">{step.icon}</span>
                  </div>

                  <p className="text-xs font-nunito-bold text-gray-400 uppercase tracking-wider mb-1">
                    {step.kicker}
                  </p>
                  <h3 className="font-nunito-black text-lg text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-nunito-bold text-gray-400">
                  Step 0{idx + 1} of 04
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 5: The Numbers of Trust (Brutalist Stat Strip) ───────────── */}
        <section className="w-full mb-20 scroll-reveal">
          <div className="bg-[#1d1d20] text-white border-2 border-black rounded-3xl p-8 sm:p-12 shadow-[8px_8px_0px_#000] grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative overflow-hidden">
            <div
              className="absolute -right-20 -bottom-20 w-64 h-64 bg-red-900/20 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <p className="font-nunito-black text-3xl sm:text-5xl text-[#ff5757] mb-1">10,000+</p>
              <p className="font-nunito-bold text-sm sm:text-base text-gray-200">Tiffins Delivered</p>
              <p className="text-xs text-gray-400 mt-1">Hot &amp; right on time</p>
            </div>

            <div className="relative z-10">
              <p className="font-nunito-black text-3xl sm:text-5xl text-amber-300 mb-1">100%</p>
              <p className="font-nunito-bold text-sm sm:text-base text-gray-200">Pure Mustard Oil</p>
              <p className="text-xs text-gray-400 mt-1">Zero palm oil compromises</p>
            </div>

            <div className="relative z-10">
              <p className="font-nunito-black text-3xl sm:text-5xl text-white mb-1">5+ Hours</p>
              <p className="font-nunito-bold text-sm sm:text-base text-gray-200">Cauldron Simmer</p>
              <p className="text-xs text-gray-400 mt-1">For our signature Kala Bhuna</p>
            </div>

            <div className="relative z-10">
              <p className="font-nunito-black text-3xl sm:text-5xl text-[#ff5757] mb-1">4.9 ★</p>
              <p className="font-nunito-bold text-sm sm:text-base text-gray-200">Customer Rating</p>
              <p className="text-xs text-gray-400 mt-1">1,200+ verified food reviews</p>
            </div>
          </div>
        </section>

        {/* ── Section 6: Handwritten Founder Letter & Promise ─────────────────── */}
        <section className="w-full max-w-4xl mx-auto mb-20 scroll-reveal">
          <div className="minimal-card p-8 sm:p-12 relative overflow-hidden bg-white border-2 border-black shadow-[8px_8px_0px_#000]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-black flex items-center justify-center text-xl">
                ✍️
              </div>
              <div>
                <p className="font-nunito-black text-base text-gray-900 leading-tight">Our Kitchen Promise</p>
                <p className="text-xs text-[#af0202] font-nunito-bold">Written with Pride in Chattogram</p>
              </div>
            </div>

            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 font-medium italic">
              “When you order from Bondor Bati, you are not just buying a lunch box. You are sustaining our city’s culinary heritage. You are tasting the radhuni seeds ground by hand at 5:00 AM, the cold-pressed mustard oil unadulterated by chemicals, and the rich tradition of Mezban hosts who believed that good food brings people closer together.”
            </p>

            <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-nunito-black text-sm text-gray-900">Monabbor Hossen &amp; The Kitchen Masters</p>
                <p className="text-xs text-gray-500 font-nunito-bold">Bondor Bati Catering Service</p>
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-100 border border-black/10 px-4 py-1.5 rounded-full text-xs font-nunito-bold text-gray-700">
                <span className="text-[#af0202]">●</span> 100% Halal &amp; Certified Fresh
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 7: Action Call-to-Action ────────────────────────────────── */}
        <section className="w-full max-w-4xl mx-auto mb-16 text-center px-4 scroll-reveal">
          <span className="inline-block bg-amber-300 text-black border border-black font-nunito-black text-xs uppercase px-3 py-1 rounded-full mb-3 shadow-[2px_2px_0px_#000]">
            Taste The Soul of Chittagong
          </span>
          <h2 className="font-nunito-black text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
            Ready for Tomorrow’s Lunch?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-lg mx-auto">
            Place your order before 10:00 PM tonight for prompt delivery directly to your desk or home tomorrow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#menu"
              className="btn-hero-primary px-8 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all"
            >
              Order Weekly Tiffin
            </Link>
            <Link
              href="/#menu"
              className="btn-hero-secondary px-8 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all"
            >
              Book Event Catering
            </Link>
          </div>
        </section>

        {/* ── Page Footer ────────────────────────────────────────────────────── */}
        <footer className="mt-16 mb-12 relative z-10 w-full px-2 lg:px-6 flex flex-col items-center">
          <div className="w-full max-w-4xl border-t-2 border-black/10 pt-10 flex flex-col items-center text-center">
            <Link href="/" className="mb-3 inline-block hover:opacity-90 transition-opacity">
              <img src="/assets/logo.png" alt="Bondor Bati" className="h-12 w-auto object-contain mx-auto" />
            </Link>

            <p className="font-nunito-extrabold text-base text-gray-800 mb-1">
              Bondor Bati • Authentic Chittagong Heritage Cuisine
            </p>
            <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
              Traditional home-cooked recipes, slow-simmered in brass cauldrons with pure mustard oil and stone-ground spices.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-nunito-bold text-gray-700 mb-8">
              <Link href="/" className="hover:text-[#af0202] transition-colors">
                Home
              </Link>
              <Link href="/#menu" className="hover:text-[#af0202] transition-colors">
                Weekly Tiffin
              </Link>
              <Link href="/#catering" className="hover:text-[#af0202] transition-colors">
                Event Catering
              </Link>
              <Link href="/#contact" className="hover:text-[#af0202] transition-colors">
                Contact Us
              </Link>
            </div>

            <div className="text-center text-gray-400 text-xs font-medium">
              © 2026 Bondor Bati. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
