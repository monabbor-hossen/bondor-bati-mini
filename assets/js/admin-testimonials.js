// ── Success Story modal
const storyModal       = document.getElementById('storyModal');
const storyModalTitle  = document.getElementById('storyModalTitle');
const storyModalIdInput= document.getElementById('storyId');

function openStoryModal() { if(storyModal) storyModal.classList.add('open'); }
function closeStoryModal() { 
    if(storyModal) storyModal.classList.remove('open'); 
    const form = document.getElementById('storyForm');
    if(form) form.reset(); 
    if(storyModalIdInput) storyModalIdInput.value = ''; 
    if(storyModalTitle) storyModalTitle.textContent = 'Add Success Story'; 
}

document.getElementById('addStoryBtn')?.addEventListener('click', () => { closeStoryModal(); openStoryModal(); });
document.getElementById('storyModalClose')?.addEventListener('click', closeStoryModal);
document.getElementById('storyModalCancel')?.addEventListener('click', closeStoryModal);
storyModal?.addEventListener('click', (e) => { if (e.target === storyModal) closeStoryModal(); });

document.querySelectorAll('.edit-story-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if(storyModalTitle) storyModalTitle.textContent = 'Edit Success Story';
        if(storyModalIdInput) storyModalIdInput.value = btn.dataset.id;
        const nameInput = document.getElementById('st_client_name'); if(nameInput) nameInput.value = btn.dataset.name;
        const ratingInput = document.getElementById('st_rating'); if(ratingInput) ratingInput.value = btn.dataset.rating;
        const contentInput = document.getElementById('st_content'); if(contentInput) contentInput.value = btn.dataset.content;
        openStoryModal();
    });
});
