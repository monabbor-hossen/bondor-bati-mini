function openAdminModal() { document.getElementById('modalAdmin').classList.add('open'); }
function closeAdminModal() { 
    document.getElementById('modalAdmin').classList.remove('open');
    document.querySelector('#modalAdmin form').reset();
    document.getElementById('modalAdminTitle').textContent = 'New Admin User';
    document.getElementById('adminId').value = '';
    document.getElementById('adminPwdHint').textContent = '';
    document.getElementById('adminPassword').required = true;
}
function editAdmin(a) {
    document.getElementById('modalAdminTitle').textContent = 'Edit Admin';
    document.getElementById('adminId').value = a.id;
    document.getElementById('adminName').value = a.name;
    document.getElementById('adminUsername').value = a.username;
    document.getElementById('adminEmail').value = a.email;
    document.getElementById('adminRole').value = a.role;
    
    document.getElementById('adminPwdHint').textContent = '(Leave blank to keep current)';
    document.getElementById('adminPassword').required = false;
    
    openAdminModal();
}
// Close modal on click outside
document.getElementById('modalAdmin').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalAdmin')) closeAdminModal();
});