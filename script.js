document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'api/index.php';
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
    const dayToJsWeekday = [6, 0, 1, 2, 3, 4];
    const statusLabels = {
        pending: 'Pending confirmation', confirmed: 'Confirmed', preparing: 'Preparing',
        out_for_delivery: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled'
    };
    let menuDays = [];
    let menuItems = new Map();
    let currentDay = 0;
    let cart = readCart();
    let toastTimer;
    let checkoutKey = null;
    const byId = (id) => document.getElementById(id);
    const menuContainer = byId('menuCardsContainer');
    const tabs = [...document.querySelectorAll('.day-tab')];

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, (character) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        })[character]);
    }

    const money = (value) => `৳${Number(value).toLocaleString('en-BD')}`;
    const newCheckoutKey = () => globalThis.crypto?.randomUUID?.() || `bb-${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;

    async function api(path, options = {}) {
        const response = await fetch(`${API_BASE}/${path}`, {
            ...options,
            headers: {
                Accept: 'application/json',
                ...(options.body ? { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken } : {}),
                ...options.headers
            }
        });
        let payload = {};
        try { payload = await response.json(); }
        catch (_) { throw new Error('The server returned an unreadable response.'); }
        if (!response.ok) throw new Error(payload.message || 'Something went wrong.');
        return payload;
    }

    async function loadMenu() {
        menuContainer.innerHTML = '<div class="menu-loading"><div><span class="text-5xl">🍱</span><p class="mt-4">Loading this week’s menu…</p></div></div>';
        try {
            const payload = await api('menu');
            menuDays = payload.data;
            menuItems = new Map(menuDays.flatMap(day => day.items).map(item => [item.id, item]));
            reconcileCart();
            renderMenu();
            renderCart();
        } catch (error) {
            menuContainer.innerHTML = `<div class="menu-error"><div><p class="text-xl text-white font-nunito-bold">We couldn’t load the menu.</p><p class="mt-2">${escapeHtml(error.message)}</p><button id="retryMenu" class="clay-btn-red mt-6">Try again</button></div></div>`;
            byId('retryMenu')?.addEventListener('click', loadMenu);
        }
    }

    function renderMenu() {
        tabs.forEach((tab, index) => { if (menuDays[index]) tab.textContent = menuDays[index].day_name; });
        menuContainer.innerHTML = menuDays.map(day => `
            <div class="day-content ${day.day_index === currentDay ? '' : 'hidden'} grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 fade-in" data-content="${day.day_index}">
                ${day.items.map(item => menuCard(item)).join('')}
            </div>`).join('');
    }

    function menuCard(item) {
        const premium = item.tier === 'premium';
        return `<article class="clay-card p-8 flex flex-col items-center relative w-full border ${premium ? 'border-yellow-600/20 hover:border-yellow-600/50' : 'border-[#af0202]/20 hover:border-[#af0202]/50'}">
            <div class="absolute -top-4 right-4 ${premium ? 'bg-[#966f14] border-yellow-400/50' : 'bg-[#8e1515] border-[#ff6b6b]/50'} text-white text-sm font-nunito-black px-5 py-2 rounded-full shadow-lg border">${premium ? 'Premium' : 'Standard'} - ${money(item.price)}</div>
            <div class="plate-container w-40 h-40 rounded-full mb-8 flex items-center justify-center relative"><span class="text-6xl animate-float">${escapeHtml(item.emoji)}</span></div>
            <h3 class="font-nunito-extrabold text-2xl ${premium ? 'text-yellow-500' : 'text-white'} mb-4 text-center">${escapeHtml(item.name)}</h3>
            <p class="text-[#a0a0a5] text-[15px] text-center mb-8 min-h-12 leading-relaxed">${escapeHtml(item.description)}</p>
            <button type="button" class="${premium ? 'clay-btn-yellow' : 'clay-btn-red'} mt-auto w-4/5 text-lg py-3 rounded-[20px] add-to-cart" data-item-id="${item.id}">Add ${premium ? 'Premium' : 'Standard'}</button>
        </article>`;
    }

    function showDay(index) {
        if (!menuDays.length) return;
        currentDay = (index + menuDays.length) % menuDays.length;
        tabs.forEach((tab, tabIndex) => tab.classList.toggle('clay-tab-active', tabIndex === currentDay));
        document.querySelectorAll('#menuCardsContainer .day-content').forEach(content => content.classList.toggle('hidden', Number(content.dataset.content) !== currentDay));
        tabs[currentDay]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    function readCart() {
        try {
            const saved = JSON.parse(localStorage.getItem('bondor_bati_cart') || '[]');
            return Array.isArray(saved) ? saved.filter(line => Number.isInteger(line.itemId) && Number.isInteger(line.quantity)) : [];
        } catch (_) { return []; }
    }

    const saveCart = () => localStorage.setItem('bondor_bati_cart', JSON.stringify(cart));
    function reconcileCart() {
        cart = cart.filter(line => menuItems.has(line.itemId)).map(line => ({ itemId: line.itemId, quantity: Math.max(1, Math.min(20, line.quantity)), planDays: line.planDays || 1 }));
        saveCart();
    }

    function addToCart(itemId, qty = 1, planDays = 1) {
        const item = menuItems.get(itemId);
        if (!item) return;
        const cartDay = cart.length ? menuItems.get(cart[0].itemId)?.day_index : null;
        if (cartDay !== null && cartDay !== item.day_index) {
            if (!window.confirm('Your cart contains a meal for another delivery day. Clear it and add this meal instead?')) return;
            cart = [];
        }
        const existing = cart.find(line => line.itemId === itemId && line.planDays === planDays);
        if (existing) existing.quantity = Math.min(20, existing.quantity + qty);
        else cart.push({ itemId, quantity: qty, planDays });
        saveCart();
        renderCart();
        showToast(`${qty}× ${item.name} added to your cart`);
    }
    function updateQuantity(itemId, planDays, change) {
        const line = cart.find(item => item.itemId === itemId && item.planDays === planDays);
        if (!line) return;
        line.quantity += change;
        if (line.quantity <= 0) cart = cart.filter(item => !(item.itemId === itemId && item.planDays === planDays));
        else line.quantity = Math.min(20, line.quantity);
        saveCart();
        renderCart();
    }

    function renderCart() {
        const detailed = cart.map(line => ({ ...line, item: menuItems.get(line.itemId) })).filter(line => line.item);
        const quantity = detailed.reduce((sum, line) => sum + line.quantity, 0);
        const subtotal = detailed.reduce((sum, line) => sum + line.item.price * line.quantity * (line.planDays || 1), 0);
        if (byId('cartCount')) byId('cartCount').textContent = quantity;
        if (byId('mobileCartCount')) byId('mobileCartCount').textContent = quantity;
        byId('cartSubtotal').textContent = money(subtotal);
        byId('cartTotal').textContent = money(subtotal);
        byId('checkoutButton').disabled = detailed.length === 0;
        byId('checkoutButton').classList.toggle('opacity-50', detailed.length === 0);
        byId('cartItems').innerHTML = detailed.length ? detailed.map(({ item, quantity: lineQuantity, planDays }) => `
            <div class="cart-line"><div class="cart-line-emoji">${escapeHtml(item.emoji)}</div><div>
                <p class="font-nunito-bold text-white text-sm">${escapeHtml(item.name)}</p><p class="text-xs text-[#a98585] capitalize">${escapeHtml(item.tier)} · ${planDays > 1 ? planDays + '-Day Plan · ' : ''}${money(item.price)}/day</p>
                <div class="quantity-control"><button type="button" data-quantity="-1" data-item-id="${item.id}" data-plan="${planDays}" aria-label="Decrease quantity">−</button><span>${lineQuantity}</span><button type="button" data-quantity="1" data-item-id="${item.id}" data-plan="${planDays}" aria-label="Increase quantity">+</button></div>
                <button class="remove-cart-item" type="button" data-remove-item="${item.id}" data-plan="${planDays}">Remove</button></div><strong class="text-white">${money(item.price * lineQuantity * (planDays || 1))}</strong></div>`).join('')
            : '<div class="cart-empty"><div><span class="text-5xl">🍽️</span><p class="font-nunito-bold text-white mt-4">Your cart is empty</p><p class="text-sm mt-1">Choose a meal from the weekly menu.</p></div></div>';
    }

    function openUi(element) {
        closeUi(false);
        element.classList.add('is-open');
        element.setAttribute('aria-hidden', 'false');
        byId('uiBackdrop').classList.add('is-open');
        byId('uiBackdrop').setAttribute('aria-hidden', 'false');
        document.body.classList.add('commerce-locked');
        setTimeout(() => element.querySelector('button, input, textarea')?.focus(), 50);
    }

    function closeUi(unlock = true) {
        document.querySelectorAll('.cart-drawer, .commerce-modal').forEach(element => { element.classList.remove('is-open'); element.setAttribute('aria-hidden', 'true'); });
        if (unlock) {
            byId('uiBackdrop').classList.remove('is-open');
            byId('uiBackdrop').setAttribute('aria-hidden', 'true');
            document.body.classList.remove('commerce-locked');
        }
    }

    const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    function nextDeliveryDate(jsWeekday) {
        const date = new Date();
        date.setDate(date.getDate() + ((jsWeekday - date.getDay() + 7) % 7));
        return localDate(date);
    }

    function prepareCheckout() {
        if (!cart.length) return;
        const item = menuItems.get(cart[0].itemId);
        const input = byId('deliveryDate');
        const today = new Date();
        const max = new Date(today);
        max.setDate(max.getDate() + 14);
        input.min = localDate(today);
        input.max = localDate(max);
        input.value = nextDeliveryDate(dayToJsWeekday[item.day_index]);
        checkoutKey ||= newCheckoutKey();
        byId('checkoutError').textContent = '';
        openUi(byId('checkoutModal'));
    }

    async function submitCheckout(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        const button = byId('placeOrderButton');
        const errorBox = byId('checkoutError');
        errorBox.textContent = '';
        button.disabled = true;
        button.textContent = 'Placing order…';
        const data = Object.fromEntries(new FormData(form));
        try {
            const payload = await api('orders', { method: 'POST', body: JSON.stringify({
                ...data, items: cart.map(line => ({ item_id: line.itemId, quantity: line.quantity, plan_days: line.planDays || 1 })), idempotency_key: checkoutKey
            }) });
            cart = [];
            checkoutKey = null;
            saveCart();
            renderCart();
            form.reset();
            const order = payload.data;
            byId('confirmationContent').innerHTML = `<p>Your order number is</p><p class="font-nunito-black text-2xl text-white my-2">${escapeHtml(order.order_number)}</p><p>${money(order.total)} · Delivery on ${escapeHtml(order.delivery_date)}</p><p class="text-sm mt-4">We’ll call <strong class="text-white">${escapeHtml(order.phone)}</strong> to confirm.</p>`;
            openUi(byId('confirmationModal'));
        } catch (error) { errorBox.textContent = error.message; }
        finally { button.disabled = false; button.textContent = 'Place order'; }
    }

    async function submitTracking(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const errorBox = byId('trackingError');
        const result = byId('trackingResult');
        errorBox.textContent = '';
        result.hidden = true;
        try {
            const query = new URLSearchParams({ order_number: data.get('order_number'), phone: data.get('phone') });
            const order = (await api(`orders/track?${query}`)).data;
            result.innerHTML = `<div class="flex justify-between items-start gap-3 mb-4"><div><p class="text-xs">Order</p><strong class="text-white">${escapeHtml(order.order_number)}</strong></div><span class="status-pill">${escapeHtml(statusLabels[order.status] || order.status)}</span></div><div class="space-y-2 text-sm">${order.items.map(item => `<div class="flex justify-between gap-3"><span>${item.quantity}× ${escapeHtml(item.item_name)}</span><strong>${money(item.line_total)}</strong></div>`).join('')}</div><div class="flex justify-between text-white border-t border-white/10 mt-4 pt-4"><span>Total</span><strong>${money(order.total)}</strong></div><p class="text-xs mt-4">Delivery: ${escapeHtml(order.delivery_date)}</p>`;
            result.hidden = false;
        } catch (error) { errorBox.textContent = error.message; }
    }

    function showToast(message) {
        const toast = byId('toast');
        toast.textContent = message;
        toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
    }

    tabs.forEach((tab, index) => tab.addEventListener('click', () => showDay(index)));
    byId('prevDayBtn')?.addEventListener('click', () => showDay(currentDay - 1));
    byId('nextDayBtn')?.addEventListener('click', () => showDay(currentDay + 1));
    menuContainer.addEventListener('click', event => { 
        const button = event.target.closest('.add-to-cart'); 
        if (button) {
            const card = button.closest('.clay-card');
            const qtyInput = card ? card.querySelector('.qty-input') : null;
            const planSelect = card ? card.querySelector('select') : null;
            addToCart(Number(button.dataset.itemId), qtyInput ? parseInt(qtyInput.value) || 1 : 1, planSelect ? parseInt(planSelect.value) || 1 : 1); 
        }
    });
    byId('cartItems').addEventListener('click', event => {
        const quantityButton = event.target.closest('[data-quantity]');
        const removeButton = event.target.closest('[data-remove-item]');
        if (quantityButton) updateQuantity(Number(quantityButton.dataset.itemId), Number(quantityButton.dataset.plan) || 1, Number(quantityButton.dataset.quantity));
        if (removeButton) { cart = cart.filter(line => !(line.itemId === Number(removeButton.dataset.removeItem) && line.planDays === (Number(removeButton.dataset.plan)||1))); saveCart(); renderCart(); }
    });
    byId('cartButton')?.addEventListener('click', () => openUi(byId('cartDrawer')));
    byId('mobileCartButton')?.addEventListener('click', () => openUi(byId('cartDrawer')));
    byId('checkoutButton')?.addEventListener('click', prepareCheckout);
    byId('checkoutForm')?.addEventListener('submit', submitCheckout);
    byId('trackOrderButton')?.addEventListener('click', () => openUi(byId('trackingModal')));
    byId('trackingForm')?.addEventListener('submit', submitTracking);
    byId('uiBackdrop')?.addEventListener('click', () => closeUi());
    document.querySelectorAll('[data-close-ui]').forEach(button => button.addEventListener('click', () => closeUi()));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeUi(); });
    byId('heroOrderButton')?.addEventListener('click', () => byId('menu').scrollIntoView({ behavior: 'smooth' }));
    byId('heroMenuButton')?.addEventListener('click', () => byId('menu').scrollIntoView({ behavior: 'smooth' }));
    // Seed static menu items so the hardcoded HTML tiffin cards work
    // even while the API loads or if it's unavailable.
    const staticMenuItems = [
        { id: 1,  name: 'সোনালী মুরগি ভুনা',         emoji: '🍗', tier: 'standard', price: 135, day_index: 0 },
        { id: 2,  name: 'সোনালী মুরগি ভুনা (Special)', emoji: '🍗', tier: 'premium',  price: 180, day_index: 0 },
        { id: 3,  name: 'রুই মাছের ভুনা',             emoji: '🐟', tier: 'standard', price: 135, day_index: 1 },
        { id: 4,  name: 'রুই মাছের ভুনা (Special)',   emoji: '🐟', tier: 'premium',  price: 180, day_index: 1 },
        { id: 5,  name: 'সোনালি মুরগির ভুনা',         emoji: '🍗', tier: 'standard', price: 135, day_index: 2 },
        { id: 6,  name: 'সোনালি মুরগির ভুনা (Special)', emoji: '🍗', tier: 'premium', price: 180, day_index: 2 },
        { id: 7,  name: 'তেলাপিয়া মাছের ভুনা',       emoji: '🐠', tier: 'standard', price: 135, day_index: 3 },
        { id: 8,  name: 'পাবদা মাছের ভুনা',           emoji: '🐠', tier: 'premium',  price: 180, day_index: 3 },
        { id: 9,  name: 'রুই মাছের ডিমের ভুনা',       emoji: '🍲', tier: 'standard', price: 135, day_index: 4 },
        { id: 10, name: 'রুই মাছের ডিমের ভুনা (Special)', emoji: '🍲', tier: 'premium', price: 180, day_index: 4 },
        { id: 11, name: 'মেজবানি গরুর মাংস',          emoji: '🥩', tier: 'standard', price: 135, day_index: 5 },
        { id: 12, name: 'মেজবানি গরুর মাংস (Special)', emoji: '🥩', tier: 'premium',  price: 180, day_index: 5 },
    ];
    staticMenuItems.forEach(item => menuItems.set(item.id, item));

    renderCart();
    loadMenu();

    // Marquee: dynamically repeat content to fill wide screens
    const marquee = document.getElementById('topMarquee');
    if (marquee) marquee.innerHTML = marquee.innerHTML.repeat(8);

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.add('menu-open');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('menu-open');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    mobileMenuBtn?.addEventListener('click', toggleMenu);

    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (!link.classList.contains('clay-btn-red')) {
                    mobileMenu.querySelectorAll('a').forEach(l => l.classList.remove('mobile-menu-active'));
                    link.classList.add('mobile-menu-active');
                }
                isMenuOpen = false;
                mobileMenu.classList.remove('menu-open');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Scroll Reveal — Intersection Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach(el => revealObserver.observe(el));

    // Sticky Navbar
    const navbar = document.getElementById('mainNavbar');
    const heroSection = document.querySelector('.dashboard-container');
    function handleNavbarScroll() {
        const threshold = heroSection ? heroSection.offsetTop + heroSection.offsetHeight - 120 : 80;
        navbar?.classList.toggle('scrolled', window.scrollY > threshold);
    }
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // Custom Cursor & Magnetic Interactions
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.createElement('div');
        cursor.id = 'customCursor';
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            requestAnimationFrame(updateCursor);
        }
        requestAnimationFrame(updateCursor);

        const interactiveSelectors = 'button, a, .minimal-card, .clay-card, .catering-item, input, textarea, select';
        
        // Setup hover states
        const addCursorHover = (el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        };
        
        document.querySelectorAll(interactiveSelectors).forEach(addCursorHover);

        // Setup magnetic effect for primary/secondary buttons
        const addMagnetic = (btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                btn.style.boxShadow = `${8 - x*0.1}px ${8 - y*0.1}px 0 rgba(0,0,0,1)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.boxShadow = '';
            });
        };
        
        document.querySelectorAll('button').forEach(addMagnetic);

        // Observer for dynamically added elements (e.g. cart items, menu items)
        const mutObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.matches(interactiveSelectors)) addCursorHover(node);
                        node.querySelectorAll(interactiveSelectors).forEach(addCursorHover);
                        
                        if (node.matches('button')) addMagnetic(node);
                        node.querySelectorAll('button').forEach(addMagnetic);
                    }
                });
            });
        });
        mutObserver.observe(document.body, { childList: true, subtree: true });
    }

});

