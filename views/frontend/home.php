<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bondor Bati - Chittagong Heritage Cuisine</title>
    <meta name="csrf-token" content="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8') ?>">
    <meta name="description" content="Order Chittagong heritage meals from Bondor Bati for delivery in Chattogram. Daily tiffin service and event catering.">

    <!-- Tailwind CSS -->
    <script src="assets/js/tailwindcss.js"></script>

    <link rel="stylesheet" href="style.css">

    </head>

<body class="bg-white text-gray-900">

    <!-- Top Bar Notification -->
    <div class="fixed top-0 left-0 w-full bg-[#af0202] text-white text-[13px] font-nunito-bold py-1.5 z-[110] flex overflow-hidden shadow-md border-b border-white/10 h-7">
        <div class="flex whitespace-nowrap animate-marquee w-max" id="topMarquee">
            <div class="flex items-center px-4">
                <span class="mx-4">⏰ Order Cut-off Time: 10:00 PM for Next Day Lunch</span>
                <span class="mx-4 text-white/50">•</span>
                <span class="mx-4">🚚 Serving specific delivery zones in Dhaka</span>
                <span class="mx-4 text-white/50">•</span>
            </div>
        </div>
    </div>
    
    <!-- Global Fixed Navbar -->
    <nav id="mainNavbar" class="fixed top-7 left-0 right-0 z-[100] w-full">
        <div id="navbarInner"
            class="flex justify-between items-center py-3 px-4 sm:py-5 sm:px-6 md:py-8 lg:py-10 md:px-[30px] lg:px-[150px] max-w-[1600px] mx-auto w-full">
            <div class="relative z-[60]">
                <img id="navLogo" src="assets/logo.png" alt="Bondor Bati" class="h-10 sm:h-12 md:h-16 w-auto object-contain" />
            </div>

            <!-- Desktop Menu (Clay Style) -->
            <div class="hidden lg:flex nav-pill items-center gap-3 px-5 py-2.5">
                <a href="#" class="nav-item-active">Home</a>
                <a href="#menu" class="nav-item">Menu</a>
                <a href="#about" class="nav-item">Our Story</a>
                <a href="#contact" class="nav-item">Contact Us</a>
                <button id="cartButton" type="button" aria-label="Open shopping cart"
                    class="relative ml-3 cursor-pointer group flex items-center justify-center w-9 h-9 bg-[#1a1a1d] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5),_0px_1px_1px_rgba(255,255,255,0.05)] hover:bg-[#25252a] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="text-[#b5b5b5] group-hover:text-white transition-colors">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span id="cartCount"
                        class="absolute -top-1 -right-1 bg-[#ff5757] text-white text-[10px] font-nunito-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#1d1d20]">0</span>
                </button>
            </div>

            <button id="mobileMenuBtn"
                class="lg:hidden relative z-[60] p-2 sm:p-3 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-full border border-gray-200 shadow-sm text-gray-700 hover:text-[#af0202] hover:bg-gray-50 active:scale-95 transition-all duration-300 focus:outline-none">
                <svg id="menuIcon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
                <svg id="closeIcon" class="hidden absolute" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                </svg>
            </button>
        </div>
    </nav>

    <div
        class="min-h-screen w-full flex flex-col relative px-3 sm:px-6 md:px-10 lg:px-[100px] pb-8 max-w-[1600px] mx-auto mt-6 sm:mt-4">

        <!-- Dashboard card container to match the reference image style -->
        <div class="dashboard-container w-full flex flex-col relative mb-12 sm:mb-16 mt-2 sm:mt-6 overflow-hidden">

            <div id="mobileMenu"
                class="fixed inset-0 bg-white/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center gap-6 opacity-0 pointer-events-none invisible transform -translate-y-4 transition-all duration-300 ease-in-out lg:hidden">
                <img src="assets/logo.png" alt="Bondor Bati" class="h-16 w-auto object-contain mb-6" />
                <a href="#" class="mobile-menu-item mobile-menu-active">Home</a>
                <a href="#menu" class="mobile-menu-item">Menu</a>
                <a href="#about" class="mobile-menu-item">Our Story</a>
                <a href="#contact" class="mobile-menu-item">Contact Us</a>
                <a href="#menu"
                    class="clay-btn-red text-center px-8 py-3.5 text-lg font-nunito-bold tracking-wide mt-6 w-4/5 max-w-[280px] text-white"
                    style="text-decoration: none;">Order Now</a>
            </div>

            <!-- হিরো সেকশন -->
            <main
                class="flex flex-col lg:flex-row items-center justify-between relative z-10 gap-6 sm:gap-10 lg:gap-0 mt-2 md:mt-0 pt-14 sm:pt-18 md:pt-22 pb-4 md:pb-8 px-2 sm:px-6 md:px-10 min-h-0">
                <div
                    class="w-full lg:w-3/6 flex flex-col items-center lg:items-start justify-center text-center lg:text-left h-full reveal-left">
                    <h1
                        class="font-nunito-black text-3xl sm:text-5xl lg:text-[72px] xl:text-[82px] leading-[1.08] lg:leading-[1.1] text-gray-900 mb-2.5 sm:mb-4 z-20 relative">
                        <span class="block">Bondor Bati</span>
                        <span class="block text-2xl sm:text-4xl lg:text-[54px] xl:text-[64px] text-[#af0202] mt-0.5 sm:mt-1">Catering Service</span>
                    </h1>
                    <p
                        class="text-gray-600 text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 lg:mb-10 font-medium max-w-sm sm:max-w-md lg:max-w-none px-2 lg:px-0 tracking-wide">
                        Chittagong Heritage Cuisine. Delivered.
                    </p>
                    <div
                        class="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-5 w-full max-w-[340px] sm:max-w-none sm:w-auto px-0">
                        <button id="heroOrderButton"
                            class="btn-hero-primary flex-1 sm:flex-initial px-5 py-3 sm:px-10 sm:py-4 text-sm sm:text-lg tracking-wide">
                            Order Now
                        </button>
                        <button id="heroMenuButton"
                            class="btn-hero-secondary flex-1 sm:flex-initial px-5 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base tracking-wide">
                            View Menu
                        </button>
                    </div>
                </div>

                <!-- ডান দিকের মিনিমালিস্ট ইমেজ -->
                <div class="w-full lg:w-3/6 flex justify-center items-center relative h-[300px] sm:h-[400px] lg:h-[580px] reveal-right mt-6 lg:mt-0">
                    <img class="w-full h-full max-w-[500px] object-cover rounded-full shadow-2xl border border-gray-100 animate-float-dynamic" src="./assets/minimal_hero.jpg" alt="Minimalist Meal" />
                </div>
            </main>

        </div> <!-- Closing dashboard-container -->

        <section id="about" class="w-full max-w-6xl mx-auto mb-8 px-2 sm:px-6 lg:px-0 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center scroll-reveal">
            <div class="minimal-card !p-2 sm:!p-3 overflow-hidden min-h-[240px] sm:min-h-[320px]">
                <img src="assets/minimal_hero.jpg" alt="Bondor Bati Catering Service" class="w-full h-[240px] sm:h-[320px] object-cover rounded-2xl">
            </div>
            <div class="px-2 sm:px-4 md:px-8 py-4 sm:py-6">
                <p class="commerce-kicker text-[#af0202]">Catering Service</p>
                <h2 class="font-nunito-black text-2xl sm:text-4xl md:text-5xl text-gray-900 mb-3 sm:mb-5">Good Food Brings People Together.</h2>
                <p class="text-gray-600 text-sm sm:text-base leading-6 sm:leading-7 mb-3 sm:mb-4"><strong>Bondor Bati Catering Service</strong> brings the generous, deeply spiced cooking of Chittagong to your everyday lunch table and your grandest events. We ensure <em>Traditional Food, Authentic Taste, and it is Always Special.</em></p>
                <p class="text-gray-600 text-sm sm:text-base leading-6 sm:leading-7">Choose our Weekly Tiffin for daily meals, or explore our extensive Event Catering menus for bulk orders. Let us handle the food, so you can focus on the memories.</p>
            </div>
        </section>


        <!-- ========================================== -->
        <!-- Service Section (Tiffin & Catering)        -->
        <!-- ========================================== -->
        <section class="mt-14 sm:mt-24 lg:mt-32 mb-10 relative z-10 flex flex-col items-center w-full px-2" id="menu">
            
            <!-- Service Toggle -->
            <div class="service-toggle-container scroll-reveal">
                <div class="service-toggle-slider" id="serviceSlider"></div>
                <div class="service-toggle-btn active" id="btnTiffin" onclick="switchService('tiffin')">Weekly Tiffin</div>
                <div class="service-toggle-btn" id="btnCatering" onclick="switchService('catering')">Event Catering</div>
            </div>

            <!-- Tiffin Section -->
            <div id="tiffinSection" class="w-full flex flex-col items-center transition-opacity duration-300">
                <h2 class="font-nunito-black text-3xl sm:text-5xl md:text-[60px] text-gray-900 mb-6 sm:mb-12 text-center scroll-reveal">
                    Weekly Menu
                </h2>

            
                <div class="bg-gray-100 text-black px-6 py-3 rounded-full mb-10 font-nunito-bold flex items-center gap-2 scroll-reveal border border-gray-200 shadow-md">
                    <svg class="text-[#CC0000]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Minimum Order Quantity: 10 Pcs
                </div>

            <!-- Day Selector Tabs -->
            <div
                class="flex items-center justify-center w-full max-w-4xl px-2 gap-2 md:gap-4 mb-10 py-6 scroll-reveal delay-200">
                <button id="prevDayBtn"
                    class="clay-tab !p-3 flex-shrink-0 flex items-center justify-center rounded-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>

                <div class="flex items-center gap-2 md:gap-5 overflow-x-auto hide-scrollbar px-8 py-8"
                    id="dayTabsContainer">
                    <button class="day-tab clay-tab clay-tab-active" data-index="0">শনি</button>
                    <button class="day-tab clay-tab" data-index="1">রবি</button>
                    <button class="day-tab clay-tab" data-index="2">সোম</button>
                    <button class="day-tab clay-tab" data-index="3">মঙ্গল</button>
                    <button class="day-tab clay-tab" data-index="4">বুধ</button>
                    <button class="day-tab clay-tab" data-index="5">বৃহস্পতি</button>
                </div>

                <button id="nextDayBtn"
                    class="clay-tab !p-3 flex-shrink-0 flex items-center justify-center rounded-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            </div>

            <!-- 2 Cards Display Container -->
            <div id="menuCardsContainer" class="w-full max-w-6xl mx-auto px-2 md:px-6 relative min-h-[500px]" aria-live="polite">

                <!-- Saturday (Day 0) -->
                <div class="day-content grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 fade-in" data-content="0">
                    <!-- Standard -->
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-[#af0202]/20 hover:border-[#af0202]/50 scroll-reveal delay-100">
                        <div
                            class="absolute -top-4 right-4 bg-[#8e1515] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(142,21,21,0.5)] border border-[#ff6b6b]/50">
                            Standard - ১৩৫ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative">
                            <span class="text-6xl animate-float">🍗</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-white mb-4 text-center">সোনালী মুরগি ভুনা</h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট),
                            সোনালী মুরগি ভুনা, ভর্তা/ভাজি, ঘন ডাল, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-red mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="1">Add Standard</button>
                    </div>
                    <!-- Premium -->
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-yellow-600/20 hover:border-yellow-600/50 scroll-reveal delay-300">
                        <div
                            class="absolute -top-4 right-4 bg-[#966f14] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(150,111,20,0.5)] border border-yellow-400/50">
                            Premium - ১৮০ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative">
                            <span class="text-6xl animate-float">🍗</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-yellow-500 mb-4 text-center">সোনালী মুরগি ভুনা
                            (Special)</h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট),
                            সোনালী মুরগি ভুনা, ভর্তা, ভাজি, ডাল ভুনা, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-yellow mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="2">Add Premium</button>
                    </div>
                </div>

                <!-- Sunday (Day 1) -->
                <div class="day-content hidden grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12" data-content="1">
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-[#af0202]/20 hover:border-[#af0202]/50">
                        <div
                            class="absolute -top-4 right-4 bg-[#8e1515] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(142,21,21,0.5)] border border-[#ff6b6b]/50">
                            Standard - ১৩৫ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative">
                            <span class="text-6xl animate-float">🐟</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-white mb-4 text-center">রুই মাছের ভুনা</h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট), রুই
                            মাছের ভুনা, ভাজি/ভর্তা, ঘন ডাল, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-red mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="3">Add Standard</button>
                    </div>
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-yellow-600/20 hover:border-yellow-600/50">
                        <div
                            class="absolute -top-4 right-4 bg-[#966f14] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(150,111,20,0.5)] border border-yellow-400/50">
                            Premium - ১৮০ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative">
                            <span class="text-6xl animate-float">🐟</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-yellow-500 mb-4 text-center">রুই মাছের ভুনা
                            (Special)</h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট), রুই
                            মাছের ভুনা, ভাজি, ভর্তা, ডাল ভুনা, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-yellow mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="4">Add Premium</button>
                    </div>
                </div>

                <!-- Monday (Day 2) -->
                <div class="day-content hidden grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12" data-content="2">
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-[#af0202]/20 hover:border-[#af0202]/50">
                        <div
                            class="absolute -top-4 right-4 bg-[#8e1515] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(142,21,21,0.5)] border border-[#ff6b6b]/50">
                            Standard - ১৩৫ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative">
                            <span class="text-6xl animate-float">🍗</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-white mb-4 text-center">সোনালি মুরগির ভুনা</h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট),
                            সোনালি মুরগির ভুনা, ভাজি/ভর্তা, ঘন ডাল, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-red mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="5">Add Standard</button>
                    </div>
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-yellow-600/20 hover:border-yellow-600/50">
                        <div
                            class="absolute -top-4 right-4 bg-[#966f14] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(150,111,20,0.5)] border border-yellow-400/50">
                            Premium - ১৮০ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative">
                            <span class="text-6xl animate-float">🍗</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-yellow-500 mb-4 text-center">সোনালি মুরগির ভুনা
                            (Special)</h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট),
                            সোনালি মুরগির ভুনা, ভাজি, ভর্তা, ডাল ভুনা, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-yellow mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="6">Add Premium</button>
                    </div>
                </div>

                <!-- Tuesday (Day 3) -->
                <div class="day-content hidden grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12" data-content="3">
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-[#af0202]/20 hover:border-[#af0202]/50">
                        <div
                            class="absolute -top-4 right-4 bg-[#8e1515] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(142,21,21,0.5)] border border-[#ff6b6b]/50">
                            Standard - ১৩৫ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative">
                            <span class="text-6xl animate-float">🐠</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-white mb-4 text-center">তেলাপিয়া মাছের ভুনা</h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট), বড়
                            তেলাপিয়া মাছের ভুনা, ভর্তা/ভাজি, ঘন ডাল, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-red mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="7">Add Standard</button>
                    </div>
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-yellow-600/20 hover:border-yellow-600/50">
                        <div
                            class="absolute -top-4 right-4 bg-[#966f14] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(150,111,20,0.5)] border border-yellow-400/50">
                            Premium - ১৮০ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative">
                            <span class="text-6xl animate-float">🐠</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-yellow-500 mb-4 text-center">পাবদা মাছের ভুনা
                        </h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট), পাবদা
                            মাছের ভুনা, ভর্তা, ভাজি, ডাল ভুনা, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-yellow mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="8">Add Premium</button>
                    </div>
                </div>

                <!-- Wednesday (Day 4) -->
                <div class="day-content hidden grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12" data-content="4">
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-[#af0202]/20 hover:border-[#af0202]/50">
                        <div
                            class="absolute -top-4 right-4 bg-[#8e1515] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(142,21,21,0.5)] border border-[#ff6b6b]/50">
                            Standard - ১৩৫ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative">
                            <span class="text-6xl animate-float">🍲</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-white mb-4 text-center">রুই মাছের ডিমের ভুনা</h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট), রুই
                            মাছের ডিমের ভুনা, ভর্তা/ভাজি, ঘন ডাল, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-red mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="9">Add Standard</button>
                    </div>
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-yellow-600/20 hover:border-yellow-600/50">
                        <div
                            class="absolute -top-4 right-4 bg-[#966f14] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(150,111,20,0.5)] border border-yellow-400/50">
                            Premium - ১৮০ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative">
                            <span class="text-6xl animate-float">🍲</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-yellow-500 mb-4 text-center">রুই মাছের ডিমের ভুনা
                            (Special)</h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট), রুই
                            মাছের ডিমের ভুনা, ভর্তা, ভাজি, ডাল ভুনা, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-yellow mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="10">Add Premium</button>
                    </div>
                </div>

                <!-- Thursday (Day 5) -->
                <div class="day-content hidden grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12" data-content="5">
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-[#af0202]/20 hover:border-[#af0202]/50">
                        <div
                            class="absolute -top-4 right-4 bg-[#8e1515] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(142,21,21,0.5)] border border-[#ff6b6b]/50">
                            Standard - ১৩৫ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative">
                            <span class="text-6xl animate-float">🥩</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-white mb-4 text-center">মেজবানি গরুর মাংস</h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট),
                            মেজবানি গরুর মাংস বা সোনালি মুরগির ভুনা, ঘন ডাল, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-red mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="11">Add Standard</button>
                    </div>
                    <div
                        class="clay-card p-8 flex flex-col items-center relative w-full border border-yellow-600/20 hover:border-yellow-600/50">
                        <div
                            class="absolute -top-4 right-4 bg-[#966f14] text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(150,111,20,0.5)] border border-yellow-400/50">
                            Premium - ১৮০ ৳</div>
                        <div
                            class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative border-[#ff6b6b]/50">
                            <span class="text-6xl animate-float">🥩</span>
                        </div>
                        <h3 class="font-nunito-extrabold text-2xl text-yellow-500 mb-4 text-center">মেজবানি গরুর মাংস
                            (Special)</h3>
                        <p class="text-[#a0a0a5] text-[15px] text-center mb-8 h-12 leading-relaxed">ভাত (মিনিকেট),
                            মেজবানি গরুর মাংস বা সোনালি মুরগির ভুনা, ডাল ভুনা, সালাদ।</p>
                        
                        
                        <button type="button" class="clay-btn-yellow mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="12">Add Premium</button>
                    </div>
                </div>

            </div> <!-- End menuCardsContainer -->
            
            </div> <!-- End tiffinSection -->

            <!-- Catering Section -->
            <div id="cateringSection" class="w-full hidden flex-col items-center transition-opacity duration-300">
                <h2 class="font-nunito-black text-5xl md:text-[60px] text-gray-900 mb-6 text-center scroll-reveal">
                    Event Catering
                </h2>
                
                <div class="bg-gray-100 text-black px-6 py-3 rounded-full mb-10 font-nunito-bold flex items-center gap-2 scroll-reveal border border-gray-200 shadow-md">
                    <svg class="text-[#CC0000]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Minimum Order Quantity: 30 Pcs
                </div>

                <div class="flex items-center gap-3 overflow-x-auto hide-scrollbar px-4 max-w-5xl mb-12 w-full scroll-reveal">
                    <button class="catering-filter-btn active" onclick="filterCatering('all', this)">All Menus</button>
                    <button class="catering-filter-btn" onclick="filterCatering('regular', this)">Regular Menu</button>
                    <button class="catering-filter-btn" onclick="filterCatering('premium', this)">Premium Menu</button>
                    <button class="catering-filter-btn" onclick="filterCatering('holud', this)">Holud Special</button>
                    <button class="catering-filter-btn" onclick="filterCatering('bride', this)">Bride Menu</button>
                    <button class="catering-filter-btn" onclick="filterCatering('box', this)">Box Menu</button>
                </div>

                <div class="w-full max-w-6xl mx-auto px-2 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10" id="cateringGrid">
                    
                    <?php foreach ($cateringMenus as $index => $m): 
                        $delay = ($index % 3) * 100;
                        $btnClass = ($m['category'] === 'premium' || $m['category'] === 'bride') ? 'clay-btn-yellow' : 'clay-btn-red';
                        if ($m['badge_text'] === 'EXCLUSIVE 7') {
                            $btnClass = 'clay-btn-red !bg-[#cc5500] !border-[#ffa500]/50 hover:!bg-[#e65c00]';
                        }
                        
                        $badgeBg = ($m['category'] === 'premium' || $m['category'] === 'bride') ? 'bg-[#966f14]' : 'bg-[#8e1515]';
                        if ($m['badge_text'] === 'EXCLUSIVE 7') {
                            $badgeBg = 'bg-[#cc5500]';
                        }
                        
                        $borderColor = ($m['category'] === 'premium' || $m['category'] === 'bride') ? 'border-yellow-600/20' : 'border-[#af0202]/20';
                        if ($m['badge_text'] === 'EXCLUSIVE 7') {
                            $borderColor = 'border-[#ff8c00]/40';
                        }
                        
                        $titleColor = ($m['category'] === 'premium' || $m['category'] === 'bride') ? 'text-[#af0202]' : 'text-gray-900';
                        if ($m['badge_text'] === 'EXCLUSIVE 7') {
                            $titleColor = 'text-[#af0202]';
                        }
                        
                        $itemsList = array_filter(array_map('trim', explode("\n", $m['items'])));
                    ?>
                    <!-- MENU ITEM -->
                    <div class="clay-card p-8 flex flex-col relative border <?= $borderColor ?> catering-item scroll-reveal <?= $delay > 0 ? "delay-{$delay}" : "" ?>" data-category="<?= htmlspecialchars($m['category'], ENT_QUOTES) ?>">
                        <div class="absolute -top-4 right-4 <?= $badgeBg ?> text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-lg border border-[#ff6b6b]/50"><?= htmlspecialchars($m['badge_text'], ENT_QUOTES) ?></div>
                        <h3 class="font-nunito-extrabold text-2xl <?= $titleColor ?> mb-4 mt-2"><?= htmlspecialchars($m['title'], ENT_QUOTES) ?></h3>
                        <ul class="text-gray-600 text-[14px] mb-6 space-y-2 flex-grow list-disc pl-5">
                            <?php foreach ($itemsList as $item): ?>
                                <li><?= htmlspecialchars($item, ENT_QUOTES) ?></li>
                            <?php endforeach; ?>
                        </ul>
                        <div class="flex items-center justify-between mt-auto mb-6">
                            <span class="text-gray-900 font-nunito-bold">Guests:</span>
                            <div class="qty-control">
                                <button type="button" class="qty-btn" onclick="updateCateringQty(this, -1)">−</button>
                                <input type="number" class="qty-input" value="30" min="30" readonly>
                                <button type="button" class="qty-btn" onclick="updateCateringQty(this, 1)">+</button>
                            </div>
                        </div>
                        <button class="<?= $btnClass ?> w-full" onclick="openCateringModal('<?= htmlspecialchars($m['badge_text'], ENT_QUOTES) ?>', this)">Book Event</button>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <!-- Success Stories Section -->
        <section class="w-full max-w-6xl mx-auto mb-24 mt-16 px-4 md:px-6">
            <div class="text-center mb-12 scroll-reveal">
                <p class="commerce-kicker text-[#af0202]">What our clients say</p>
                <h2 class="font-nunito-black text-4xl md:text-5xl text-gray-900">Success Stories</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Testimonial 1 -->
                <div class="testimonial-card scroll-reveal delay-100">
                    <div class="flex gap-1 mb-4 text-[#FFB347]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                    <p class="text-gray-600 text-[15px] italic mb-6 leading-relaxed">"The Bride Menu was an absolute hit at our wedding! The whole roasted lamb was cooked to perfection and the presentation was exactly what we wanted."</p>
                    <div class="flex items-center gap-3 mt-auto">
                        <div class="w-10 h-10 rounded-full bg-[#af0202] flex items-center justify-center text-white font-nunito-bold">S</div>
                        <div>
                            <h4 class="text-gray-900 font-nunito-bold text-sm">Sadia Rahman</h4>
                            <span class="text-gray-500 text-xs">Event Catering</span>
                        </div>
                    </div>
                </div>

                <!-- Testimonial 2 -->
                <div class="testimonial-card scroll-reveal delay-200">
                    <div class="flex gap-1 mb-4 text-[#FFB347]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                    <p class="text-[#a0a0a5] text-[15px] italic mb-6 leading-relaxed">"Bondor Bati's Weekly Tiffin feels like a warm hug from home. Authentic Chittagong flavors that I can enjoy at my office desk. Highly recommended!"</p>
                    <div class="flex items-center gap-3 mt-auto">
                        <div class="w-10 h-10 rounded-full bg-[#af0202] flex items-center justify-center text-white font-nunito-bold">T</div>
                        <div>
                            <h4 class="text-white font-nunito-bold text-sm">Tanvir Ahmed</h4>
                            <span class="text-[#777] text-xs">Weekly Tiffin</span>
                        </div>
                    </div>
                </div>

                <!-- Testimonial 3 -->
                <div class="testimonial-card scroll-reveal delay-300">
                    <div class="flex gap-1 mb-4 text-[#FFB347]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                    <p class="text-gray-600 text-[15px] italic mb-6 leading-relaxed">"Ordered the Box Menu for our corporate event (50 pax). Smooth delivery, hot food, and everyone loved the Kacchi Biriyani!"</p>
                    <div class="flex items-center gap-3 mt-auto">
                        <div class="w-10 h-10 rounded-full bg-[#af0202] flex items-center justify-center text-white font-nunito-bold">F</div>
                        <div>
                            <h4 class="text-gray-900 font-nunito-bold text-sm">Fahim Hasan</h4>
                            <span class="text-gray-500 text-xs">Bulk Order</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <!-- Contact / Footer Section -->
        <footer id="contact" class="mt-10 mb-12 relative z-10 w-full px-2 lg:px-6 flex flex-col items-center">
            <div class="w-full max-w-5xl bg-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl border border-gray-100 relative overflow-hidden reveal-scale">

                <div
                    class="absolute -bottom-20 -right-20 w-64 h-64 bg-gray-100 rounded-full border border-gray-200 pointer-events-none animate-spin-slow"
                    style="border-style: dashed;">
                </div>

                <div
                    class="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left flex-1 z-10">
                    <div class="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-[#af0202] shadow-sm flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-nunito-extrabold text-gray-900 text-xl mb-2">Our Locations</h4>
                        <p class="text-gray-600 text-[15px] leading-relaxed max-w-sm mb-1">
                            <strong class="text-gray-800">Chattogram City:</strong> Central Kitchen, GEC Circle, Chattogram.
                        </p>
                        <p class="text-gray-600 text-[15px] leading-relaxed max-w-sm">
                            <strong class="text-gray-800">Delivery:</strong> Serving specific delivery zones across Chattogram.
                        </p>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row items-center gap-6 z-10">
                    <div
                        class="flex flex-col items-center sm:items-start text-center sm:text-left border-r-0 sm:border-r border-gray-200 pr-0 sm:pr-6">
                        <span class="text-gray-600 text-sm font-medium mb-1">Call for Order / Booking</span>
                        <div class="flex flex-col gap-1">
                            <a href="tel:01713334025" class="font-nunito-black text-[#af0202] text-lg tracking-wide hover:text-[#8e0202] transition-colors">01713-334025</a>
                            <a href="tel:01713334048" class="font-nunito-black text-[#af0202] text-lg tracking-wide hover:text-[#8e0202] transition-colors">01713-334048</a>
                            <a href="tel:01600305444" class="font-nunito-black text-[#af0202] text-lg tracking-wide hover:text-[#8e0202] transition-colors">01600-305444</a>
                        </div>
                        <a href="mailto:iqbalcaterings23@gmail.com" class="text-gray-600 hover:text-gray-900 text-sm mt-3 transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            iqbalcaterings23@gmail.com
                        </a>
                    </div>

                    <div class="flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-2xl shadow-sm cursor-default hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-xl transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                            stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                            <path d="M15 18H9" />
                            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                            <circle cx="17" cy="18" r="2" />
                            <circle cx="7" cy="18" r="2" />
                        </svg>
                        <div class="flex flex-col text-left">
                            <span class="font-nunito-black text-gray-900 text-lg uppercase leading-none mb-0.5">Free</span>
                            <span
                                class="font-nunito-bold text-[#af0202] text-xs uppercase tracking-[0.2em] leading-none">Delivery</span>
                        </div>
                    </div>
                </div>
            </div>

            <button id="trackOrderButton" type="button"
                class="mt-7 text-[#af0202] hover:text-[#8e0202] font-nunito-bold transition-colors underline underline-offset-4">
                Track an existing order
            </button>

            <div class="mt-8 text-center text-gray-500 text-sm font-medium mb-4">
                © 2026 Bondor Bati. Chittagong Heritage Cuisine.
            </div>
        </footer>

    </div>

    <button id="mobileCartButton" type="button" class="mobile-cart-button lg:hidden" aria-label="Open shopping cart">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <span id="mobileCartCount">0</span>
    </button>

    <div id="uiBackdrop" class="commerce-backdrop" aria-hidden="true"></div>

    <aside id="cartDrawer" class="cart-drawer" aria-labelledby="cartTitle" aria-hidden="true">
        <div class="commerce-panel-header">
            <div>
                <p class="commerce-kicker">Your selection</p>
                <h2 id="cartTitle" class="font-nunito-black text-3xl text-gray-900">Order cart</h2>
            </div>
            <button type="button" class="icon-close" data-close-ui aria-label="Close cart"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        <div id="cartItems" class="cart-items" aria-live="polite"></div>
        <div class="cart-summary">
            <div class="flex justify-between text-gray-600"><span>Subtotal</span><strong id="cartSubtotal">৳0</strong></div>
            <div class="flex justify-between text-gray-600"><span>Delivery</span><strong class="text-[#78B13F]">Free</strong></div>
            <div class="flex justify-between text-gray-900 text-xl pt-4 border-t border-gray-200"><span>Total</span><strong id="cartTotal">৳0</strong></div>
            <button id="checkoutButton" type="button" class="clay-btn-red w-full mt-5">Continue to checkout</button>
            <p class="text-xs text-gray-500 text-center mt-3">Cash on delivery · Order confirmation by phone</p>
        </div>
    </aside>

    <section id="checkoutModal" class="commerce-modal" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle" aria-hidden="true">
        <div class="commerce-panel-header">
            <div>
                <p class="commerce-kicker">Free delivery</p>
                <h2 id="checkoutTitle" class="font-nunito-black text-3xl text-gray-900">Checkout</h2>
            </div>
            <button type="button" class="icon-close" data-close-ui aria-label="Close checkout"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        <form id="checkoutForm" class="commerce-form" novalidate>
            <label>Full name<input name="customer_name" type="text" autocomplete="name" minlength="2" maxlength="100" required placeholder="Your name"></label>
            <label>Mobile number<input name="phone" type="tel" autocomplete="tel" required placeholder="01XXXXXXXXX" pattern="(?:\+?88)?01[3-9][0-9]{8}"></label>
            <label class="form-full">Delivery address<textarea name="address" autocomplete="street-address" minlength="10" maxlength="500" required placeholder="House, road, area, Chattogram"></textarea></label>
            <label>Start / Delivery date<input id="deliveryDate" name="delivery_date" type="date" required></label>
            <label>Subscription Plan
                <select name="plan_days" id="checkoutPlan">
                    <option value="1">1 Day (Single Order)</option>
                    <option value="7">7-Day Plan</option>
                    <option value="15">15-Day Plan</option>
                    <option value="30">30-Day Plan</option>
                </select>
            </label>
            <label>Payment<input value="Cash on delivery" readonly aria-label="Payment method"></label>
            <label class="form-full">Order note (optional)<textarea name="notes" maxlength="500" placeholder="Landmark or delivery instructions"></textarea></label>
            <p id="checkoutError" class="form-error form-full" role="alert"></p>
            <button id="placeOrderButton" type="submit" class="clay-btn-red form-full">Place order</button>
        </form>
    </section>

    <section id="trackingModal" class="commerce-modal compact-modal" role="dialog" aria-modal="true" aria-labelledby="trackingTitle" aria-hidden="true">
        <div class="commerce-panel-header">
            <div>
                <p class="commerce-kicker">Live from our kitchen</p>
                <h2 id="trackingTitle" class="font-nunito-black text-3xl text-gray-900">Track order</h2>
            </div>
            <button type="button" class="icon-close" data-close-ui aria-label="Close tracking"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        <form id="trackingForm" class="commerce-form">
            <label>Order number<input name="order_number" required placeholder="BB-260817-ABC123"></label>
            <label>Mobile number<input name="phone" type="tel" required placeholder="01XXXXXXXXX"></label>
            <p id="trackingError" class="form-error form-full" role="alert"></p>
            <button type="submit" class="clay-btn-red form-full">Find my order</button>
        </form>
        <div id="trackingResult" class="tracking-result" hidden></div>
    </section>

    <section id="confirmationModal" class="commerce-modal compact-modal text-center" role="dialog" aria-modal="true" aria-labelledby="confirmationTitle" aria-hidden="true">
        <div class="confirmation-mark">✓</div>
        <p class="commerce-kicker">Order received</p>
        <h2 id="confirmationTitle" class="font-nunito-black text-3xl text-gray-900 mb-3">Thank you!</h2>
        <div id="confirmationContent" class="text-gray-600"></div>
        <button type="button" class="clay-btn-red w-full mt-7" data-close-ui>Done</button>
    </section>

    <!-- Catering Modal -->
    <section id="cateringModal" class="commerce-modal" role="dialog" aria-modal="true" aria-labelledby="cateringTitle" aria-hidden="true">
        <div class="commerce-panel-header">
            <div>
                <p class="commerce-kicker">Event Inquiry</p>
                <h2 id="cateringTitle" class="font-nunito-black text-3xl text-gray-900">Book Event</h2>
            </div>
            <button type="button" class="icon-close" data-close-ui aria-label="Close form"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        <form id="cateringForm" class="commerce-form" novalidate onsubmit="submitCateringForm(event)">
            <input type="hidden" id="cateringMenuName" name="menu_name">
            <input type="hidden" id="cateringGuestCount" name="guest_count">
            <div class="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p class="text-sm text-gray-600">Selected Menu:</p>
                <p id="cateringModalMenuName" class="font-nunito-bold text-lg text-gray-900">Menu</p>
                <p id="cateringModalGuestCount" class="text-[#af0202] font-nunito-bold text-sm mt-1">30 Guests</p>
            </div>
            <label>Full Name<input type="text" name="name" required placeholder="Your name"></label>
            <label>Mobile number<input type="tel" name="phone" required placeholder="01XXXXXXXXX"></label>
            <label>Event Date & Time<input type="datetime-local" name="event_date" required></label>
            <label>Venue Address in Chattogram<input type="text" name="venue" required placeholder="Chattogram event venue"></label>
            <label class="form-full">Notes<textarea name="notes" placeholder="Special requirements (optional)"></textarea></label>
            <button type="submit" class="clay-btn-red form-full mt-2">Submit Inquiry</button>
        </form>
    </section>

    <div id="toast" class="commerce-toast" role="status" aria-live="polite"></div>
    <script src="script.js"></script>
</body>

</html>
