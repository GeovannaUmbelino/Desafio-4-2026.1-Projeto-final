INSERT INTO "user" (id, name, email, password, role, matricula, "isActive") VALUES
-- Administrador
('a1111111-b222-c333-d444-e55555555555', 'Administrador Geral', 'admin@engnet.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NULL, 1),

-- Professores
('b1111111-b222-c333-d444-e55555555555', 'Roberto Alves Lima', 'roberto@engnet.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professor', '19374672', 1),
('c1111111-b222-c333-d444-e55555555555', 'Ana Paula Souza', 'anapaula@engnet.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professor', '15483920', 1),

-- Alunos
('d1111111-b222-c333-d444-e55555555555', 'João Silva Santos', 'joao@engnet.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'aluno', '20240001', 1),
('e1111111-b222-c333-d444-e55555555555', 'Maria Eduarda Costa', 'maria@engnet.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'aluno', '20240002', 1),
('f1111111-b222-c333-d444-e55555555555', 'Carlos Henrique Lima', 'carlos@engnet.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'aluno', '20240003', 1);



-- Turmas vinculadas aos professores criados acima

INSERT INTO "class" (id, name, code, schedule, "teacherId") VALUES
-- Turma 1 vinculada ao Prof. Roberto
('11111111-2222-3333-4444-555555555555', 'Desenvolvimento Web Full Stack', 'ENG-WEB1', '14:00 - 16:00', 'b1111111-b222-c333-d444-e55555555555'),

-- Turma 2 vinculada à Prof. Ana Paula
('22222222-2222-3333-4444-555555555555', 'Arquitetura de Sistemas', 'ENG-ARQ2', '16:00 - 18:00', 'c1111111-b222-c333-d444-e55555555555');


INSERT INTO "class_students_user" ("classId", "userId") VALUES
-- Matriculando João, Maria e Carlos na Métodos de Engenharia de Software 1
('11111111-2222-3333-4444-555555555555', 'd1111111-b222-c333-d444-e55555555555'),
('11111111-2222-3333-4444-555555555555', 'e1111111-b222-c333-d444-e55555555555'),
('11111111-2222-3333-4444-555555555555', 'f1111111-b222-c333-d444-e55555555555'),

('22222222-2222-3333-4444-555555555555', 'd1111111-b222-c333-d444-e55555555555'),
('22222222-2222-3333-4444-555555555555', 'e1111111-b222-c333-d444-e55555555555');