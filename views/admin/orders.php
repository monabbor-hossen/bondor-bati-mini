
        <!-- Status filter -->
        <div style="margin-bottom:1rem;">
            <div class="filter-bar">
                <a href="index.php?page=orders" class="filter-pill <?= $filterStatus === '' ? 'active' : '' ?>">All (<?= $counts['total_orders'] ?>)</a>
                <?php foreach ($statusLabels as $slug => $label): ?>
                    <a href="index.php?page=orders&status=<?= $slug ?>" class="filter-pill <?= $filterStatus === $slug ? 'active' : '' ?>"
                       style="<?= $filterStatus === $slug ? "background:{$statusColors[$slug]};border-color:{$statusColors[$slug]};" : '' ?>">
                        <?= e($label) ?> (<?= $counts[$slug] ?? 0 ?>)
                    </a>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="table-wrap">
            <div class="table-header">
                <h2>Orders <?= $filterStatus ? '— ' . e($statusLabels[$filterStatus] ?? $filterStatus) : '' ?></h2>
                <span style="font-size:.8rem;color:var(--muted);"><?= $totalOrders ?> total</span>
            </div>
            <div class="table-scroll">
            <?php if (empty($orders)): ?>
                <div class="empty-state"><div class="empty-state-icon">📦</div><p>No orders <?= $filterStatus ? 'with this status' : 'yet' ?>.</p></div>
            <?php else: ?>
            <table>
                <thead><tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th class="hide-xs">Phone</th>
                    <th>Delivery</th>
                    <th>Total</th>
                    <th class="hide-xs">Placed</th>
                    <th class="hide-xs">Status</th>
                    <th>Update</th>
                </tr></thead>
                <tbody>
                <?php foreach ($orders as $order):
                    $color = $statusColors[$order['status']] ?? '#6b7280';
                ?>
                <tr>
                    <td style="font-family:'Nunito',sans-serif;font-weight:800;font-size:.8rem;"><?= e($order['order_number']) ?></td>
                    <td><?= e($order['customer_name']) ?></td>
                    <td class="hide-xs" style="font-size:.8rem;"><?= e($order['phone']) ?></td>
                    <td style="font-size:.8rem;"><?= e($order['delivery_date']) ?></td>
                    <td style="font-family:'Nunito',sans-serif;font-weight:700;">৳<?= number_format((int)$order['total']) ?></td>
                    <td class="hide-xs" style="font-size:.75rem;color:var(--muted);"><?= e(date('d M H:i', strtotime($order['created_at']))) ?></td>
                    <td class="hide-xs">
                        <span class="status-pill" style="color:<?= $color ?>;border-color:<?= $color ?>30;background:<?= $color ?>18;">
                            <?= e($statusLabels[$order['status']] ?? $order['status']) ?>
                        </span>
                    </td>
                    <td>
                        <form method="POST" action="index.php?page=orders<?= $filterStatus ? '&status='.urlencode($filterStatus) : '' ?>">
                            <input type="hidden" name="_action" value="update_order_status">
                            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
                            <input type="hidden" name="_page" value="orders">
                            <input type="hidden" name="id" value="<?= (int)$order['id'] ?>">
                            <select name="status" class="form-control" style="padding:.35rem .6rem;font-size:.75rem;width:auto;">
                                <?php foreach ($statusLabels as $slug => $label): ?>
                                    <option value="<?= e($slug) ?>" <?= $order['status'] === $slug ? 'selected' : '' ?>><?= e($label) ?></option>
                                <?php endforeach; ?>
                            </select>
                            <button type="submit" class="btn btn-primary btn-sm">Save</button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
            <?php endif; ?>
            </div>

            <!-- Pagination -->
            <?php if ($totalPages > 1): ?>
            <div class="pagination">
                <a href="?page=orders&p=<?= max(1,$pageNum-1) ?><?= $filterStatus?"&status=".urlencode($filterStatus):'' ?>"
                   class="page-btn <?= $pageNum <= 1 ? 'disabled' : '' ?>">‹</a>
                <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                    <a href="?page=orders&p=<?= $i ?><?= $filterStatus?"&status=".urlencode($filterStatus):'' ?>"
                       class="page-btn <?= $i === $pageNum ? 'active' : '' ?>"><?= $i ?></a>
                <?php endfor; ?>
                <a href="?page=orders&p=<?= min($totalPages,$pageNum+1) ?><?= $filterStatus?"&status=".urlencode($filterStatus):'' ?>"
                   class="page-btn <?= $pageNum >= $totalPages ? 'disabled' : '' ?>">›</a>
            </div>
            <?php endif; ?>
        </div>
