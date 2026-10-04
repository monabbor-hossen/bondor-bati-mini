
<div class="table-wrap">
    <div class="table-header">
        <div style="display:flex;align-items:center;gap:.75rem">
            <h2>Event Menus</h2>
            <span style="font-size:.8rem;color:var(--muted);">Manage catering menu options</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openCateringMenuModal()">+ New Menu</button>
    </div>
    <div class="table-scroll">
    <table>
        <thead>
            <tr>
                <th>Category</th>
                <th>Badge/ID</th>
                <th>Title</th>
                <th>Items</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <?php if (empty($cateringMenus)): ?>
            <tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem;">No event menus found.</td></tr>
        <?php else: ?>
        <?php foreach ($cateringMenus as $m): ?>
            <tr>
                <td>
                    <span class="status-pill" style="background:rgba(255,255,255,.05);color:var(--muted);border-color:var(--border);">
                        <?= ucfirst(e($m['category'])) ?>
                    </span>
                </td>
                <td><strong style="color:var(--red-light);font-size:.8rem;"><?= e($m['badge_text']) ?></strong></td>
                <td style="font-weight:600"><?= e($m['title']) ?></td>
                <td><div style="font-size:.75rem;color:var(--muted);max-width:400px;line-height:1.4;"><?= e(str_replace("\n", ", ", $m['items'])) ?></div></td>
                <td>
                    <form method="POST" style="display:inline">
                        <input type="hidden" name="_action" value="toggle_catering_menu">
                        <input type="hidden" name="_page" value="catering_menus">
                        <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
                        <input type="hidden" name="id" value="<?= (int)$m['id'] ?>">
                        <input type="hidden" name="is_active" value="<?= $m['is_active'] ? 0 : 1 ?>">
                        <button type="submit" class="status-pill" style="border:1px solid <?= $m['is_active'] ? 'rgba(34,197,94,.25)' : 'rgba(107,114,128,.25)' ?>;cursor:pointer;background:<?= $m['is_active'] ? 'rgba(34,197,94,.15)' : 'rgba(107,114,128,.15)' ?>;color:<?= $m['is_active'] ? '#4ade80' : '#9ca3af' ?>;">
                            <?= $m['is_active'] ? 'Active' : 'Disabled' ?>
                        </button>
                    </form>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" onclick='editCateringMenu(<?= json_encode($m, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_AMP|JSON_HEX_QUOT) ?>)'>Edit</button>
                        <form method="POST" onsubmit="return confirm('Delete this event menu?')">
                            <input type="hidden" name="_action" value="delete_catering_menu">
                            <input type="hidden" name="_page" value="catering_menus">
                            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
                            <input type="hidden" name="id" value="<?= (int)$m['id'] ?>">
                            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                        </form>
                    </div>
                </td>
            </tr>
        <?php endforeach; ?>
        <?php endif; ?>
        </tbody>
    </table>
    </div>
</div>

<div class="modal-backdrop" id="modalCateringMenu">
    <div class="modal" style="max-width: 600px;">
        <div class="modal-header">
            <span class="modal-title" id="modalCateringMenuTitle">New Event Menu</span>
            <button class="modal-close" type="button" onclick="closeCateringMenuModal()">×</button>
        </div>
        <form method="POST">
            <input type="hidden" name="_action" value="save_catering_menu">
            <input type="hidden" name="_page" value="catering_menus">
            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
            <input type="hidden" name="id" id="cmId" value="">
            
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label" for="cmCategory">Category</label>
                    <select class="form-control" id="cmCategory" name="category" required>
                        <option value="regular">Regular Menu</option>
                        <option value="premium">Premium Menu</option>
                        <option value="holud">Holud Special</option>
                        <option value="bride">Bride Menu</option>
                        <option value="box">Box Menu</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="cmBadgeText">Badge / Short ID</label>
                    <input class="form-control" id="cmBadgeText" name="badge_text" required placeholder="e.g. MENU 1">
                </div>
                <div class="form-group full">
                    <label class="form-label" for="cmTitle">Menu Title</label>
                    <input class="form-control" id="cmTitle" name="title" required placeholder="e.g. Saffron Polao Menu">
                </div>
                <div class="form-group full">
                    <label class="form-label" for="cmItems">Items (one per line)</label>
                    <textarea class="form-control" id="cmItems" name="items" required placeholder="Item 1&#10;Item 2&#10;Item 3" style="min-height: 120px;"></textarea>
                </div>
            </div>
            
            <div style="display:flex;gap:.75rem;margin-top:1.25rem;justify-content:flex-end;">
                <button type="button" class="btn btn-ghost" onclick="closeCateringMenuModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Menu</button>
            </div>
        </form>
    </div>
</div>
<script src="../assets/js/admin-catering_menus.js"></script>
