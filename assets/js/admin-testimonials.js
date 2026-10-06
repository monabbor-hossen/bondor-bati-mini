


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
