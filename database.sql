CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- Kullanıcılar (Admin)
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,           -- password_hash() ile saklanacak
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projeler
CREATE TABLE projects (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(150) NOT NULL,
  description  TEXT,
  technologies VARCHAR(255),                   -- virgülle ayrılmış
  image_url    VARCHAR(500),
  project_link VARCHAR(500),
  github_link  VARCHAR(500),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- İletişim Mesajları
CREATE TABLE messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  subject    VARCHAR(200),
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Varsayılan admin kullanıcı (şifre: admin123)
INSERT INTO users (username, password) VALUES
  ('melike', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Varsayılan projeler
INSERT INTO projects (title, description, technologies, image_url, project_link, github_link) VALUES
('Weather App',
 'OpenWeather API kullanarak gerçek zamanlı hava durumu bilgisi gösteren responsive bir web uygulaması.',
 'HTML5,CSS3,JavaScript',
 'https://picsum.photos/seed/weather-app-proj/600/400.jpg', '#', '#'),

('Task Manager',
 'Sürükle-bırak özelliği ile Kanban tabanlı görev yönetim uygulaması.',
 'HTML5,CSS3,JavaScript',
 'https://picsum.photos/seed/task-manager-proj/600/400.jpg', '#', '#'),

('E-Commerce UI',
 'Modern ve kullanıcı dostu bir e-ticaret arayüzü.',
 'HTML5,CSS3,JavaScript',
 'https://picsum.photos/seed/ecommerce-proj/600/400.jpg', '#', '#');