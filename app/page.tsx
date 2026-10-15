'use client';

/**
 * app/page.tsx — Bondor Bati
 *
 * Pixel-perfect re-creation of https://catering.mbhgoldenglobal.com/
 * built natively with Next.js 16 (App Router) + Tailwind CSS.
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { MenuItem, CateringMenu, SuccessStory, MarqueeNotice } from '@/types';
import SuccessStories from '@/components/SuccessStories';
import { NoticeIcon, DotSeparator, FoodPlateIcon, PlusIcon, MinusIcon } from '@/components/SvgIcons';
import CustomDatePicker from '@/components/CustomDatePicker';

const DEFAULT_MARQUEE_NOTICES: MarqueeNotice[] = [
  { id: 1, text: 'Order Cut-off Time: 10:00 PM for Next Day Lunch', icon: 'clock', display_order: 1, is_active: true },
  { id: 2, text: 'Serving specific delivery zones in Dhaka', icon: 'truck', display_order: 2, is_active: true },
  { id: 3, text: 'Authentic Chittagong Heritage Cuisine', icon: 'food', display_order: 3, is_active: true },
];

const DEFAULT_TESTIMONIALS: SuccessStory[] = [
  {
    id: 1,
    client_name: 'Jihan',
    rating: 5,
    content: "The authentic Chittagong flavor I've been looking for! The beef mezbani was absolutely incredible and the delivery was right on time.",
  },
  {
    id: 2,
    client_name: 'Tanvir Islam',
    rating: 5,
    content: 'I order the premium menu every week. The quality is consistently excellent and it truly feels like a hearty home-cooked meal.',
  },
  {
    id: 3,
    client_name: 'Sadia Rahman',
    rating: 4,
    content: 'Best lunch service for our office team. The packaging in tiffin boxes keeps everything warm and fresh. Highly recommend the Rui Maach.',
  },
  {
    id: 4,
    client_name: 'Mahmudur Rahman',
    rating: 5,
    content: 'Bondor Bati catered our wedding reception of 300 guests. Every single guest complimented the Kacchi Biryani and Borhani. Outstanding service!',
  },
  {
    id: 5,
    client_name: 'Nusrat Jahan',
    rating: 5,
    content: 'Clean, hygienic, and truly delicious home-style cooking. The Kala Bhuna is the best in town by far. Keep up the high standard!',
  },
];

// English days matching the schedule
const DAY_TABS = [
  { index: 0, bn: 'Sat' },
  { index: 1, bn: 'Sun' },
  { index: 2, bn: 'Mon' },
  { index: 3, bn: 'Tue' },
  { index: 4, bn: 'Wed' },
  { index: 5, bn: 'Thu' },
];

const CATERING_FILTERS = [
  { key: 'all', label: 'All Menus' },
  { key: 'regular', label: 'Regular Menu' },
  { key: 'premium', label: 'Premium Menu' },
  { key: 'holud', label: 'Holud Special' },
  { key: 'bride', label: 'Bride Menu' },
  { key: 'box', label: 'Box Menu' },
];

interface CartLine {
  item: MenuItem;
  quantity: number;
}

export default function HomePage() {
  // Navigation & Scroll State
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Service toggle: 'tiffin' | 'catering'
  const [activeService, setActiveService] = useState<'tiffin' | 'catering'>('tiffin');
  const [selectedDay, setSelectedDay] = useState(0);
  const [cateringFilter, setCateringFilter] = useState('all');

  // Backend Data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cateringMenus, setCateringMenus] = useState<CateringMenu[]>([]);
  const [testimonials, setTestimonials] = useState<SuccessStory[]>([]);
  const [marqueeNotices, setMarqueeNotices] = useState<MarqueeNotice[]>([]);
  const [noticesLoaded, setNoticesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Catering Guest Count State (per menu card)
  const [guestCounts, setGuestCounts] = useState<Record<number, number>>({});

  // Cart State (stored in localStorage under 'bondor_bati_cart')
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBouncing, setCartBouncing] = useState(false);

  // Modals State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [cateringModalOpen, setCateringModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [planDays, setPlanDays] = useState('1');
  const [orderNotes, setOrderNotes] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState('');

  // Catering Inquiry Modal State
  const [activeCateringMenu, setActiveCateringMenu] = useState<CateringMenu | null>(null);
  const [cateringName, setCateringName] = useState('');
  const [cateringPhone, setCateringPhone] = useState('');
  const [cateringDate, setCateringDate] = useState('');
  const [cateringVenue, setCateringVenue] = useState('');
  const [cateringNotes, setCateringNotes] = useState('');
  const [cateringSubmitting, setCateringSubmitting] = useState(false);

  // Tracking Form State
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [trackPhone, setTrackPhone] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [trackResult, setTrackResult] = useState<{
    orderNumber: string;
    customerName: string;
    status: string;
    deliveryDate: string;
    total: number;
  } | null>(null);

  // Window scroll handler for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Read / write cart to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bondor_bati_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveCartToStorage = (updated: CartLine[]) => {
    setCart(updated);
    try {
      localStorage.setItem('bondor_bati_cart', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [menuRes, catRes, testRes, noticeRes] = await Promise.allSettled([
          fetch(`/api/menu?_t=${Date.now()}`, { cache: 'no-store' }).then((r) => r.json()),
          fetch(`/api/admin/catering-menus?_t=${Date.now()}`, { cache: 'no-store' }).then((r) => r.json()),
          fetch(`/api/testimonials?_t=${Date.now()}`, { cache: 'no-store' }).then((r) => r.json()),
          fetch(`/api/notices?_t=${Date.now()}`, { cache: 'no-store' }).then((r) => r.json()),
        ]);

        if (menuRes.status === 'fulfilled' && menuRes.value.success) {
          const data = menuRes.value.data;
          if (Array.isArray(data)) {
            const flattened: MenuItem[] = [];
            data.forEach((d: { items?: MenuItem[] }) => {
              if (d.items) flattened.push(...d.items);
            });
            setMenuItems(flattened.length ? flattened : (data as MenuItem[]));
          }
        }

        if (catRes.status === 'fulfilled' && catRes.value.success) {
          setCateringMenus(catRes.value.data || []);
        }

        if (testRes.status === 'fulfilled' && testRes.value.success) {
          setTestimonials(testRes.value.data || []);
        }

        if (noticeRes.status === 'fulfilled' && noticeRes.value.success) {
          setMarqueeNotices(noticeRes.value.data || []);
          setNoticesLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load menu data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Dynamic Scroll Reveal IntersectionObserver
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
    const timer = setTimeout(observeElements, 250);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [loading, activeService, selectedDay, cateringFilter]);

  // Filter items for current selected day
  const currentDayItems = useMemo(() => {
    return menuItems.filter((item) => Number(item.day_index) === selectedDay);
  }, [menuItems, selectedDay]);

  // Filter catering menus
  const filteredCatering = useMemo(() => {
    if (cateringFilter === 'all') return cateringMenus;
    return cateringMenus.filter((c) => c.category === cateringFilter);
  }, [cateringMenus, cateringFilter]);

  // Cart Computations
  const cartTotalCount = useMemo(() => {
    return cart.reduce((acc, c) => acc + c.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, c) => acc + Number(c.item.price) * c.quantity, 0);
  }, [cart]);

  // Cart operations
  function handleAddToCart(item: MenuItem) {
    const existingIndex = cart.findIndex((c) => c.item.id === item.id);
    let updated: CartLine[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += 1;
    } else {
      updated = [...cart, { item, quantity: 1 }];
    }
    saveCartToStorage(updated);
    showToast(`Added ${item.name} to cart!`);
    setCartBouncing(true);
    setTimeout(() => setCartBouncing(false), 500);
    setCartOpen(true);
  }

  function updateCartQuantity(id: number, delta: number) {
    const updated = cart
      .map((c) => {
        if (c.item.id === id) {
          const newQty = c.quantity + delta;
          return newQty > 0 ? { ...c, quantity: newQty } : null;
        }
        return c;
      })
      .filter(Boolean) as CartLine[];
    saveCartToStorage(updated);
  }

  function removeCartItem(id: number) {
    const updated = cart.filter((c) => c.item.id !== id);
    saveCartToStorage(updated);
  }

  // Handle Order Placement
  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setCheckoutError('');

    if (cart.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    setOrderSubmitting(true);
    try {
      let formattedDate = '';
      if (deliveryDate) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
          formattedDate = deliveryDate;
        } else {
          const d = new Date(deliveryDate);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toISOString().slice(0, 10);
          }
        }
      }
      if (!formattedDate) {
        formattedDate = new Date().toISOString().slice(0, 10);
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          delivery_date: formattedDate,
          plan_days: Number(planDays) || 1,
          notes: orderNotes.trim() || undefined,
          items: cart.map((c) => ({
            item_id: c.item.id,
            menu_item_id: c.item.id,
            quantity: c.quantity,
            plan_days: Number(planDays) || 1,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setConfirmedOrderNumber(data.data.order_number);
        setCheckoutModalOpen(false);
        setConfirmationModalOpen(true);
        saveCartToStorage([]);
      } else {
        setCheckoutError(data.message || 'Failed to place order. Please try again.');
      }
    } catch {
      setCheckoutError('A network error occurred. Please check connection.');
    } finally {
      setOrderSubmitting(false);
    }
  }

  // Handle Catering Reservation
  async function handleCateringSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeCateringMenu) return;

    setCateringSubmitting(true);
    const guestCount = guestCounts[activeCateringMenu.id] || 30;

    try {
      let formattedEventDate = '';
      if (cateringDate) {
        const d = new Date(cateringDate);
        if (!isNaN(d.getTime())) {
          formattedEventDate = d.toISOString().slice(0, 19).replace('T', ' ');
        } else if (/^\d{4}-\d{2}-\d{2}/.test(cateringDate)) {
          formattedEventDate = cateringDate.length === 10 ? `${cateringDate} 12:00:00` : cateringDate;
        }
      }
      if (!formattedEventDate) {
        formattedEventDate = `${new Date().toISOString().slice(0, 10)} 12:00:00`;
      }

      const res = await fetch('/api/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_name: activeCateringMenu.title,
          guest_count: guestCount,
          client_name: cateringName.trim(),
          phone: cateringPhone.trim(),
          event_date: formattedEventDate,
          venue: cateringVenue.trim() || 'Chattogram',
          notes: cateringNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setConfirmedOrderNumber(data.data.booking_number);
        setCateringModalOpen(false);
        setConfirmationModalOpen(true);
      } else {
        alert(data.message || 'Failed to submit inquiry.');
      }
    } catch {
      alert('Network error submitting catering booking.');
    } finally {
      setCateringSubmitting(false);
    }
  }

  // Handle Live Order Tracking
  async function handleTrackOrder(e: React.FormEvent) {
    e.preventDefault();
    setTrackLoading(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const url = `/api/orders/track?order_number=${encodeURIComponent(
        trackOrderNumber.trim()
      )}&phone=${encodeURIComponent(trackPhone.trim())}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.data) {
        setTrackResult({
          orderNumber: data.data.order_number,
          customerName: data.data.customer_name,
          status: data.data.status,
          deliveryDate: data.data.delivery_date,
          total: Number(data.data.total_amount),
        });
      } else {
        setTrackError(data.message || 'No matching order found.');
      }
    } catch {
      setTrackError('Network error checking order status.');
    } finally {
      setTrackLoading(false);
    }
  }

  // Close any modal on backdrop click
  const closeAllModals = () => {
    setCartOpen(false);
    setCheckoutModalOpen(false);
    setTrackingModalOpen(false);
    setConfirmationModalOpen(false);
    setCateringModalOpen(false);
  };

  const isAnyModalOpen =
    cartOpen ||
    checkoutModalOpen ||
    trackingModalOpen ||
    confirmationModalOpen ||
    cateringModalOpen;

  const hasMarquee = !noticesLoaded || marqueeNotices.some((n) => n.is_active);
  const activeMarqueeList = noticesLoaded
    ? marqueeNotices.filter((n) => n.is_active)
    : DEFAULT_MARQUEE_NOTICES;

  return (
    <>
      {/* ── Top Marquee Notification Bar ───────────────────────────────────── */}
      {hasMarquee && activeMarqueeList.length > 0 && (
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

      {/* ── Global Fixed Navbar ────────────────────────────────────────────── */}
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
          {/* Logo */}
          <div className="relative z-[60]">
            <a href="#home">
              <img
                id="navLogo"
                src="assets/logo.png"
                alt="Bondor Bati"
                className="h-10 sm:h-12 md:h-16 w-auto object-contain"
              />
            </a>
          </div>

          {/* Desktop Nav Pill */}
          <div className="hidden lg:flex nav-pill items-center gap-3 px-5 py-2.5">
            <a href="#home" className="nav-item nav-item-active" data-section="home" id="nav-home">Home</a>
            <a href="#menu" className="nav-item" data-section="menu" id="nav-menu">Menu</a>
            <Link href="/about" className="nav-item" id="nav-about">Our Story</Link>
            <a href="#contact" className="nav-item" data-section="contact" id="nav-contact">Contact Us</a>
            <button
              id="cartButton"
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open shopping cart"
              className={`relative ml-3 cursor-pointer group flex items-center justify-center w-9 h-9 bg-[#1a1a1d] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5),_0px_1px_1px_rgba(255,255,255,0.05)] hover:bg-[#25252a] hover:scale-105 active:scale-95 transition-all ${
                cartBouncing ? 'animate-cart-pop' : ''
              }`}
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
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span
                id="cartCount"
                className="absolute -top-1 -right-1 bg-[#ff5757] text-white text-[10px] font-nunito-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#1d1d20]"
              >
                {cartTotalCount}
              </span>
            </button>
          </div>

          {/* Mobile Actions: Cart & Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5 lg:hidden relative z-[60]">
            <button
              id="mobileNavCartBtn"
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
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
              {cartTotalCount > 0 && (
                <span
                  id="mobileCartCount"
                  className="absolute -top-1 -right-1 bg-[#af0202] text-white text-[10px] font-nunito-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                >
                  {cartTotalCount}
                </span>
              )}
            </button>

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

      {/* ── Mobile Menu Overlay ────────────────────────────────────────────── */}
      <div
        id="mobileMenu"
        className={`fixed inset-0 bg-white/95 backdrop-blur-xl z-[90] flex flex-col items-center justify-center gap-5 transition-all duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto visible translate-y-0'
            : 'opacity-0 pointer-events-none invisible -translate-y-4'
        }`}
      >
        <img src="assets/logo.png" alt="Bondor Bati" className="h-14 w-auto object-contain mb-4" />
        <a href="#home" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Home</a>
        <a href="#menu" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Menu</a>
        <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Our Story</Link>
        <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Contact Us</a>
        
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            setCartOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-gray-300 bg-gray-50 text-gray-800 font-nunito-bold text-sm hover:bg-gray-100 transition active:scale-95 cursor-pointer w-4/5 max-w-[280px]"
        >
          <svg className="w-4 h-4 text-[#af0202]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          View Cart ({cartTotalCount})
        </button>

        <a
          href="#menu"
          onClick={() => setMobileMenuOpen(false)}
          className="clay-btn-red text-center px-8 py-3 text-base font-nunito-bold tracking-wide w-4/5 max-w-[280px] text-white mobile-menu-btn"
          style={{ textDecoration: 'none' }}
        >
          Order Now
        </a>
      </div>

      {/* ── Main Container ─────────────────────────────────────────────────── */}
      <div
        className={`min-h-screen w-full flex flex-col relative px-3 sm:px-6 md:px-10 lg:px-[100px] pb-8 max-w-[1600px] mx-auto ${
          hasMarquee ? 'mt-6 sm:mt-4' : 'mt-0 sm:mt-0'
        }`}
      >
        {/* Dashboard card container matching reference style */}
        <div
          className={`dashboard-container w-full flex flex-col relative mb-12 sm:mb-16 ${
            hasMarquee ? 'mt-2 sm:mt-6' : 'mt-0 sm:mt-2'
          } overflow-hidden`}
        >
          {/* Hero Section */}
          <main
            id="home"
            className={`flex flex-col lg:flex-row items-center justify-between relative z-10 gap-6 sm:gap-10 lg:gap-0 ${
              hasMarquee
                ? 'mt-2 md:mt-0 pt-14 sm:pt-18 md:pt-22'
                : 'mt-0 pt-8 sm:pt-12 md:pt-16'
            } pb-4 md:pb-8 px-2 sm:px-6 md:px-10 min-h-0`}
          >
            <div className="w-full lg:w-3/6 flex flex-col items-center lg:items-start justify-center text-center lg:text-left h-full reveal-left">
              <h1 className="animate-hero-1 font-nunito-black text-3xl sm:text-5xl lg:text-[72px] xl:text-[82px] leading-[1.08] lg:leading-[1.1] text-gray-900 mb-2.5 sm:mb-4 z-20 relative">
                <span className="block">Bondor Bati</span>
                <span className="block text-2xl sm:text-4xl lg:text-[54px] xl:text-[64px] text-[#af0202] mt-0.5 sm:mt-1">
                  Catering Service
                </span>
              </h1>
              <p className="animate-hero-2 text-gray-600 text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 lg:mb-10 font-medium max-w-sm sm:max-w-md lg:max-w-none px-2 lg:px-0 tracking-wide">
                Chittagong Heritage Cuisine. Delivered.
              </p>
              <div className="animate-hero-3 flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-5 w-full max-w-[340px] sm:max-w-none sm:w-auto px-0">
                <a
                  href="#menu"
                  id="heroOrderButton"
                  className="btn-hero-primary flex-1 sm:flex-initial px-6 py-3 sm:px-10 sm:py-4 text-base sm:text-lg tracking-wide whitespace-nowrap shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all"
                >
                  Order Now
                </a>
                <a
                  href="#menu"
                  id="heroMenuButton"
                  className="btn-hero-secondary flex-1 sm:flex-initial px-6 py-3 sm:px-10 sm:py-4 text-base sm:text-lg tracking-wide whitespace-nowrap shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all"
                >
                  View Menu
                </a>
              </div>
            </div>

            {/* Right Minimalist Hero Image with Ambient Floating Cards & Soft Glow */}
            <div className="w-full lg:w-3/6 flex justify-center items-center relative h-[320px] sm:h-[420px] lg:h-[580px] reveal-right mt-6 lg:mt-0">
              {/* Background Glow */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-red-500/15 to-amber-500/20 blur-3xl pointer-events-none animate-pulse-glow" />

              <div className="relative animate-hero-dish">
                <img
                  className="w-full h-full max-w-[320px] sm:max-w-[420px] lg:max-w-[500px] object-cover rounded-full shadow-2xl border-4 border-black/80 animate-float-dynamic"
                  src="./assets/minimal_hero.jpg"
                  alt="Minimalist Meal"
                />

                {/* Floating Micro Badge 1 (Top Left) */}
                <div className="absolute -top-3 -left-4 sm:top-4 sm:-left-8 bg-white border-2 border-black rounded-2xl px-3 sm:px-4 py-2 shadow-[4px_4px_0px_#000] animate-float-gentle flex items-center gap-2 z-20">
                  <span className="text-xl sm:text-2xl">🍲</span>
                  <div>
                    <p className="font-nunito-black text-xs sm:text-sm text-gray-900 leading-tight">Fresh Tiffin</p>
                    <p className="text-[10px] text-gray-500 font-nunito-bold">Daily Lunch</p>
                  </div>
                </div>

                {/* Floating Micro Badge 2 (Bottom Right) */}
                <div className="absolute -bottom-3 -right-4 sm:bottom-4 sm:-right-6 bg-white border-2 border-black rounded-2xl px-3 sm:px-4 py-2 shadow-[4px_4px_0px_#000] animate-float-delayed flex items-center gap-2 z-20">
                  <span className="text-xl sm:text-2xl">⚡</span>
                  <div>
                    <p className="font-nunito-black text-xs sm:text-sm text-[#af0202] leading-tight">Fast Delivery</p>
                    <p className="text-[10px] text-gray-500 font-nunito-bold">Hot to Door</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* ── About Section ────────────────────────────────────────────────── */}
        <section id="about" className="w-full max-w-6xl mx-auto mb-8 px-2 sm:px-6 lg:px-0 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center scroll-reveal">
          <div className="minimal-card !p-2 sm:!p-3 overflow-hidden min-h-[240px] sm:min-h-[320px]">
            <img
              src="assets/minimal_hero.jpg"
              alt="Bondor Bati Catering Service"
              className="w-full h-[240px] sm:h-[320px] object-cover rounded-2xl"
            />
          </div>
          <div className="px-2 sm:px-4 md:px-8 py-4 sm:py-6">
            <p className="commerce-kicker text-[#af0202]">Catering Service</p>
            <h2 className="font-nunito-black text-2xl sm:text-4xl md:text-5xl text-gray-900 mb-3 sm:mb-5">
              Good Food Brings People Together.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-6 sm:leading-7 mb-3 sm:mb-4">
              <strong>Bondor Bati Catering Service</strong> brings the generous, deeply spiced cooking of Chittagong to your everyday lunch table and your grandest events. We ensure <em>Traditional Food, Authentic Taste, and it is Always Special.</em>
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-6 sm:leading-7 mb-5">
              Choose our Weekly Tiffin for daily meals, or explore our extensive Event Catering menus for bulk orders. Let us handle the food, so you can focus on the memories.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#af0202] text-white font-nunito-bold text-sm shadow-[3px_3px_0px_#000] border-2 border-black hover:bg-[#8e0202] hover:-translate-y-0.5 transition-all"
            >
              Read Our Full Story
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ── Service Section (Weekly Tiffin & Event Catering) ─────────────── */}
        <section className="mt-14 sm:mt-24 lg:mt-32 mb-10 relative z-10 flex flex-col items-center w-full px-2" id="menu">
          
          {/* Service Toggle */}
          <div className="service-toggle-container scroll-reveal">
            <div
              className={`service-toggle-slider ${
                activeService === 'catering' ? '!translate-x-[100%]' : ''
              }`}
              id="serviceSlider"
            />
            <div
              className={`service-toggle-btn text-sm sm:text-base whitespace-nowrap ${
                activeService === 'tiffin' ? 'active' : ''
              }`}
              id="btnTiffin"
              onClick={() => setActiveService('tiffin')}
            >
              Weekly Tiffin
            </div>
            <div
              className={`service-toggle-btn text-sm sm:text-base whitespace-nowrap ${
                activeService === 'catering' ? 'active' : ''
              }`}
              id="btnCatering"
              onClick={() => setActiveService('catering')}
            >
              Event Catering
            </div>
          </div>

          {/* ── Weekly Tiffin Section ───────────────────────────────────────── */}
          <div
            id="tiffinSection"
            className={`w-full flex flex-col items-center transition-opacity duration-300 ${
              activeService === 'tiffin' ? 'block' : 'hidden'
            }`}
          >
            <h2 className="font-nunito-black text-3xl sm:text-4xl md:text-5xl text-gray-900 my-4 text-center scroll-reveal">
              Weekly Menu
            </h2>

            {/* Minimum Order Badge */}
            <div className="bg-gray-100 text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-nunito-bold flex items-center gap-2 scroll-reveal border border-gray-200 shadow-md">
              <svg className="text-[#CC0000]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Minimum Order Quantity: 10 Pcs
            </div>

            {/* Day Selector Tabs */}
            <div className="flex items-center justify-center w-full max-w-4xl px-2 gap-2 md:gap-4 mb-10 py-6 scroll-reveal delay-200">
              <button
                id="prevDayBtn"
                type="button"
                onClick={() => setSelectedDay((prev) => (prev > 0 ? prev - 1 : 5))}
                className="clay-tab !p-3 flex-shrink-0 flex items-center justify-center rounded-2xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <div className="flex items-center gap-2 md:gap-5 overflow-x-auto hide-scrollbar px-2 py-4 min-w-0" id="dayTabsContainer">
                {DAY_TABS.map((day) => (
                  <button
                    key={day.index}
                    type="button"
                    onClick={() => setSelectedDay(day.index)}
                    className={`day-tab clay-tab ${selectedDay === day.index ? 'clay-tab-active' : ''}`}
                    data-index={day.index}
                  >
                    {day.bn}
                  </button>
                ))}
              </div>

              <button
                id="nextDayBtn"
                type="button"
                onClick={() => setSelectedDay((prev) => (prev < 5 ? prev + 1 : 0))}
                className="clay-tab !p-3 flex-shrink-0 flex items-center justify-center rounded-2xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Menu Cards Display Container */}
            <div id="menuCardsContainer" className="w-full max-w-6xl mx-auto px-2 md:px-6 relative min-h-[500px]" aria-live="polite">
              <div className="day-content grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 fade-in" data-content={selectedDay}>
                {loading ? (
                  <div className="col-span-full text-center py-24 text-gray-500 font-nunito-bold text-lg">
                    Loading this week’s menu…
                  </div>
                ) : currentDayItems.length === 0 ? (
                  <div className="col-span-full text-center py-24 text-gray-500 font-nunito-bold text-lg">
                    No items scheduled for this day yet.
                  </div>
                ) : (
                  currentDayItems.map((item, index) => {
                    const isPremium = item.tier === 'premium';
                    const cardBorder = isPremium
                      ? 'border-yellow-600/20 hover:border-yellow-600/50'
                      : 'border-[#af0202]/20 hover:border-[#af0202]/50';
                    const badgeBg = isPremium ? 'bg-[#966f14]' : 'bg-[#8e1515]';
                    const badgeBorder = isPremium ? 'border-yellow-400/50' : 'border-[#ff6b6b]/50';
                    const badgeShadow = isPremium
                      ? 'shadow-[0_5px_10px_rgba(150,111,20,0.5)]'
                      : 'shadow-[0_5px_10px_rgba(142,21,21,0.5)]';
                    const tierName = isPremium ? 'Premium' : 'Standard';
                    const titleColor = isPremium ? 'text-gold' : 'text-gray-900';
                    const btnClass = isPremium ? 'clay-btn-yellow' : 'clay-btn-red';

                    return (
                      <div
                        key={item.id}
                        className={`clay-card p-8 flex flex-col items-center relative w-full border ${cardBorder} scroll-reveal hover:-translate-y-2 hover:shadow-[12px_12px_0px_#000] transition-all duration-300`}
                        style={{ transitionDelay: `${index * 120}ms` }}
                      >
                        <div
                          className={`absolute -top-4 right-4 ${badgeBg} text-white text-sm font-nunito-black px-5 py-2 rounded-full ${badgeShadow} border ${badgeBorder}`}
                        >
                          {tierName} - Tk {Number(item.price)}
                        </div>

                        {item.image_url ? (
                          <div className="plate-3d animate-float">
                            <img
                              src={item.image_url.startsWith('/') || item.image_url.startsWith('http') ? item.image_url : `/${item.image_url}`}
                              alt={item.name}
                            />
                          </div>
                        ) : (
                          <div className="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative bg-gradient-to-br from-amber-50 to-orange-100 shadow-inner">
                            <FoodPlateIcon className="w-16 h-16 text-[#af0202] animate-float" />
                          </div>
                        )}

                        <h3 className={`font-nunito-extrabold text-2xl ${titleColor} mb-4 text-center`}>
                          {item.name}
                        </h3>

                        <p className="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">
                          {item.description || 'Special Chittagong home-style recipe prepared with fresh ingredients.'}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className={`${btnClass} mt-auto w-[90%] sm:w-4/5 text-base sm:text-lg py-2.5 sm:py-3 rounded-[20px] add-to-cart`}
                        >
                          Add {tierName}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* ── Event Catering Section ─────────────────────────────────────── */}
          <div
            id="cateringSection"
            className={`w-full flex flex-col items-center transition-opacity duration-300 ${
              activeService === 'catering' ? 'block' : 'hidden'
            }`}
          >
            <h2 className="font-nunito-black text-3xl sm:text-4xl md:text-5xl text-gray-900 my-6 text-center scroll-reveal">
              Event Catering
            </h2>

            <div className="bg-gray-100 text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base mb-5 font-nunito-bold flex items-center gap-2 scroll-reveal border border-gray-200 shadow-md">
              <svg className="text-[#CC0000]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Minimum Order Quantity: 30 Pcs
            </div>

            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar px-4 max-w-5xl mb-12 w-full scroll-reveal">
              {CATERING_FILTERS.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCateringFilter(cat.key)}
                  className={`catering-filter-btn ${cateringFilter === cat.key ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="w-full max-w-6xl mx-auto px-2 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10" id="cateringGrid">
              {filteredCatering.map((m, idx) => {
                const isPrem = m.category === 'premium' || m.category === 'bride';
                const isExclusive = m.badge_text === 'EXCLUSIVE 7' || m.badge_text === 'EXCLUSIVE MENU 7';
                let btnClass = isPrem ? 'clay-btn-yellow' : 'clay-btn-red';
                let badgeBg = isPrem ? 'bg-[#966f14]' : 'bg-[#8e1515]';
                let borderColor = isPrem ? 'border-yellow-600/20' : 'border-[#af0202]/20';
                let titleColor = isPrem ? 'text-primary' : 'text-gray-900';

                if (isExclusive) {
                  btnClass = 'clay-btn-red !bg-[#cc5500] !border-[#ffa500]/50 hover:!bg-[#e65c00]';
                  badgeBg = 'bg-[#cc5500]';
                  borderColor = 'border-[#ff8c00]/40';
                  titleColor = 'text-primary';
                }

                const itemsList = m.items ? m.items.split('\n').map((i) => i.trim()).filter(Boolean) : [];
                const guests = guestCounts[m.id] || 30;

                return (
                  <div
                    key={m.id}
                    className={`clay-card p-8 flex flex-col relative border ${borderColor} catering-item scroll-reveal hover:-translate-y-2 hover:shadow-[12px_12px_0px_#000] transition-all duration-300`}
                    style={{ transitionDelay: `${(idx % 3) * 120}ms` }}
                    data-category={m.category}
                  >
                    <div
                      className={`absolute -top-4 right-4 ${badgeBg} text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-lg border border-[#ff6b6b]/50`}
                    >
                      {m.badge_text}
                    </div>

                    <h3 className={`font-nunito-extrabold text-2xl ${titleColor} mb-4 mt-2`}>
                      {m.title}
                    </h3>

                    <ul className="text-gray-600 text-[14px] mb-6 space-y-2 flex-grow list-disc pl-5">
                      {itemsList.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between mt-auto mb-6">
                      <span className="text-gray-900 font-nunito-bold">Guests:</span>
                      <div className="qty-control">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            setGuestCounts((prev) => ({
                              ...prev,
                              [m.id]: Math.max(30, (prev[m.id] || 30) - 10),
                            }))
                          }
                        >
                          −
                        </button>
                        <input type="number" className="qty-input" value={guests} min="30" readOnly />
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            setGuestCounts((prev) => ({
                              ...prev,
                              [m.id]: (prev[m.id] || 30) + 10,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveCateringMenu(m);
                        setCateringModalOpen(true);
                      }}
                      className={`${btnClass} w-full`}
                    >
                      Book Event
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Success Stories Section ───────────────────────────────────────── */}
        <SuccessStories stories={testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS} />

        {/* ── Contact / Footer Section ─────────────────────────────────────── */}
        <footer id="contact" className="mt-10 mb-12 relative z-10 w-full px-2 lg:px-6 flex flex-col items-center">
          <div className="w-full max-w-5xl bg-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl border border-gray-100 relative overflow-hidden reveal-scale">
            
            <div
              className="absolute -bottom-20 -right-20 w-64 h-64 bg-gray-100 rounded-full border border-gray-200 pointer-events-none animate-spin-slow"
              style={{ borderStyle: 'dashed' }}
            />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left flex-1 z-10">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-[#af0202] shadow-sm flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h4 className="font-nunito-extrabold text-gray-900 text-xl mb-2">Our Locations</h4>
                <p className="text-gray-600 text-[15px] leading-relaxed max-w-sm mb-1">
                  <strong className="text-gray-800">Chattogram City:</strong> Central Kitchen, GEC Circle, Chattogram.
                </p>
                <p className="text-gray-600 text-[15px] leading-relaxed max-w-sm">
                  <strong className="text-gray-800">Delivery:</strong> Serving specific delivery zones across Chattogram.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-r-0 sm:border-r border-gray-200 pr-0 sm:pr-6">
                <span className="text-gray-600 text-sm font-medium mb-1">Call for Order / Booking</span>
                <div className="flex flex-col gap-1">
                  <a href="tel:01713334025" className="font-nunito-black text-[#af0202] text-lg tracking-wide hover:text-[#8e0202] transition-colors">01713-334025</a>
                  <a href="tel:01713334048" className="font-nunito-black text-[#af0202] text-lg tracking-wide hover:text-[#8e0202] transition-colors">01713-334048</a>
                  <a href="tel:01600305444" className="font-nunito-black text-[#af0202] text-lg tracking-wide hover:text-[#8e0202] transition-colors">01600-305444</a>
                </div>
                <a href="mailto:iqbalcaterings23@gmail.com" className="text-gray-600 hover:text-gray-900 text-sm mt-3 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  iqbalcaterings23@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-2xl shadow-sm cursor-default hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-xl transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <path d="M15 18H9" />
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                  <circle cx="17" cy="18" r="2" />
                  <circle cx="7" cy="18" r="2" />
                </svg>
                <div className="flex flex-col text-left">
                  <span className="font-nunito-black text-gray-900 text-lg uppercase leading-none mb-0.5">Free</span>
                  <span className="font-nunito-bold text-[#af0202] text-xs uppercase tracking-[0.2em] leading-none">Delivery</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-sm font-nunito-bold">
            <button
              id="trackOrderButton"
              type="button"
              onClick={() => setTrackingModalOpen(true)}
              className="text-[#af0202] hover:text-[#8e0202] transition-colors underline underline-offset-4 cursor-pointer"
            >
              Track an existing order
            </button>
            <span className="text-gray-300">•</span>
            <Link
              href="/about"
              className="text-[#af0202] hover:text-[#8e0202] transition-colors underline underline-offset-4 cursor-pointer"
            >
              Our Heritage & Story
            </Link>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm font-medium mb-4">
            © 2026 Bondor Bati. Chittagong Heritage Cuisine.
          </div>
        </footer>

      </div>

      {/* ── Mobile Floating Cart Button ────────────────────────────────────── */}
      <button
        id="mobileCartButton"
        type="button"
        onClick={() => setCartOpen(true)}
        className={`mobile-cart-button lg:hidden ${cartBouncing ? 'animate-cart-pop' : ''}`}
        aria-label="Open shopping cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <span id="mobileCartCount">{cartTotalCount}</span>
      </button>

      {/* ── Modal Backdrop ─────────────────────────────────────────────────── */}
      <div
        id="uiBackdrop"
        className={`commerce-backdrop ${isAnyModalOpen ? 'is-open' : ''}`}
        aria-hidden={!isAnyModalOpen}
        onClick={closeAllModals}
      />

      {/* ── Cart Drawer ────────────────────────────────────────────────────── */}
      <aside
        id="cartDrawer"
        className={`cart-drawer ${cartOpen ? 'is-open' : ''}`}
        aria-labelledby="cartTitle"
        aria-hidden={!cartOpen}
      >
        <div className="commerce-panel-header">
          <div>
            <p className="commerce-kicker">Your selection</p>
            <h2 id="cartTitle" className="font-nunito-black text-3xl text-gray-900">Order cart</h2>
          </div>
          <button
            type="button"
            className="icon-close"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div id="cartItems" className="cart-items" aria-live="polite">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-nunito-bold">
              Your cart is empty.
            </div>
          ) : (
            cart.map((c) => (
              <div key={c.item.id} className="cart-line">
                <div className="cart-line-emoji flex items-center justify-center">
                  {c.item.image_url ? (
                    <img src={c.item.image_url} alt={c.item.name} className="w-10 h-10 object-cover rounded-lg" />
                  ) : (
                    <FoodPlateIcon className="w-8 h-8 text-[#af0202]" />
                  )}
                </div>
                <div>
                  <h4 className="font-nunito-bold text-base text-gray-900">{c.item.name}</h4>
                  <div className="text-sm text-gray-500">Tk {Number(c.item.price)} each</div>
                  <div className="quantity-control flex items-center gap-1.5">
                    <button type="button" onClick={() => updateCartQuantity(c.item.id, -1)} aria-label="Decrease quantity" className="flex items-center justify-center">
                      <MinusIcon className="w-3.5 h-3.5" />
                    </button>
                    <span>{c.quantity}</span>
                    <button type="button" onClick={() => updateCartQuantity(c.item.id, 1)} aria-label="Increase quantity" className="flex items-center justify-center">
                      <PlusIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="remove-cart-item"
                    onClick={() => removeCartItem(c.item.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="font-nunito-bold text-right text-gray-900">
                  Tk {Number(c.item.price) * c.quantity}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><strong id="cartSubtotal">Tk {cartSubtotal}</strong></div>
          <div className="flex justify-between text-gray-600"><span>Delivery</span><strong className="text-[#78B13F]">Free</strong></div>
          <div className="flex justify-between text-gray-900 text-xl pt-4 border-t border-gray-200"><span>Total</span><strong id="cartTotal">Tk {cartSubtotal}</strong></div>
          <button
            id="checkoutButton"
            type="button"
            disabled={cart.length === 0}
            onClick={() => {
              setCartOpen(false);
              setCheckoutModalOpen(true);
            }}
            className="clay-btn-red w-full mt-5 disabled:opacity-50"
          >
            Continue to checkout
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">Cash on delivery &middot; Order confirmation by phone</p>
        </div>
      </aside>

      {/* ── Checkout Modal ─────────────────────────────────────────────────── */}
      <section
        id="checkoutModal"
        className={`commerce-modal ${checkoutModalOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkoutTitle"
        aria-hidden={!checkoutModalOpen}
      >
        <div className="commerce-panel-header">
          <div>
            <p className="commerce-kicker">Free delivery</p>
            <h2 id="checkoutTitle" className="font-nunito-black text-3xl text-gray-900">Checkout</h2>
          </div>
          <button
            type="button"
            className="icon-close"
            onClick={() => setCheckoutModalOpen(false)}
            aria-label="Close checkout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form id="checkoutForm" className="commerce-form" onSubmit={handlePlaceOrder} noValidate>
          <label>
            Full name
            <input
              name="customer_name"
              type="text"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </label>
          <label>
            Mobile number
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label className="form-full">
            Delivery address
            <textarea
              name="address"
              autoComplete="street-address"
              minLength={10}
              maxLength={500}
              required
              placeholder="House, road, area, Chattogram"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label className="relative z-30">
            Start / Delivery date
            <CustomDatePicker
              id="deliveryDate"
              name="delivery_date"
              required
              value={deliveryDate}
              onChange={(val) => setDeliveryDate(val)}
              placeholder="Select delivery date"
            />
          </label>
          <label>
            Subscription Plan
            <select
              name="plan_days"
              id="checkoutPlan"
              value={planDays}
              onChange={(e) => setPlanDays(e.target.value)}
            >
              <option value="1">1 Day (Single Order)</option>
              <option value="7">7-Day Plan</option>
              <option value="15">15-Day Plan</option>
              <option value="30">30-Day Plan</option>
            </select>
          </label>
          <label>
            Payment
            <input value="Cash on delivery" readOnly aria-label="Payment method" />
          </label>
          <label className="form-full">
            Order note (optional)
            <textarea
              name="notes"
              maxLength={500}
              placeholder="Landmark or delivery instructions"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </label>
          {checkoutError && (
            <p id="checkoutError" className="form-error form-full" role="alert">
              {checkoutError}
            </p>
          )}
          <button
            id="placeOrderButton"
            type="submit"
            disabled={orderSubmitting}
            className="clay-btn-red form-full"
          >
            {orderSubmitting ? 'Placing order...' : 'Place order'}
          </button>
        </form>
      </section>

      {/* ── Order Tracking Modal ───────────────────────────────────────────── */}
      <section
        id="trackingModal"
        className={`commerce-modal compact-modal ${trackingModalOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trackingTitle"
        aria-hidden={!trackingModalOpen}
      >
        <div className="commerce-panel-header">
          <div>
            <p className="commerce-kicker">Live from our kitchen</p>
            <h2 id="trackingTitle" className="font-nunito-black text-3xl text-gray-900">Track order</h2>
          </div>
          <button
            type="button"
            className="icon-close"
            onClick={() => setTrackingModalOpen(false)}
            aria-label="Close tracking"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form id="trackingForm" className="commerce-form" onSubmit={handleTrackOrder}>
          <label>
            Order number
            <input
              name="order_number"
              required
              placeholder="BB-260817-ABC123"
              value={trackOrderNumber}
              onChange={(e) => setTrackOrderNumber(e.target.value)}
            />
          </label>
          <label>
            Mobile number
            <input
              name="phone"
              type="tel"
              required
              placeholder="01XXXXXXXXX"
              value={trackPhone}
              onChange={(e) => setTrackPhone(e.target.value)}
            />
          </label>
          {trackError && (
            <p id="trackingError" className="form-error form-full" role="alert">
              {trackError}
            </p>
          )}
          <button
            type="submit"
            disabled={trackLoading}
            className="clay-btn-red form-full"
          >
            {trackLoading ? 'Searching...' : 'Find my order'}
          </button>
        </form>

        {trackResult && (
          <div id="trackingResult" className="tracking-result mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="flex justify-between py-1">
              <span className="text-gray-500 font-bold">Order:</span>
              <span className="font-mono font-bold">{trackResult.orderNumber}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 font-bold">Customer:</span>
              <span className="font-bold">{trackResult.customerName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 font-bold">Status:</span>
              <span className="font-bold text-[#af0202] uppercase">{trackResult.status}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 font-bold">Total:</span>
              <span className="font-bold">Tk {trackResult.total}</span>
            </div>
          </div>
        )}
      </section>

      {/* ── Order Confirmation Modal ───────────────────────────────────────── */}
      <section
        id="confirmationModal"
        className={`commerce-modal compact-modal text-center ${confirmationModalOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmationTitle"
        aria-hidden={!confirmationModalOpen}
      >
        <div className="confirmation-mark text-5xl text-[#78B13F] mb-2">&#10003;</div>
        <p className="commerce-kicker">Order received</p>
        <h2 id="confirmationTitle" className="font-nunito-black text-3xl text-gray-900 mb-3">Thank you!</h2>
        <div id="confirmationContent" className="text-gray-600 mb-6">
          <p className="mb-2">Your order has been recorded successfully.</p>
          <p className="font-mono font-bold text-lg text-gray-900 p-2 bg-gray-50 border border-gray-200 rounded-xl inline-block">
            {confirmedOrderNumber}
          </p>
          <p className="text-xs text-gray-500 mt-3">Our team will call you shortly to confirm delivery details.</p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmationModalOpen(false)}
          className="clay-btn-red w-full mt-7"
        >
          Done
        </button>
      </section>

      {/* ── Catering Inquiry Modal ─────────────────────────────────────────── */}
      <section
        id="cateringModal"
        className={`commerce-modal ${cateringModalOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cateringTitle"
        aria-hidden={!cateringModalOpen}
      >
        <div className="commerce-panel-header">
          <div>
            <p className="commerce-kicker">Event Inquiry</p>
            <h2 id="cateringTitle" className="font-nunito-black text-3xl text-gray-900">Book Event</h2>
          </div>
          <button
            type="button"
            className="icon-close"
            onClick={() => setCateringModalOpen(false)}
            aria-label="Close form"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {activeCateringMenu && (
          <form id="cateringForm" className="commerce-form" onSubmit={handleCateringSubmit} noValidate>
            <div className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200 form-full">
              <p className="text-sm text-gray-600">Selected Menu:</p>
              <p id="cateringModalMenuName" className="font-nunito-bold text-lg text-gray-900">
                {activeCateringMenu.title}
              </p>
              <p id="cateringModalGuestCount" className="text-[#af0202] font-nunito-bold text-sm mt-1">
                {guestCounts[activeCateringMenu.id] || 30} Guests
              </p>
            </div>

            <label>
              Full Name
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                value={cateringName}
                onChange={(e) => setCateringName(e.target.value)}
              />
            </label>
            <label>
              Mobile number
              <input
                type="tel"
                name="phone"
                required
                placeholder="01XXXXXXXXX"
                value={cateringPhone}
                onChange={(e) => setCateringPhone(e.target.value)}
              />
            </label>
            <label>
              Event Date &amp; Time
              <input
                type="datetime-local"
                name="event_date"
                required
                value={cateringDate}
                onChange={(e) => setCateringDate(e.target.value)}
              />
            </label>
            <label>
              Venue Address in Chattogram
              <input
                type="text"
                name="venue"
                required
                placeholder="Chattogram event venue"
                value={cateringVenue}
                onChange={(e) => setCateringVenue(e.target.value)}
              />
            </label>
            <label className="form-full">
              Notes
              <textarea
                name="notes"
                placeholder="Special requirements (optional)"
                value={cateringNotes}
                onChange={(e) => setCateringNotes(e.target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={cateringSubmitting}
              className="clay-btn-red form-full mt-2"
            >
              {cateringSubmitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </section>

      {/* ── Toast Notification ─────────────────────────────────────────────── */}
      {toastMessage && (
        <div
          id="toast"
          className="commerce-toast fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-nunito-bold shadow-2xl z-[300] border border-white/20 animate-in fade-in slide-in-from-bottom"
          role="status"
          aria-live="polite"
        >
          {toastMessage}
        </div>
      )}
    </>
  );
}
