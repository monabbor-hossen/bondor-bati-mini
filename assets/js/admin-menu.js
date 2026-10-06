// ── Day name sync
const dayIndexEl  = document.getElementById('mi_day');
const dayNameEl   = document.getElementById('mi_day_name');
function syncDayName() {
    if (dayIndexEl && dayNameEl) {
        const selectedOption = dayIndexEl.options[dayIndexEl.selectedIndex];
        if (selectedOption) {
            dayNameEl.value = selectedOption.text.split(' ')[0];
        }
    }
}
dayIndexEl?.addEventListener('change', syncDayName);

// ── Menu item modal
const modal       = document.getElementById('menuModal');
const modalTitle  = document.getElementById('menuModalTitle');
const modalIdInput= document.getElementById('menuItemId');

function openModal() { if(modal) modal.classList.add('open'); }
function closeModal() { 
    if(modal) modal.classList.remove('open'); 
    const form = document.getElementById('menuItemForm');
    if(form) form.reset(); 
    if(modalIdInput) modalIdInput.value = ''; 
    if(modalTitle) modalTitle.textContent = 'Add Menu Item'; 
    syncDayName(); 
}

document.getElementById('addMenuBtn')?.addEventListener('click', () => { closeModal(); openModal(); });
document.getElementById('menuModalClose')?.addEventListener('click', closeModal);
document.getElementById('menuModalCancel')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

document.querySelectorAll('.edit-menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if(modalTitle) modalTitle.textContent = 'Edit Menu Item';
        if(modalIdInput) modalIdInput.value = btn.dataset.id;
        const nameInput = document.getElementById('mi_name'); if(nameInput) nameInput.value = btn.dataset.name;
        const dayInput = document.getElementById('mi_day'); if(dayInput) dayInput.value = btn.dataset.day_index;
        const tierInput = document.getElementById('mi_tier'); if(tierInput) tierInput.value = btn.dataset.tier;
        const priceInput = document.getElementById('mi_price'); if(priceInput) priceInput.value = btn.dataset.price;
        const emojiInput = document.getElementById('mi_emoji'); if(emojiInput) emojiInput.value = btn.dataset.emoji;
        const descInput = document.getElementById('mi_desc'); if(descInput) descInput.value = btn.dataset.description;
        syncDayName();
        openModal();
    });
});
