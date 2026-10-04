
        <div class="stat-grid">
            <?php
            $stats = [
                ['Total Orders',     $counts['total_orders'],    '#3b82f6'],
                ['Pending',          $counts['pending'],         '#f59e0b'],
                ['Confirmed',        $counts['confirmed'],       '#3b82f6'],
                ['Preparing',        $counts['preparing'],       '#8b5cf6'],
                ['Out for Delivery', $counts['out_for_delivery'],'#ec4899'],
                ['Delivered',        $counts['delivered'],       '#22c55e'],
                ['Cancelled',        $counts['cancelled'],       '#6b7280'],
                ['Menu Items',       $counts['menu_items'],      '#ff5e5e'],
            ];
            foreach ($stats as [$label, $value, $color]): ?>
            <div class="stat-card">
                <div class="stat-dot" style="background:<?= $color ?>; box-shadow: 0 0 6px <?= $color ?>;"></div>
                <div class="stat-label"><?= e($label) ?></div>
                <div class="stat-value" style="color:<?= $color ?>"><?= $value ?></div>
            </div>
            <?php endforeach; ?>
        </div>

        <!-- Revenue chart -->
        <?php if (!empty($revenue)): ?>
        <div class="table-wrap" style="margin-bottom:1.5rem;">
            <div class="table-header">
                <h2>Revenue — Last 7 Days</h2>
                <span style="font-size:.8rem; color:var(--muted);">Excludes cancelled orders</span>
            </div>
            <?php
            $maxRev = max(array_column($revenue, 'revenue') ?: [1]);
            ?>
            <div class="revenue-chart">
                <div class="chart-bars">
                    <?php foreach ($revenue as $row):
                        $pct = max(4, round(($row['revenue'] / $maxRev) * 100));
                    ?>
                    <div class="chart-bar-wrap">
                        <div class="chart-amount">৳<?= number_format((int)$row['revenue']) ?></div>
                        <div class="chart-bar" style="height:<?= $pct ?>%;" title="<?= e($row['day']) ?>: ৳<?= number_format((int)$row['revenue']) ?> (<?= $row['orders'] ?> orders)"></div>
                        <div class="chart-day"><?= e(date('D d', strtotime($row['day']))) ?></div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        <?php endif; ?>

        <!-- Recent orders preview -->
        <?php if (!empty($recentOrders)): ?>
        <div class="table-wrap">
            <div class="table-header">
                <h2>Recent Orders</h2>
                <a href="index.php?page=orders" class="btn btn-ghost btn-sm">View all →</a>
            </div>
            <div class="table-scroll">
            <table>
                <thead><tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Delivery</th>
                    <th>Total</th>
                    <th>Status</th>
                </tr></thead>
                <tbody>
                <?php foreach ($recentOrders as $order):
                    $color = $statusColors[$order['status']] ?? '#6b7280';
                ?>
                <tr>
                    <td style="font-family:'Nunito',sans-serif;font-weight:700;"><?= e($order['order_number']) ?></td>
                    <td><?= e($order['customer_name']) ?><br><span style="font-size:.75rem;color:var(--muted);"><?= e($order['phone']) ?></span></td>
                    <td style="font-size:.8rem;"><?= e($order['delivery_date']) ?></td>
                    <td style="font-family:'Nunito',sans-serif;font-weight:700;">৳<?= number_format((int)$order['total']) ?></td>
                    <td>
                        <span class="status-pill" style="color:<?= $color ?>;border-color:<?= $color ?>30;background:<?= $color ?>18;">
                            <?= e($statusLabels[$order['status']] ?? $order['status']) ?>
                        </span>
                    </td>
                </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
            </div>
        </div>
        <?php endif; ?>


