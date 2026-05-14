<?php
require_once '../config.php';
header('Content-Type: application/json');

 $method = $_SERVER['REQUEST_METHOD'];

// POST  → Giriş
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $conn->real_escape_string($data['username'] ?? '');
    $password = $data['password'] ?? '';

    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if (password_verify($password, $row['password'])) {
            $_SESSION['admin'] = true;
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['username'] = $username;

            // Remember me cookie (30 gün)
            if (!empty($data['remember'])) {
                setcookie('pz_admin_user', $username, time() + 86400 * 30, '/', '', false, true);
            }

            echo json_encode(['success' => true, 'username' => $username]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Hatalı şifre']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Kullanıcı bulunamadı']);
    }
}

// DELETE → Çıkış
if ($method === 'DELETE') {
    session_destroy();
    setcookie('pz_admin_user', '', time() - 3600, '/');
    echo json_encode(['success' => true]);
}

// GET → Oturum durumu
if ($method === 'GET') {
    echo json_encode([
        'loggedIn' => isLoggedIn(),
        'username' => $_SESSION['username'] ?? null
    ]);
}