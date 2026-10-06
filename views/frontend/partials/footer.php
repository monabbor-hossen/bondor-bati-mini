    <!-- Mobile Cart Button -->
    <button id="mobileCartButton" type="button" class="mobile-cart-button lg:hidden" aria-label="Open shopping cart">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <span id="mobileCartCount">0</span>
    </button>

    <div id="uiBackdrop" class="commerce-backdrop" aria-hidden="true"></div>

    <!-- Cart Drawer -->
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
            <p class="text-xs text-gray-500 text-center mt-3">Cash on delivery &middot; Order confirmation by phone</p>
        </div>
    </aside>

    <!-- Checkout Modal -->
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

    <!-- Order Tracking Modal -->
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

    <!-- Order Confirmation Modal -->
    <section id="confirmationModal" class="commerce-modal compact-modal text-center" role="dialog" aria-modal="true" aria-labelledby="confirmationTitle" aria-hidden="true">
        <div class="confirmation-mark">&#10003;</div>
        <p class="commerce-kicker">Order received</p>
        <h2 id="confirmationTitle" class="font-nunito-black text-3xl text-gray-900 mb-3">Thank you!</h2>
        <div id="confirmationContent" class="text-gray-600"></div>
        <button type="button" class="clay-btn-red w-full mt-7" data-close-ui>Done</button>
    </section>

    <!-- Catering Inquiry Modal -->
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
            <label>Event Date &amp; Time<input type="datetime-local" name="event_date" required></label>
            <label>Venue Address in Chattogram<input type="text" name="venue" required placeholder="Chattogram event venue"></label>
            <label class="form-full">Notes<textarea name="notes" placeholder="Special requirements (optional)"></textarea></label>
            <button type="submit" class="clay-btn-red form-full mt-2">Submit Inquiry</button>
        </form>
    </section>

    <div id="toast" class="commerce-toast" role="status" aria-live="polite"></div>
    <script src="script.js"></script>
    <?php if (!empty($extraJs)): ?>
        <?php foreach ((array)$extraJs as $jsFile): ?>
            <script src="<?= htmlspecialchars($jsFile, ENT_QUOTES, 'UTF-8') ?>"></script>
        <?php endforeach; ?>
    <?php endif; ?>
</body>
</html>