// ============================================================
// Global functions called via onclick="" in HTML attributes
// ============================================================

function switchService(serviceType) {
    const btnTiffin = document.getElementById('btnTiffin');
    const btnCatering = document.getElementById('btnCatering');
    const slider = document.getElementById('serviceSlider');
    const tiffinSection = document.getElementById('tiffinSection');
    const cateringSection = document.getElementById('cateringSection');

    const isTiffin = serviceType === 'tiffin';
    btnTiffin.classList.toggle('active', isTiffin);
    btnCatering.classList.toggle('active', !isTiffin);
    slider.style.transform = isTiffin ? 'translateX(0)' : 'translateX(100%)';

    tiffinSection.classList.toggle('hidden', !isTiffin);
    tiffinSection.classList.toggle('flex', isTiffin);
    cateringSection.classList.toggle('hidden', isTiffin);
    cateringSection.classList.toggle('flex', !isTiffin);

    const activeSection = isTiffin ? tiffinSection : cateringSection;
    activeSection.style.opacity = '0';
    setTimeout(() => activeSection.style.opacity = '1', 50);
}

function filterCatering(category, btnElement) {
    document.querySelectorAll('.catering-filter-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    document.querySelectorAll('.catering-item').forEach(item => {
        const show = category === 'all' || item.dataset.category === category;
        if (show) {
            item.style.display = 'flex';
            item.style.animation = 'none';
            item.offsetHeight; // reflow
            item.style.animation = 'fadeIn 0.4s ease-out forwards';
        } else {
            item.style.display = 'none';
        }
    });
}

