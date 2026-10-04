        <div class="table-wrap">
            <div class="table-header">
                <h2>Success Stories</h2>
                <button class="btn btn-primary" id="addStoryBtn">+ Add Story</button>
            </div>
            <div class="table-scroll">
            <?php if (empty($successStories)): ?>
                <div class="empty-state"><div class="empty-state-icon">💬</div><p>No success stories added yet.</p></div>
            <?php else: ?>
            <table>
                <thead><tr>
                    <th>Client Name</th>
                    <th>Rating</th>
                    <th class="hide-xs">Content</th>
                    <th>Visibility</th>
                    <th>Actions</th>
                </tr></thead>
                <tbody>
                <?php foreach ($successStories as $story): ?>
                <tr>
                    <td style="font-family:'Nunito',sans-serif;font-weight:700;"><?= e($story['client_name']) ?></td>
                    <td style="color:var(--yellow);"><?= str_repeat('★', (int)$story['rating']) ?></td>
                    <td class="hide-xs" style="font-size:.8rem;color:var(--muted);max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                        <?= e($story['content']) ?>
                    </td>
                    <td>
                        <form method="POST" action="index.php" style="margin:0;">
                            <input type="hidden" name="_action" value="toggle_success_story">
                            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
                            <input type="hidden" name="_page" value="testimonials">
                            <input type="hidden" name="id" value="<?= $story['id'] ?>">
                            <input type="hidden" name="visible" value="<?= $story['is_visible'] ? '0' : '1' ?>">
                            <button type="submit" class="status-pill" style="border:none; cursor:pointer; <?= $story['is_visible'] ? 'color:#86efac;background:rgba(34,197,94,.15);' : 'color:#a0a0a5;background:var(--surface);' ?>">
                                <?= $story['is_visible'] ? 'Live' : 'Hidden' ?>
                            </button>
                        </form>
                    </td>
                    <td>
                        <div style="display:flex;gap:.5rem;">
                            <button class="btn btn-ghost btn-sm edit-story-btn" 
                                    data-id="<?= $story['id'] ?>"
                                    data-name="<?= e($story['client_name']) ?>"
                                    data-rating="<?= $story['rating'] ?>"
                                    data-content="<?= e($story['content']) ?>">Edit</button>
                            <form method="POST" action="index.php" onsubmit="return confirm('Are you sure you want to delete this story?');" style="margin:0;">
                                <input type="hidden" name="_action" value="delete_success_story">
                                <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
                                <input type="hidden" name="_page" value="testimonials">
                                <input type="hidden" name="id" value="<?= $story['id'] ?>">
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

<!-- ── Success Story Modal ─────────────────────────────────────────────────────── -->
<div class="modal-backdrop" id="storyModal">
    <div class="modal">
        <div class="modal-header">
            <span class="modal-title" id="storyModalTitle">Add Success Story</span>
            <button class="modal-close" id="storyModalClose">×</button>
        </div>
        <form method="POST" action="index.php" id="storyForm">
            <input type="hidden" name="_action" value="save_success_story">
            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
            <input type="hidden" name="_page" value="testimonials">
            <input type="hidden" name="id" id="storyId" value="">

            <div class="form-grid">
                <div class="form-group full">
                    <label class="form-label" for="st_client_name">Client Name</label>
                    <input class="form-control" id="st_client_name" name="client_name" required placeholder="e.g. Ahmed Hasan">
                </div>
                <div class="form-group full">
                    <label class="form-label" for="st_rating">Rating (1-5)</label>
                    <select class="form-control" id="st_rating" name="rating" required>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
                <div class="form-group full">
                    <label class="form-label" for="st_content">Review Content</label>
                    <textarea class="form-control" id="st_content" name="content" required placeholder="Their review..."></textarea>
                </div>
            </div>

            <div style="display:flex;gap:.75rem;margin-top:1.25rem;justify-content:flex-end;">
                <button type="button" class="btn btn-ghost" id="storyModalCancel">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Story</button>
            </div>
        </form>
    </div>
</div>

<script src="../assets/js/admin-testimonials.js"></script>
