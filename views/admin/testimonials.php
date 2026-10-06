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
                        <form method="POST" action="?page=testimonials" style="margin:0;">
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
                            <form method="POST" action="?page=testimonials" onsubmit="return confirm('Are you sure you want to delete this story?');" style="margin:0;">
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



<!-- ── Success Story Modal ─────────────────────────────────────────────────────── -->
<div class="modal-backdrop" id="storyModal">
    <div class="modal">
        <div class="modal-header">
            <span class="modal-title" id="storyModalTitle">Add Success Story</span>
            <button class="modal-close" id="storyModalClose">×</button>
        </div>
        <form method="POST" action="?page=testimonials" id="storyForm">
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

<script>
// ── Success Story modal
const storyModal       = document.getElementById('storyModal');
const storyModalTitle  = document.getElementById('storyModalTitle');
const storyModalIdInput= document.getElementById('storyId');

function openStoryModal() { storyModal.classList.add('open'); }
function closeStoryModal() { 
    storyModal.classList.remove('open'); 
    document.getElementById('storyForm').reset(); 
    storyModalIdInput.value = ''; 
    storyModalTitle.textContent = 'Add Success Story'; 
}

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
</script>
