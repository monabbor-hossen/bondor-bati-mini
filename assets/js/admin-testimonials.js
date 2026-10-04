// ── Mobile sidebar toggle
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const mobileBtn      = document.getElementById('mobileMenuBtn');

function openSidebar()  {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

mobileBtn?.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
sidebarOverlay?.addEventListener('click', closeSidebar);

// ── Day name sync
const dayNames = <?= json_encode(array_values(array_map(fn($v) => explode(' ', $v)[0], $dayNames)), JSON_UNESCAPED_UNICODE) ?>;
const dayIndexEl  = document.getElementById('mi_day');
const dayNameEl   = document.getElementById('mi_day_name');
function syncDayName() { if (dayIndexEl && dayNameEl) dayNameEl.value = dayNames[dayIndexEl.value] || ''; }
dayIndexEl?.addEventListener('change', syncDayName);

// ── Menu item modal
const modal       = document.getElementById('menuModal');
const modalTitle  = document.getElementById('menuModalTitle');
const modalIdInput= document.getElementById('menuItemId');

function openModal() { modal.classList.add('open'); }
function closeModal() { modal.classList.remove('open'); document.getElementById('menuItemForm').reset(); modalIdInput.value = ''; modalTitle.textContent = 'Add Menu Item'; syncDayName(); }

document.getElementById('addMenuBtn')?.addEventListener('click', () => { closeModal(); openModal(); });
document.getElementById('menuModalClose')?.addEventListener('click', closeModal);
document.getElementById('menuModalCancel')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

document.querySelectorAll('.edit-menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        modalTitle.textContent = 'Edit Menu Item';
        modalIdInput.value = btn.dataset.id;
        document.getElementById('mi_name').value        = btn.dataset.name;
        document.getElementById('mi_day').value         = btn.dataset.day_index;
        document.getElementById('mi_tier').value        = btn.dataset.tier;
        document.getElementById('mi_price').value       = btn.dataset.price;
        document.getElementById('mi_emoji').value       = btn.dataset.emoji;
        document.getElementById('mi_desc').value        = btn.dataset.description;
        syncDayName();
        openModal();
    });
});

// ── Success Story modal
const storyModal       = document.getElementById('storyModal');
const storyModalTitle  = document.getElementById('storyModalTitle');
const storyModalIdInput= document.getElementById('storyId');

function openStoryModal() { storyModal.classList.add('open'); }
function closeStoryModal() { storyModal.classList.remove('open'); document.getElementById('storyForm').reset(); storyModalIdInput.value = ''; storyModalTitle.textContent = 'Add Success Story'; }

document.getElementById('addStoryBtn')?.addEventListener('click', () => { closeStoryModal(); openStoryModal(); });
document.getElementById('storyModalClose')?.addEventListener('click', closeStoryModal);
document.getElementById('storyModalCancel')?.addEventListener('click', closeStoryModal);
storyModal?.addEventListener('click', (e) => { if (e.target === storyModal) closeStoryModal(); });

document.querySelectorAll('.edit-story-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        storyModalTitle.textContent = 'Edit Success Story';
        storyModalIdInput.value = btn.dataset.id;
        document.getElementById('st_client_name').value = btn.dataset.name;
        document.getElementById('st_rating').value      = btn.dataset.rating;
        document.getElementById('st_content').value     = btn.dataset.content;
        openStoryModal();
    });
});

// Auto-dismiss flash messages
setTimeout(() => {
    document.querySelectorAll('.alert').forEach(el => { el.style.transition = 'opacity .5s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 500); });
}, 4000);