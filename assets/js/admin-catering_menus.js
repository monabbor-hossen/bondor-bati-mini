function openCateringMenuModal() { document.getElementById('modalCateringMenu').classList.add('open'); }
function closeCateringMenuModal() { 
    document.getElementById('modalCateringMenu').classList.remove('open');
    document.querySelector('#modalCateringMenu form').reset();
    document.getElementById('modalCateringMenuTitle').textContent = 'New Event Menu';
    document.getElementById('cmId').value = '';
}
function editCateringMenu(m) {
    document.getElementById('modalCateringMenuTitle').textContent = 'Edit Event Menu';
    document.getElementById('cmId').value = m.id;
    document.getElementById('cmCategory').value = m.category;
    document.getElementById('cmBadgeText').value = m.badge_text;
    document.getElementById('cmTitle').value = m.title;
    document.getElementById('cmItems').value = m.items;
    openCateringMenuModal();
}
// Close modal on click outside
document.getElementById('modalCateringMenu').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalCateringMenu')) closeCateringMenuModal();
});