function updateCateringQty(btn, change) {
    const input = btn.parentElement.querySelector('.qty-input');
    const newVal = Math.max(30, (parseInt(input.value) || 30) + (change * 10));
    input.value = newVal;
}

function openCateringModal(menuName, btnElement) {
    const card = btnElement.closest('.catering-item');
    const qty = card.querySelector('.qty-input').value;

    document.getElementById('cateringMenuName').value = menuName;
    document.getElementById('cateringGuestCount').value = qty;
    document.getElementById('cateringModalMenuName').textContent = menuName;
    document.getElementById('cateringModalGuestCount').textContent = qty + ' Guests';

    const modal = document.getElementById('cateringModal');
    const backdrop = document.getElementById('uiBackdrop');
    if (modal && backdrop) {
        document.querySelectorAll('.cart-drawer, .commerce-modal').forEach(el => {
            el.classList.remove('is-open');
            el.setAttribute('aria-hidden', 'true');
        });
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        backdrop.classList.add('is-open');
        backdrop.setAttribute('aria-hidden', 'false');
        document.body.classList.add('commerce-locked');
    }
}

function submitCateringForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    
    // Convert guestCount string to int explicitly if needed
    if (payload.guest_count) {
        payload.guest_count = parseInt(payload.guest_count, 10);
    }
    
    // Check for CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    fetch('api/index.php/catering', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken || ''
        },
        body: JSON.stringify(payload)
    })
    .then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || 'Failed to submit inquiry');
        
        e.target.reset();
        document.getElementById('cateringModal').querySelector('.icon-close').click();
        
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = data.message || 'Inquiry sent! We will contact you soon.';
            toast.classList.add('is-visible');
            setTimeout(() => toast.classList.remove('is-visible'), 4000);
        }
    })
    .catch(err => {
        alert(err.message);
    })
    .finally(() => {
        btn.textContent = 'Submit Inquiry';
        btn.disabled = false;
    });
}
