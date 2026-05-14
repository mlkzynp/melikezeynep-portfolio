<?php
require_once '../config.php';
header('Content-Type: application/json');

 $method = $_SERVER['REQUEST_METHOD'];

// GET → Mesajları listele (admin)
if ($method === 'GET') {
    requireAuth();
    $result = $conn->query("SELECT * FROM messages ORDER BY created_at DESC");
    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
    echo json_encode($messages);
}

// POST → Yeni mesaj gönder (herkese açık)
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $name    = $conn->real_escape_string($data['name'] ?? '');
    $email   = $conn->real_escape_string($data['email'] ?? '');
    $subject = $conn->real_escape_string($data['subject'] ?? '');
    $message = $conn->real_escape_string($data['message'] ?? '');

    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        http_response_code(400);
        echo json_encode(['error' => 'Tüm alanlar zorunludur']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Geçersiz e-posta']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('ssss', $name, $email, $subject, $message);
    $stmt->execute();
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
}

// PUT → Mesajı okundu işaretle (admin)
if ($method === 'PUT') {
    requireAuth();
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("UPDATE messages SET is_read = ? WHERE id = ?");
    $isRead = $data['is_read'] ? 1 : 0;
    $stmt->bind_param('ii', $isRead, $data['id']);
    $stmt->execute();
    echo json_encode(['success' => true]);
}

// DELETE → Mesaj sil (admin)
if ($method === 'DELETE') {
    requireAuth();
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $conn->prepare("DELETE FROM messages WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        echo json_encode(['success' => true]);
    }
}