<?php
session_start();

 $host = 'localhost';
 $db   = 'portfolio_db';
 $user = 'root';
 $pass = '';           // XAMPP varsayılan

 $conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Veritabanı bağlantı hatası']));
}

 $conn->set_charset('utf8mb4');

// Oturum kontrolü
function isLoggedIn() {
    return isset($_SESSION['admin']) && $_SESSION['admin'] === true;
}

function requireAuth() {
    if (!isLoggedIn()) {
        http_response_code(401);
        die(json_encode(['error' => 'Yetkisiz erişim']));
    }
}