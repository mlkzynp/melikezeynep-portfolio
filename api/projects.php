<?php
require_once '../config.php';
header('Content-Type: application/json');

 $method = $_SERVER['REQUEST_METHOD'];

// GET → Tüm projeleri listele (herkese açık)
if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $project = $stmt->get_result()->fetch_assoc();
        echo json_encode($project ?: ['error' => 'Proje bulunamadı']);
    } else {
        $result = $conn->query("SELECT * FROM projects ORDER BY created_at DESC");
        $projects = [];
        while ($row = $result->fetch_assoc()) {
            $row['technologies'] = explode(',', $row['technologies']);
            $projects[] = $row;
        }
        echo json_encode($projects);
    }
}

// POST → Yeni proje ekle (admin)
if ($method === 'POST') {
    requireAuth();
    $data = json_decode(file_get_contents('php://input'), true);
    $techs = is_array($data['technologies']) ? implode(',', $data['technologies']) : $data['technologies'];

    $stmt = $conn->prepare("INSERT INTO projects (title, description, technologies, image_url, project_link, github_link) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('ssssss',
        $data['title'], $data['description'], $techs,
        $data['image_url'] ?? '', $data['project_link'] ?? '', $data['github_link'] ?? ''
    );
    $stmt->execute();
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
}

// PUT → Proje güncelle (admin)
if ($method === 'PUT') {
    requireAuth();
    $data = json_decode(file_get_contents('php://input'), true);
    $techs = is_array($data['technologies']) ? implode(',', $data['technologies']) : $data['technologies'];

    $stmt = $conn->prepare("UPDATE projects SET title=?, description=?, technologies=?, image_url=?, project_link=?, github_link=? WHERE id=?");
    $stmt->bind_param('ssssssi',
        $data['title'], $data['description'], $techs,
        $data['image_url'] ?? '', $data['project_link'] ?? '', $data['github_link'] ?? '',
        $data['id']
    );
    $stmt->execute();
    echo json_encode(['success' => true]);
}

// DELETE → Proje sil (admin)
if ($method === 'DELETE') {
    requireAuth();
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'ID gerekli']);
    }
}