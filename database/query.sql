use easy_study;

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

-- Insert for users
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ('test1@gmail.com', '$argon2id$v=19$m=16,t=2,p=1$a0F1ZVJ1YTlxaG5EbWhyMw$vN7y1uect8m5qf4aDTYBhQ', 'test', 'test', 'STUDENT');
INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    role,
    account_status
)
VALUES (
    'luca.rossi@example.com',
    '$argon2id$v=19$m=16,t=2,p=1$MEQwV3lUN0xjY21MbUdOQQ$hPQY3Sq97tgcqoAkSlQzqw',
    'Luca',
    'Rossi',
    'STUDENT',
    'ACTIVE'
);
VALUES (
    'test2@gmail.com',
    '$argon2id$v=19$m=16,t=2,p=1$OThQczVyRkFYMXNYRWhVdA$AmU6xZpT26V3tF9aHckIuw',
    'Luca',
    'Rossi',
    'STUDENT',
    'ACTIVE'
);
START TRANSACTION;


INSERT INTO help_requests (author_id, title, description, status)
VALUES (
    1,
    'Aiuto equazioni di secondo grado',
    'Come risolvo x² - 5x + 6 = 0?',
    'OPEN'
);

SET @chat1 = LAST_INSERT_ID();

INSERT INTO help_message (request_id, author_id, content)
VALUES
    (@chat1, 1, 'Ciao! Qualcuno può spiegarmi come iniziare?'),
    (@chat1, 2, 'Cerca due numeri con somma 5 e prodotto 6.'),
    (@chat1, 1, 'Sono 2 e 3?'),
    (@chat1, 2, 'Esatto! Scrivi (x - 2)(x - 3) = 0: le soluzioni sono 2 e 3.'),
    (@chat1, 1, 'Perfetto, grazie!');

INSERT INTO help_requests (author_id, title, description, status)
VALUES (
    2,
    'Inviare un form con Express',
    'Come recupero nel backend il testo inviato tramite POST?',
    'OPEN'
);

SET @chat2 = LAST_INSERT_ID();

INSERT INTO help_message (request_id, author_id, content)
VALUES
    (@chat2, 2, 'Ho una textarea con name="text". Come leggo il valore?'),
    (@chat2, 1, 'Nella route POST usa req.body.text.'),
    (@chat2, 2, 'Mi restituisce undefined. Manca qualcosa?'),
    (@chat2, 1, 'Configura app.use(express.urlencoded({ extended: true })) prima delle route.'),
    (@chat2, 2, 'Ora funziona, grazie!');

COMMIT;