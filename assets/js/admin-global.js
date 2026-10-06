// ── Mobile sidebar toggle
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const mobileBtn      = document.getElementById('mobileMenuBtn');

function openSidebar()  {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

mobileBtn?.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
sidebarOverlay?.addEventListener('click', closeSidebar);

// Auto-dismiss flash messages
setTimeout(() => {
    document.querySelectorAll('.alert').forEach(el => { 
        el.style.transition = 'opacity .5s'; 
        el.style.opacity = '0'; 
        setTimeout(() => el.remove(), 500); 
    });
}, 4000);
