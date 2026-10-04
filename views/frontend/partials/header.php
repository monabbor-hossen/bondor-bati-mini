
<?php
/**
 * Frontend Header Partial
 * Variables expected before include:
 *   $pageTitle, $pageDescription, $currentPage
 */
$pageTitle       = $pageTitle       ?? 'Bondor Bati - Chittagong Heritage Cuisine';
$pageDescription = $pageDescription ?? 'Order Chittagong heritage meals from Bondor Bati. Daily tiffin & event catering.';
$currentPage     = $currentPage     ?? 'home';
$isHome          = $currentPage === 'home';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <meta name="csrf-token" content="<?= htmlspecialchars($_SESSION['csrf_token'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
    <meta name="description" content="<?= htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8') ?>">
    <script src="assets/js/tailwindcss.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-white text-gray-900">

    <!-- Top Marquee Notification Bar -->
    <div class="fixed top-0 left-0 w-full bg-[#af0202] text-white text-[13px] font-nunito-bold py-1.5 z-[110] flex overflow-hidden shadow-md border-b border-white/10 h-7">
        <div class="flex whitespace-nowrap animate-marquee w-max" id="topMarquee">
            <div class="flex items-center px-4">
                <span class="mx-4">&#9200; Order Cut-off Time: 10:00 PM for Next Day Lunch</span>
                <span class="mx-4 text-white/50">&bull;</span>
                <span class="mx-4">&#x1F69A; Serving specific delivery zones in Dhaka</span>
                <span class="mx-4 text-white/50">&bull;</span>
                <span class="mx-4">&#x1F371; Authentic Chittagong Heritage Cuisine</span>
                <span class="mx-4 text-white/50">&bull;</span>
            </div>
        </div>
    </div>

    <!-- Global Fixed Navbar -->
    <nav id="mainNavbar" class="fixed top-7 left-0 right-0 z-[100] w-full">
        <div id="navbarInner"
            class="flex justify-between items-center py-3 px-4 sm:py-5 sm:px-6 md:py-8 lg:py-10 md:px-[30px] lg:px-[150px] max-w-[1600px] mx-auto w-full">

            <div class="relative z-[60]">
                <a href="/"><img id="navLogo" src="assets/logo.png" alt="Bondor Bati" class="h-10 sm:h-12 md:h-16 w-auto object-contain" /></a>
            </div>

            <!-- Desktop Nav -->
            <div class="hidden lg:flex nav-pill items-center gap-3 px-5 py-2.5">
                <a href="/" class="nav-item" data-section="home" id="nav-home">Home</a>
                <a href="<?= $isHome ? '#menu'    : '/#menu'    ?>" class="nav-item" data-section="menu" id="nav-menu">Menu</a>
                <a href="<?= $isHome ? '#about'   : '/#about'   ?>" class="nav-item" data-section="about" id="nav-about">Our Story</a>
                <a href="<?= $isHome ? '#contact' : '/#contact' ?>" class="nav-item" data-section="contact" id="nav-contact">Contact Us</a>
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

            <!-- Mobile Hamburger -->
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

    <!-- Mobile Menu Overlay -->
    <?php require __DIR__ . '/mobile_menu.php'; ?>
