<?php
/**
 * =========================================================
 *  Bondor Bati — Security Test Suite
 *  Tests: SQL Injection resistance + DDoS / Rate-Limiting
 *
 *  Usage (from project root, while XAMPP is running):
 *    php tests/security_test.php [http://localhost/bondor_bati]
 * =========================================================
 */

declare(strict_types=1);

$base = rtrim($argv[1] ?? 'http://localhost/bondor_bati', '/');
$apiBase = $base . '/api/index.php';

// ─── ANSI helpers ────────────────────────────────────────
function green(string $s): string  { return "\033[32m{$s}\033[0m"; }
function red(string $s): string    { return "\033[31m{$s}\033[0m"; }
function yellow(string $s): string { return "\033[33m{$s}\033[0m"; }
function bold(string $s): string   { return "\033[1m{$s}\033[0m"; }
function cyan(string $s): string   { return "\033[36m{$s}\033[0m"; }

// ─── Result tracking ─────────────────────────────────────
$passed   = 0;
$failed   = 0;
$warnings = 0;

function pass(string $label): void {
    global $passed;
    $passed++;
    echo green('  ✔ PASS') . " — {$label}\n";
}
function fail(string $label, string $reason = ''): void {
    global $failed;
    $failed++;
    echo red('  ✘ FAIL') . " — {$label}" . ($reason ? " ({$reason})" : '') . "\n";
}
function warn(string $label, string $reason = ''): void {
    global $warnings;
    $warnings++;
    echo yellow('  ⚠ WARN') . " — {$label}" . ($reason ? " ({$reason})" : '') . "\n";
}

// ─── HTTP helpers ─────────────────────────────────────────
function http(
    string $method,
    string $url,
    array  $headers   = [],
    string $body      = '',
    string $cookieJar = ''
): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => strtoupper($method),
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_HEADER         => true,
        CURLOPT_SSL_VERIFYPEER => false,
    ]);
    if ($body !== '')    { curl_setopt($ch, CURLOPT_POSTFIELDS, $body); }
    if ($headers)        { curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); }
    if ($cookieJar !== '') {
        curl_setopt($ch, CURLOPT_COOKIEJAR,  $cookieJar);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieJar);
    }
    $raw        = curl_exec($ch);
    $code       = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $error      = curl_error($ch);
    curl_close($ch);
    if ($raw === false) { return [0, $error, []]; }
    return [$code, substr($raw, $headerSize), substr($raw, 0, $headerSize)];
}

function getCsrfToken(string $base): array {
    $jar = sys_get_temp_dir() . '/bondor_test_' . uniqid() . '.txt';
    [$code, $body] = http('GET', $base . '/index.php', [], '', $jar);
    if ($code !== 200) { return ['', $jar]; }
    if (preg_match('/name="csrf-token"\s+content="([^"]+)"/', $body, $m)) {
        return [$m[1], $jar];
    }
    return ['', $jar];
}

// ─── Banner ──────────────────────────────────────────────
echo "\n" . bold(cyan('╔══════════════════════════════════════════════╗')) . "\n";
echo bold(cyan('║   Bondor Bati — Security Test Suite           ║')) . "\n";
echo bold(cyan('╚══════════════════════════════════════════════╝')) . "\n\n";
echo '  Target: ' . cyan($base) . "\n\n";

// ─── Pre-flight ──────────────────────────────────────────
echo bold('▶ Pre-flight: API Health Check') . "\n";
[$code, $body] = http('GET', $apiBase . '/health');
if ($code === 200 && str_contains($body, '"ok"')) {
    pass('API is reachable and healthy');
} else {
    fail('API health check', "HTTP {$code} — make sure XAMPP is running");
    echo "\n  " . red("Cannot proceed without a running server. Exiting.\n\n");
    exit(1);
}

// ==========================================================
//  SECTION 1 — SQL Injection Tests
// ==========================================================
echo "\n" . bold('▶ SQL Injection Tests') . "\n";
echo "  All DB queries use PDO prepared statements.\n  These tests confirm injected SQL is treated as plain data.\n\n";

// 1.1  GET /orders/track — SQL injection in query params
echo '  ' . bold('1.1 GET /orders/track — SQL injection in query params') . "\n";

