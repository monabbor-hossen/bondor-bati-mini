
<div class="table-wrap">
    <div class="table-header">
        <div style="display:flex;align-items:center;gap:.75rem">
            <h2>System Admins</h2>
            <span style="font-size:.8rem;color:var(--muted);">Manage admin users and their access</span>
        </div>
        <?php if (($_SESSION['admin_role'] ?? 'manager') === 'superadmin'): ?>
        <button class="btn btn-primary btn-sm" onclick="openAdminModal()">+ New Admin</button>
        <?php endif; ?>
    </div>
    <div class="table-scroll">
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <?php if (empty($adminUsers)): ?>
            <tr><td colspan="7" style="text-align:center;color:var(--muted);padding:2rem;">No admins found.</td></tr>
        <?php else: ?>
        <?php foreach ($adminUsers as $a): ?>
            <tr>
                <td><?= (int)$a['id'] ?></td>
                <td style="font-weight:600"><?= e($a['name']) ?></td>
                <td>@<?= e($a['username']) ?></td>
                <td><?= e($a['email']) ?></td>
                <td>
                    <span class="status-pill" style="background:<?= $a['role'] === 'superadmin' ? 'rgba(139,92,246,.15)' : 'rgba(59,130,246,.15)' ?>;border-color:<?= $a['role'] === 'superadmin' ? 'rgba(139,92,246,.25)' : 'rgba(59,130,246,.25)' ?>;color:<?= $a['role'] === 'superadmin' ? '#a78bfa' : '#60a5fa' ?>;">
                        <?= ucfirst(e($a['role'])) ?>
                    </span>
                </td>
                <td>
                    <form method="POST" style="display:inline">
                        <input type="hidden" name="_action" value="toggle_admin_status">
                        <input type="hidden" name="_page" value="admins">
                        <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
                        <input type="hidden" name="id" value="<?= (int)$a['id'] ?>">
                        <input type="hidden" name="is_active" value="<?= $a['is_active'] ? 0 : 1 ?>">
                        <button type="submit" class="status-pill" style="border:1px solid <?= $a['is_active'] ? 'rgba(34,197,94,.25)' : 'rgba(107,114,128,.25)' ?>;cursor:pointer;background:<?= $a['is_active'] ? 'rgba(34,197,94,.15)' : 'rgba(107,114,128,.15)' ?>;color:<?= $a['is_active'] ? '#4ade80' : '#9ca3af' ?>;">
                            <?= $a['is_active'] ? 'Active' : 'Disabled' ?>
                        </button>
                    </form>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" onclick='editAdmin(<?= json_encode($a, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_AMP|JSON_HEX_QUOT) ?>)'>Edit</button>
                        <?php if ((int)$a['id'] !== 1 && (int)$a['id'] !== ($_SESSION['admin_id'] ?? 0)): ?>
                        <form method="POST" onsubmit="return confirm('Delete this admin user?')">
                            <input type="hidden" name="_action" value="delete_admin">
                            <input type="hidden" name="_page" value="admins">
                            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
                            <input type="hidden" name="id" value="<?= (int)$a['id'] ?>">
                            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                        </form>
                        <?php endif; ?>
                    </div>
                </td>
            </tr>
        <?php endforeach; ?>
        <?php endif; ?>
        </tbody>
    </table>
    </div>
</div>

<div class="modal-backdrop" id="modalAdmin">
    <div class="modal" style="max-width: 500px;">
        <div class="modal-header">
            <span class="modal-title" id="modalAdminTitle">New Admin User</span>
            <button class="modal-close" type="button" onclick="closeAdminModal()">×</button>
        </div>
        <form method="POST">
            <input type="hidden" name="_action" value="save_admin">
            <input type="hidden" name="_page" value="admins">
            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
            <input type="hidden" name="id" id="adminId" value="">
            
            <div class="form-grid">
                <div class="form-group full">
                    <label class="form-label" for="adminName">Full Name</label>
                    <input class="form-control" type="text" name="name" id="adminName" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="adminUsername">Username</label>
                    <input class="form-control" type="text" name="username" id="adminUsername" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="adminEmail">Email Address</label>
                    <input class="form-control" type="email" name="email" id="adminEmail" required>
                </div>
                
                <div class="form-group full">
                    <label class="form-label" for="adminRole">Role</label>
                    <select class="form-control" name="role" id="adminRole" required>
                        <option value="manager">Manager (Manage orders, menu, catering)</option>
                        <option value="superadmin">Super Admin (Can add/remove users)</option>
                    </select>
                </div>
                
                <div class="form-group full">
                    <label class="form-label" for="adminPassword">Password <span id="adminPwdHint" style="text-transform:none;font-weight:normal;color:var(--muted)"></span></label>
                    <input class="form-control" type="password" name="password" id="adminPassword" required>
                </div>
            </div>
            
            <div style="display:flex;gap:.75rem;margin-top:1.25rem;justify-content:flex-end;">
                <button type="button" class="btn btn-ghost" onclick="closeAdminModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save User</button>
            </div>
        </form>
    </div>
</div>

<script src="../assets/js/admin-admins.js"></script>
