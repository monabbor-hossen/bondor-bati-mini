<!-- Mobile Menu Overlay -->
<div id="mobileMenu"
    class="fixed inset-0 bg-white/95 backdrop-blur-xl z-[90] flex flex-col items-center justify-center gap-6 opacity-0 pointer-events-none invisible transform -translate-y-4 transition-all duration-300 ease-in-out lg:hidden">
    <img src="assets/logo.png" alt="Bondor Bati" class="h-16 w-auto object-contain mb-6" />
    <a href="/" class="mobile-menu-item" data-section="home">Home</a>
    <a href="<?= $isHome ? '#menu' : '/#menu' ?>" class="mobile-menu-item" data-section="menu">Menu</a>
    <a href="<?= $isHome ? '#about' : '/#about' ?>" class="mobile-menu-item" data-section="about">Our Story</a>
    <a href="<?= $isHome ? '#contact' : '/#contact' ?>" class="mobile-menu-item" data-section="contact">Contact Us</a>
    <a href="<?= $isHome ? '#menu' : '/#menu' ?>"
        class="clay-btn-red text-center px-8 py-3.5 text-lg font-nunito-bold tracking-wide mt-6 w-4/5 max-w-[280px] text-white mobile-menu-btn"
        style="text-decoration: none;">Order Now</a>
</div>
