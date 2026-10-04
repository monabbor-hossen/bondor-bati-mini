
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