$sqliPayloads = [
    "' OR '1'='1",
    "' OR 1=1--",
    "'; DROP TABLE orders;--",
    "' UNION SELECT 1,2,3,4,5--",
    '" OR "1"="1',
    "1' AND SLEEP(3)--",
    "%27%20OR%20%271%27%3D%271",
];

foreach ($sqliPayloads as $payload) {
    $url = $apiBase . '/orders/track?order_number=' . urlencode($payload) . '&phone=' . urlencode($payload);
    [$code, $body] = http('GET', $url);

    if ($code === 404) {
        pass('Payload blocked (404) — ' . substr($payload, 0, 40));
    } elseif ($code === 422) {
        pass('Payload rejected (422 validation) — ' . substr($payload, 0, 40));
    } elseif ($code === 200 && str_contains($body, '"order_number"')) {
        fail('INJECTION LEAKED DATA — ' . substr($payload, 0, 40), 'HTTP 200 with order rows returned');
    } elseif ($code === 500) {
        warn('Server error (500) on payload — ' . substr($payload, 0, 40), 'possible DB error details');
    } else {
        pass("No data leak (HTTP {$code}) — " . substr($payload, 0, 40));
    }
}

// 1.2  POST /orders — SQL injection in JSON body fields
echo "\n  " . bold('1.2 POST /orders — SQL injection in JSON body fields') . "\n";

[$csrf, $jar] = getCsrfToken($base);
if ($csrf === '') {
    warn('Could not fetch CSRF token — POST injection tests skipped');
} else {
    $headers = ['Content-Type: application/json', "X-CSRF-Token: {$csrf}"];
    $fieldPayloads = [
        'customer_name' => "Robert'); DROP TABLE orders;--",
        'phone'         => "' OR 1=1--",
        'address'       => "' UNION SELECT password FROM admins--",
        'delivery_date' => "' OR SLEEP(2)--",
        'notes'         => "'; INSERT INTO orders(status) VALUES('hacked');--",
    ];
    foreach ($fieldPayloads as $field => $payload) {
        $orderBody = json_encode([
            'customer_name'   => $field === 'customer_name' ? $payload : 'Test User',
            'phone'           => $field === 'phone'         ? $payload : '01700000000',
            'address'         => $field === 'address'       ? $payload : '123 Test St',
            'delivery_date'   => $field === 'delivery_date' ? $payload : date('Y-m-d', strtotime('+1 day')),
            'notes'           => $field === 'notes'         ? $payload : '',
            'items'           => [['id' => 1, 'quantity' => 1]],
            'idempotency_key' => bin2hex(random_bytes(16)),
        ]);
        [$code, $body] = http('POST', $apiBase . '/orders', $headers, $orderBody, $jar);
        if ($code === 422 || $code === 201) {
            pass("Field '{$field}' safely handled (HTTP {$code})");
        } elseif ($code === 500) {
            warn("Field '{$field}' caused 500 — check server logs for SQL errors");
        } elseif ($code === 403) {
            warn("CSRF check failed — could not test field '{$field}'");
        } else {
            pass("Field '{$field}' returned HTTP {$code} — no injection detected");
        }
    }
}

// ==========================================================
//  SECTION 2 — CSRF Protection Tests
// ==========================================================
echo "\n" . bold('▶ CSRF Protection Tests') . "\n";

$dummyJson = json_encode(['customer_name'=>'Eve','phone'=>'01234','address'=>'x','delivery_date'=>'2026-01-01','items'=>[],'idempotency_key'=>'x']);

// 2.1 No token
[$code2, $body2] = http('POST', $apiBase . '/orders', ['Content-Type: application/json'], $dummyJson);
if ($code2 === 403) {
    pass('POST without CSRF token rejected (403 Forbidden)');
} else {
    fail('POST without CSRF token should return 403', "Got HTTP {$code2}");
}

// 2.2 Forged token
[$code3] = http('POST', $apiBase . '/orders', ['Content-Type: application/json', 'X-CSRF-Token: forged_bad_token_123456789abcdef'], $dummyJson);
if ($code3 === 403) {
    pass('POST with forged CSRF token rejected (403 Forbidden)');
} else {
    fail('POST with forged CSRF token should return 403', "Got HTTP {$code3}");
}

// ==========================================================
//  SECTION 3 — DDoS / Rate-Limiting Tests
// ==========================================================
echo "\n" . bold('▶ DDoS / Rate-Limiting Tests') . "\n";
echo '  App limits checkout to 8 attempts per 60 s per session.' . "\n\n";

