-- EASY STUDY - DATABASE

DROP DATABASE IF EXISTS easy_study;

CREATE DATABASE easy_study
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE easy_study;


--USERS

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,

    profile_image_url VARCHAR(500) NULL,

    role ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',

    account_status ENUM(
        'ACTIVE',
        'BLOCKED'
    ) NOT NULL DEFAULT 'ACTIVE',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    last_login_at DATETIME NULL,

    INDEX idx_users_role (role),
    INDEX idx_users_status (account_status),
    INDEX idx_users_created_at (created_at)
);


--SUBSCRIPTIONS

CREATE TABLE subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    plan ENUM('FREE', 'PREMIUM') NOT NULL DEFAULT 'FREE',

    status ENUM(
        'ACTIVE',
        'EXPIRED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'ACTIVE',

    start_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_subscriptions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_subscriptions_user (user_id),
    INDEX idx_subscriptions_plan (plan),
    INDEX idx_subscriptions_status (status)
);


--PAYMENTS

CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    -- id restituito dal servizio di pagamento
    external_payment_id VARCHAR(255) NULL UNIQUE,

    amount DECIMAL(10,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'CHF',

    status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',

    payment_date DATETIME NULL,

    failure_reason VARCHAR(500) NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_payments_user (user_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_date (payment_date)
);



--MATERIALS

CREATE TABLE materials (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    author_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,

    file_type ENUM(
        'PNG',
        'JPEG',
        'DOCX',
        'PDF'
    ) NOT NULL,

    file_url VARCHAR(1000) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT UNSIGNED NULL,
    download_count INT UNSIGNED NOT NULL DEFAULT 0,

    status ENUM(
        'ACTIVE',
        'REMOVED'
    ) NOT NULL DEFAULT 'ACTIVE',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_materials_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_materials_author (author_id),
    INDEX idx_materials_type (file_type),
    INDEX idx_materials_status (status),
    INDEX idx_materials_title (title)
);


--TAGS

CREATE TABLE group_tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TAGS GROUP
CREATE TABLE tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    group_tags_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (group_tags_id) REFERENCES group_tags(id),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- 6. MATERIAL_TAGS

CREATE TABLE material_tags (
    material_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (material_id, tag_id),

    CONSTRAINT fk_material_tags_material
        FOREIGN KEY (material_id)
        REFERENCES materials(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_material_tags_tag
        FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);


--MATERIAL REPORTS

CREATE TABLE material_reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    material_id BIGINT UNSIGNED NOT NULL,
    reporter_id BIGINT UNSIGNED NOT NULL,

    reason VARCHAR(255) NOT NULL,
    description TEXT NULL,

    status ENUM(
        'PENDING',
        'RESOLVED',
        'REJECTED'
    ) NOT NULL DEFAULT 'PENDING',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_material_reports_material
        FOREIGN KEY (material_id)
        REFERENCES materials(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_material_reports_reporter
        FOREIGN KEY (reporter_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_material_reports_status (status),
    INDEX idx_material_reports_material (material_id)
);

--CALENDAR EVENTS

CREATE TABLE calendar_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT NULL,

    event_date DATE NOT NULL,
    event_time TIME NOT NULL,

    event_name VARCHAR(255) NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_calendar_events_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_calendar_user_date (user_id, event_date)
);


--SUBJECTS

CREATE TABLE subjects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    name VARCHAR(150) NOT NULL,

    semester TINYINT UNSIGNED NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uptaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_subject_semester
        CHECK (semester IN (1, 2)),

    CONSTRAINT fk_subjects_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE KEY uk_subject_user_name_semester
        (user_id, name, semester),

    INDEX idx_subjects_user_semester
        (user_id, semester)
);


--GRADES

CREATE TABLE grades (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    subject_id BIGINT UNSIGNED NOT NULL,

    grade DECIMAL(4,2) NOT NULL,

    description VARCHAR(255) NULL,

    grade_date DATE NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uptaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_grade_value
        CHECK (grade >= 0 AND grade <= 10),

    CONSTRAINT fk_grades_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects(id)
        ON DELETE CASCADE,

    INDEX idx_grades_subject (subject_id),
    INDEX idx_grades_date (grade_date)
);


--HELP REQUESTS

CREATE TABLE help_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    author_id BIGINT UNSIGNED NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    status ENUM(
        'OPEN',
        'RESOLVED',
        'REMOVED'
    ) NOT NULL DEFAULT 'OPEN',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    resolved_at DATETIME NULL,

    CONSTRAINT fk_help_requests_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_help_requests_status (status),
    INDEX idx_help_requests_author (author_id),
    INDEX idx_help_requests_created (created_at)
);


--HELP MESSAGE

CREATE TABLE help_message (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    request_id BIGINT UNSIGNED NOT NULL,
    author_id BIGINT UNSIGNED NOT NULL,
    parent_message_id BIGINT UNSIGNED NULL,

    content TEXT NOT NULL,

    status ENUM(
        'ACTIVE',
        'REMOVED'
    ) NOT NULL DEFAULT 'ACTIVE',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_help_message_request
        FOREIGN KEY (request_id)
        REFERENCES help_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_help_message_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_help_message_parent
        FOREIGN KEY (parent_message_id)
        REFERENCES help_message(id)
        ON DELETE SET NULL,

    INDEX idx_help_message_request (request_id),
    INDEX idx_help_message_author (author_id),
    INDEX idx_help_message_parent (parent_message_id)
);


--NOTIFICATIONS

CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    type ENUM(
        'HELP_REPLY',
        'CALENDAR_EVENT',
        'PAYMENT_SUCCESS',
        'PAYMENT_FAILED',
        'SYSTEM',
        'OTHER'
    ) NOT NULL,

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    reference_id BIGINT UNSIGNED NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_notifications_user_read
        (user_id, is_read),

    INDEX idx_notifications_created
        (created_at)
);


--AI REQUESTS

CREATE TABLE ai_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    request_type ENUM(
        'QUIZ',
        'FLASHCARD'
    ) NOT NULL,

    topic VARCHAR(255) NOT NULL,

    request_content TEXT NULL,

    response_content LONGTEXT NULL,

    status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        'SERVICE_UNAVAILABLE'
    ) NOT NULL DEFAULT 'PENDING',

    error_message TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME NULL,

    CONSTRAINT fk_ai_requests_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_ai_requests_user (user_id),
    INDEX idx_ai_requests_status (status),
    INDEX idx_ai_requests_type (request_type)
);


--MAINTENANCE

CREATE TABLE maintenance (
    id TINYINT UNSIGNED PRIMARY KEY,

    is_active BOOLEAN NOT NULL DEFAULT FALSE,

    message VARCHAR(500) NULL,

    activated_by BIGINT UNSIGNED NULL,

    activated_at DATETIME NULL,

    CONSTRAINT fk_maintenance_admin
        FOREIGN KEY (activated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);


--DATI INIZIALI

INSERT INTO maintenance (
    id,
    is_active
)
VALUES (
    1,
    FALSE
);


--VISTA PER LO STATO DEL PIANO DELL'UTENTE

CREATE VIEW user_subscription_status AS
SELECT
    u.id AS user_id,
    u.email,
    COALESCE(s.plan, 'FREE') AS plan,
    COALESCE(s.status, 'ACTIVE') AS subscription_status,
    s.start_date,
    s.end_date
FROM users u
LEFT JOIN subscriptions s
    ON s.user_id = u.id
    AND s.status = 'ACTIVE';


--VISTA PER LA MEDIA DELLE MATERIE

CREATE VIEW subject_averages AS
SELECT
    s.id AS subject_id,
    s.user_id,
    s.name AS subject_name,
    s.semester,
    ROUND(AVG(g.grade), 2) AS average_grade
FROM subjects s
LEFT JOIN grades g
    ON g.subject_id = s.id
GROUP BY
    s.id,
    s.user_id,
    s.name,
    s.semester;


--VISTA STATISTICHE PROFILO

CREATE VIEW user_profile_statistics AS
SELECT
    u.id AS user_id,

    u.created_at AS registration_date,

    COUNT(DISTINCT m.id) AS shared_materials,

    COUNT(DISTINCT hr.id) AS help_requests,

    COUNT(DISTINCT ce.id) AS calendar_events

FROM users u

LEFT JOIN materials m
    ON m.author_id = u.id
    AND m.status = 'ACTIVE'

LEFT JOIN help_requests hr
    ON hr.author_id = u.id

LEFT JOIN calendar_events ce
    ON ce.user_id = u.id

GROUP BY
    u.id,
    u.created_at;


INSERT INTO group_tags (name) VALUES
('Materie scientifiche'),
('Informatica'),
('Lingue'),
('Materie umanistiche'),
('Arte e sport'),
('Tipo di materiale'),
('Scuola');

INSERT INTO tags (name, group_tags_id) VALUES
-- Materie scientifiche (1)
('Matematica', 1),
('Algebra', 1),
('Geometria', 1),
('Analisi', 1),
('Statistica', 1),
('Fisica', 1),
('Chimica', 1),
('Biologia', 1),
('Scienze naturali', 1),
('Astronomia', 1),
('Geologia', 1),
-- Informatica (2)
('Informatica', 2),
('Programmazione', 2),
('HTML', 2),
('CSS', 2),
('JavaScript', 2),
('Python', 2),
('Java', 2),
('SQL', 2),
('Database', 2),
('Algoritmi', 2),
('Reti', 2),
('Sistemi operativi', 2),
('Sicurezza informatica', 2),
('Intelligenza artificiale', 2),
-- Lingue (3)
('Italiano', 3),
('Inglese', 3),
('Francese', 3),
('Tedesco', 3),
('Spagnolo', 3),
('Grammatica', 3),
('Vocabolario', 3),
('Letteratura', 3),
('Comprensione del testo', 3),
-- Materie umanistiche (4)
('Storia', 4),
('Geografia', 4),
('Filosofia', 4),
('Educazione civica', 4),
('Diritto', 4),
('Economia', 4),
('Psicologia', 4),
('Sociologia', 4),
('Religione', 4),
-- Arte e sport (5)
('Arte', 5),
('Storia dell''arte', 5),
('Disegno tecnico', 5),
('Musica', 5),
('Educazione fisica', 5),
-- Tipo di materiale (6)
('Appunti', 6),
('Riassunto', 6),
('Schema', 6),
('Mappa concettuale', 6),
('Formulario', 6),
('Esercizi', 6),
('Soluzioni', 6),
('Verifica', 6),
('Esame', 6),
('Slide', 6),
('Dispensa', 6),
('Libro di testo', 6),
('Flashcard', 6),
('Progetto', 6),
('Relazione', 6),
('Laboratorio', 6),
-- Scuola (7)
('Elementare', 7),
('Media', 7),
('Superiore', 7),
('Universita', 7);

