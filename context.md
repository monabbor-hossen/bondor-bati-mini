# Project Context & Constraints

**DO NOT DEVIATE FROM THESE RULES WHEN MODIFYING THIS CODEBASE:**

## 1. Asset Management (No CDNs)
- **NO CDNs ALLOWED:** Do not link to external libraries (CSS/JS) via CDNs (e.g., `unpkg.com`, `cdnjs`, `jsdelivr`). 
- **Local Assets Only:** If a library (like Swiper.js, Tailwind, etc.) is needed, download the source files and save them locally in the `assets/css/` or `assets/js/` directories. Reference the local paths instead.

## 2. Code Separation (No Inline Scripts/Styles)
- **No Inline Code in PHP:** Do not write inline `<style>` blocks or `<script>` logic directly inside `.php` view files.
- **Strict Separation:** All JavaScript logic must be placed in dedicated `.js` files in the `assets/js/` directory. All custom CSS must go into `style.css` (or a dedicated file in `assets/css/`).

## 3. JavaScript and PHP Separation
- **No PHP inside `.js` files:** `.js` files are cached by the browser and parsed strictly as JavaScript. Never write `<?php ... ?>` tags inside a `.js` file; it will cause syntax errors and break the script.
- **Passing Data:** If JS needs data from PHP, render the data into HTML `data-*` attributes within the `.php` file, and read them using Javascript (e.g., `element.dataset.*`).

## 4. Routing and Form Actions (Crucial POST Bug)
- **Avoid `action="index.php"`:** Due to Apache `.htaccess` rules enforcing clean URLs, submitting POST requests to `index.php` triggers a `301 Moved Permanently` redirect to the clean URL (stripping the `.php` extension). Browsers aggressively cache this redirect and drop the `POST` payload data during the redirect, turning it into a broken `GET` request.
- **Correct Form Actions:** When creating HTML forms, use `action=""` (submits to current URL seamlessly) or exact query strings like `action="?page=testimonials"` to bypass the redirect trap.