[$csrf4, $jar4] = getCsrfToken($base);
if ($csrf4 === '') {
    warn('Could not obtain CSRF token — rate-limit tests skipped');
} else {
    $headers4 = ['Content-Type: application/json', "X-CSRF-Token: {$csrf4}"];
    $rateLimitHit = false;
    $attempt      = 0;
    $maxAttempts  = 12;
    echo "  Firing {$maxAttempts} rapid POST /orders requests on same session...\n";

    for ($i = 1; $i <= $maxAttempts; $i++) {
        $body5 = json_encode([
            'customer_name'   => 'Rate Limit Tester',
            'phone'           => '01700000001',
            'address'         => '1 Test Road',
            'delivery_date'   => date('Y-m-d', strtotime('+1 day')),
            'notes'           => '',
            'items'           => [['id' => 1, 'quantity' => 1]],
            'idempotency_key' => bin2hex(random_bytes(8)),
        ]);
        [$code5] = http('POST', $apiBase . '/orders', $headers4, $body5, $jar4);
        $attempt = $i;
        if ($code5 === 429) {
            $rateLimitHit = true;
            pass("Rate limit triggered at attempt #{$i} (429 Too Many Requests)");
            break;
        } elseif ($code5 === 403) {
            warn("CSRF mismatch at attempt #{$i} — session may have rotated");
            break;
        } else {
            echo '  ' . yellow("  attempt #{$i}: HTTP {$code5} (allowed)\n");
        }
        usleep(50_000);
    }

    if (!$rateLimitHit) {
        fail("Rate limit NOT triggered after {$maxAttempts} attempts", 'Expected 429 at attempt ≥ 9');
    } else {
        // Boundary check
        if ($attempt <= 9) {
            pass('Rate limit fires at the correct boundary (≤ 9 attempts)');
        } else {
            warn('Rate limit fired late — boundary may be off', "Triggered at attempt {$attempt}");
        }
    }
}

// ==========================================================
//  SECTION 4 — Endpoint Enumeration / 404s
// ==========================================================
echo "\n" . bold('▶ Endpoint Enumeration (Unknown Routes)') . "\n";

foreach (['/admin','/config','/phpinfo','/orders/all','/users','/.env'] as $route) {
    [$code6] = http('GET', $apiBase . $route);
    if ($code6 === 404) {
        pass("Unknown route returns 404 — {$route}");
    } elseif ($code6 === 200) {
        fail("Unknown route {$route} returned 200 — possible data leak");
    } else {
        pass("Unknown route {$route} returns HTTP {$code6} (no data leak)");
    }
}

// ==========================================================
//  SECTION 5 — HTTP Security Headers
// ==========================================================
echo "\n" . bold('▶ HTTP Security Headers') . "\n\n";
[$code7, , $rawHeaders7] = http('GET', $base . '/index.php');
foreach ([
    'x-content-type-options'  => 'nosniff',
    'x-frame-options'         => null,
    'content-security-policy' => null,
    'referrer-policy'         => null,
] as $header => $expected) {
    if (stripos($rawHeaders7, $header . ':') !== false) {
        if ($expected === null || stripos($rawHeaders7, $header . ': ' . $expected) !== false) {
            pass("Header present: {$header}");
        } else {
            warn("Header {$header} present but value differs from recommended '{$expected}'");
        }
    } else {
        warn("Missing security header: {$header}");
    }
}

// ==========================================================
//  SUMMARY
// ==========================================================
echo "\n" . bold(cyan('═══════════════════════════════════════════════')) . "\n";
echo bold('  Security Test Summary') . "\n";
echo bold(cyan('═══════════════════════════════════════════════')) . "\n";
printf('  %-10s %s' . "\n", green('PASSED:'),   (string) $passed);
printf('  %-10s %s' . "\n", red('FAILED:'),     (string) $failed);
printf('  %-10s %s' . "\n", yellow('WARNINGS:'), (string) $warnings);
echo "\n";
if ($failed === 0 && $warnings === 0) {
    echo green('  ✔ All checks passed — your app looks solid!') . "\n\n";
} elseif ($failed === 0) {
    echo yellow('  ⚠ No hard failures, but review warnings above.') . "\n\n";
} else {
    echo red("  ✘ {$failed} check(s) failed — review the output above.") . "\n\n";
}
exit($failed > 0 ? 1 : 0);
