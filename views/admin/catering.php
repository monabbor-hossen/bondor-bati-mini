
<div style="margin-bottom:1rem;">
<div class="filter-bar">
    <a href="index.php?page=catering" class="filter-pill <?= $filterStatus === '' ? 'active' : '' ?>">All</a>
    <a href="index.php?page=catering&status=pending"   class="filter-pill <?= $filterStatus === 'pending'   ? 'active' : '' ?>">Pending</a>
    <a href="index.php?page=catering&status=confirmed" class="filter-pill <?= $filterStatus === 'confirmed' ? 'active' : '' ?>">Confirmed</a>
    <a href="index.php?page=catering&status=completed" class="filter-pill <?= $filterStatus === 'completed' ? 'active' : '' ?>">Completed</a>
    <a href="index.php?page=catering&status=cancelled" class="filter-pill <?= $filterStatus === 'cancelled' ? 'active' : '' ?>">Cancelled</a>
</div>
</div>

<div class="table-wrap">
    <div class="table-header">
        <h2>Catering Bookings</h2>
        <span style="font-size:.8rem;color:var(--muted);">Manage event catering inquiries</span>
    </div>
    <div class="table-scroll">
    <table>
        <thead>
            <tr>
                <th>Booking #</th>
                <th>Menu</th>
                <th>Client</th>
                <th>Phone</th>
                <th>Guests</th>
                <th>Event Date</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <?php if (empty($cateringBookings)): ?>
            <tr><td colspan="9" style="text-align:center;color:var(--muted);padding:2rem;">No catering bookings found.</td></tr>
        <?php else: ?>
        <?php foreach ($cateringBookings as $b): ?>
            <tr>
                <td><code style="font-size:.75rem;color:var(--red-light)"><?= e($b['booking_number']) ?></code></td>
                <td style="font-weight:600"><?= e($b['menu_name']) ?></td>
                <td><?= e($b['client_name']) ?></td>
                <td><a href="tel:<?= e($b['phone']) ?>" style="color:var(--red-light)"><?= e($b['phone']) ?></a></td>
                <td><?= (int)$b['guest_count'] ?></td>
                <td><?= e(date('d M Y, h:i A', strtotime($b['event_date']))) ?></td>
                <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="<?= e($b['venue']) ?>"><?= e($b['venue']) ?></td>
                <td>
                    <span class="status-pill" style="background:<?= match($b['status']) {
                        'pending' => 'rgba(245,158,11,.15)', 'confirmed' => 'rgba(59,130,246,.15)',
                        'completed' => 'rgba(34,197,94,.15)', 'cancelled' => 'rgba(107,114,128,.15)', default => 'rgba(255,255,255,.1)'
                    } ?>;border-color:<?= match($b['status']) {
                        'pending' => 'rgba(245,158,11,.25)', 'confirmed' => 'rgba(59,130,246,.25)',
                        'completed' => 'rgba(34,197,94,.25)', 'cancelled' => 'rgba(107,114,128,.25)', default => 'rgba(255,255,255,.25)'
                    } ?>;color:<?= match($b['status']) {
                        'pending' => '#f59e0b', 'confirmed' => '#60a5fa',
                        'completed' => '#4ade80', 'cancelled' => '#9ca3af', default => '#fff'
                    } ?>;"><?= ucfirst($b['status']) ?></span>
                </td>
                <td>
                    <div class="table-actions">
                        <form method="POST">
                            <input type="hidden" name="_action" value="update_catering_status">
                            <input type="hidden" name="_page" value="catering">
                            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
                            <input type="hidden" name="id" value="<?= (int)$b['id'] ?>">
                            <select name="status" class="form-control" style="padding:.35rem .6rem;font-size:.75rem;width:auto;">
                                <?php foreach (['pending','confirmed','completed','cancelled'] as $s): ?>
                                    <option value="<?= $s ?>" <?= $b['status'] === $s ? 'selected' : '' ?>><?= ucfirst($s) ?></option>
                                <?php endforeach; ?>
                            </select>
                            <button type="submit" class="btn btn-primary btn-sm">Save</button>
                        </form>
                        <form method="POST" onsubmit="return confirm('Delete this booking?')">
                            <input type="hidden" name="_action" value="delete_catering_booking">
                            <input type="hidden" name="_page" value="catering">
                            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
                            <input type="hidden" name="id" value="<?= (int)$b['id'] ?>">
                            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                        </form>
                    </div>
                </td>
            </tr>
            <?php if (!empty($b['notes'])): ?>
            <tr><td colspan="9" style="padding-top:0;padding-bottom:.75rem;color:var(--muted);font-size:.8rem">
                <strong>Notes:</strong> <?= e($b['notes']) ?>
            </td></tr>
            <?php endif; ?>
        <?php endforeach; ?>
        <?php endif; ?>
        </tbody>
    </table>
    </div>
</div>

<?php if ($totalCateringPages > 1): ?>
<div class="pagination">
    <?php for ($i = 1; $i <= $totalCateringPages; $i++): ?>
        <a href="index.php?page=catering&status=<?= e($filterStatus) ?>&p=<?= $i ?>"
           class="page-btn <?= $i === $pageNum ? 'active' : '' ?>"><?= $i ?></a>
    <?php endfor; ?>
</div>
<?php endif; ?>
