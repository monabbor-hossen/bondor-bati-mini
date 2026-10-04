<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login — Bondor Bati</title>
    <link rel="stylesheet" href="../assets/css/google_fonts_2.css">
    <link rel="stylesheet" href="../assets/css/admin-login.css">
</head>
<body>
<div class="login-card">
    <div class="logo-wrap">
        <img src="../assets/logo.png" alt="Bondor Bati">
        <span>Admin Panel</span>
    </div>
    <h1>Welcome back</h1>

    <?php if ($flashError): ?>
        <div class="alert alert-error"><?= e($flashError) ?></div>
    <?php endif; ?>

    <form method="POST" action="index.php">
        <input type="hidden" name="_action" value="login">
        <label for="username">Username</label>
        <input id="username" name="username" type="text" autocomplete="username" required placeholder="admin">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required placeholder="••••••••">
        <button class="btn-login" type="submit">Sign in</button>
    </form>
    <a class="back-link" href="../index.php">← Back to customer site</a>
</div>
</body>
</html>
