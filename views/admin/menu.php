
        <div class="table-wrap">
            <div class="table-header">
                <h2>Menu Items</h2>
                <button class="btn btn-primary btn-sm" id="addMenuBtn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Item
                </button>
            </div>
            <div class="table-scroll">
            <?php if (empty($menuItems)): ?>
                <div class="empty-state"><div class="empty-state-icon">🍽️</div><p>No menu items yet. Add your first one!</p></div>
            <?php else: ?>
            <table>
                <thead><tr>
                    <th style="width:48px;">Icon</th>
                    <th>Name</th>
                    <th class="hide-xs">Day</th>
                    <th class="hide-xs">Tier</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Actions</th>
                </tr></thead>
                <tbody>
                <?php foreach ($menuItems as $item): ?>
                <tr>
                    <td class="emoji-cell"><?= e($item['emoji']) ?></td>
                    <td>
                        <span style="font-weight:600;"><?= e($item['name']) ?></span><br>
                        <span style="font-size:.75rem;color:var(--muted);"><?= e(mb_strimwidth($item['description'], 0, 60, '…')) ?></span>
                    </td>
                    <td class="hide-xs" style="font-size:.8rem;"><?= e($dayNames[(string)$item['day_index']] ?? $item['day_index']) ?></td>
                    <td class="hide-xs">
                        <span style="font-size:.75rem;font-weight:700;<?= $item['tier'] === 'premium' ? 'color:#f59e0b;' : 'color:var(--muted);' ?>">
                            <?= ucfirst(e($item['tier'])) ?>
                        </span>
                    </td>
                    <td style="font-family:'Nunito',sans-serif;font-weight:700;">৳<?= number_format((int)$item['price']) ?></td>
                    <td>
                        <form method="POST" action="index.php?page=menu" style="display:inline;">
                            <input type="hidden" name="_action" value="toggle_menu_item">
                            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
                            <input type="hidden" name="_page" value="menu">
                            <input type="hidden" name="id" value="<?= (int)$item['id'] ?>">
                            <input type="hidden" name="available" value="<?= $item['is_available'] ? '0' : '1' ?>">
                            <button type="submit" class="<?= $item['is_available'] ? 'avail-pill avail-on' : 'avail-pill avail-off' ?>" style="cursor:pointer;background:inherit;border:inherit;font:inherit;padding:inherit;border-radius:inherit;">
                                <?= $item['is_available'] ? '● Live' : '○ Hidden' ?>
                            </button>
                        </form>
                    </td>
                    <td>
                        <div style="display:flex;gap:.4rem;">
                            <button class="btn btn-ghost btn-sm edit-menu-btn"
                                data-id="<?= (int)$item['id'] ?>"
                                data-day_index="<?= (int)$item['day_index'] ?>"
                                data-day_name="<?= e($item['day_name']) ?>"
                                data-tier="<?= e($item['tier']) ?>"
                                data-name="<?= e($item['name']) ?>"
                                data-description="<?= e($item['description']) ?>"
                                data-price="<?= (int)$item['price'] ?>"
                                data-emoji="<?= e($item['emoji']) ?>">Edit</button>

                            <form method="POST" action="index.php?page=menu" onsubmit="return confirm('Delete this menu item permanently?')">
                                <input type="hidden" name="_action" value="delete_menu_item">
                                <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
                                <input type="hidden" name="_page" value="menu">
                                <input type="hidden" name="id" value="<?= (int)$item['id'] ?>">
                                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                            </form>
                        </div>
                    </td>
                </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
            <?php endif; ?>
            </div>
        </div>

<!-- ── Menu Item Modal ─────────────────────────────────────────────────────── -->
<div class="modal-backdrop" id="menuModal">
    <div class="modal">
        <div class="modal-header">
            <span class="modal-title" id="menuModalTitle">Add Menu Item</span>
            <button class="modal-close" id="menuModalClose">×</button>
        </div>
        <form method="POST" action="index.php?page=menu" id="menuItemForm">
            <input type="hidden" name="_action" value="save_menu_item">
            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
            <input type="hidden" name="_page" value="menu">
            <input type="hidden" name="id" id="menuItemId" value="">

            <div class="form-grid">
                <div class="form-group full">
                    <label class="form-label" for="mi_name">Item Name</label>
                    <input class="form-control" id="mi_name" name="name" required placeholder="e.g. সোনালী মুরগি ভুনা">
                </div>
                <div class="form-group">
                    <label class="form-label" for="mi_day">Day</label>
                    <select class="form-control" id="mi_day" name="day_index" required>
                        <?php foreach ($dayNames as $idx => $label): ?>
                            <option value="<?= e($idx) ?>"><?= e($label) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="mi_tier">Tier</label>
                    <select class="form-control" id="mi_tier" name="tier" required>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="mi_price">Price (৳)</label>
                    <input class="form-control" id="mi_price" name="price" type="number" min="1" max="99999" required placeholder="135">
                </div>
                <div class="form-group">
                    <label class="form-label" for="mi_emoji">Emoji</label>
                    <input class="form-control" id="mi_emoji" name="emoji" required placeholder="🍗">
                </div>
                <div class="form-group full">
                    <label class="form-label" for="mi_desc">Description</label>
                    <textarea class="form-control" id="mi_desc" name="description" required placeholder="ভাত (মিনিকেট), সোনালী মুরগি ভুনা, ভর্তা/ভাজি, ঘন ডাল, সালাদ।"></textarea>
                </div>
                <!-- hidden day_name synced via JS -->
                <input type="hidden" name="day_name" id="mi_day_name">
            </div>

            <div style="display:flex;gap:.75rem;margin-top:1.25rem;justify-content:flex-end;">
                <button type="button" class="btn btn-ghost" id="menuModalCancel">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Item</button>
            </div>
        </form>
    </div>
</div>

<script>
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
</script>
