CREATE DATABASE IF NOT EXISTS lumbertycoon2;
USE lumbertycoon2;

-- Remover tabelas anteriores, respeitando as dependências
DROP TABLE IF EXISTS machados;
DROP TABLE IF EXISTS categoria_machado;
DROP TABLE IF EXISTS raridade;

-- Tabela de categorias
CREATE TABLE categoria_machado (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela de raridades
CREATE TABLE raridade (
    id_raridade INT AUTO_INCREMENT PRIMARY KEY,
    nome_raridade VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela principal de machados
CREATE TABLE machados (
    id_machado INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_raridade INT NOT NULL,
    nome_machado VARCHAR(100) NOT NULL UNIQUE,
    preco DECIMAL(10,2) DEFAULT NULL,
    local_obtencao VARCHAR(150) DEFAULT NULL,
    madeira_eficiencia VARCHAR(100) DEFAULT NULL,
    descricao TEXT DEFAULT NULL,

    CONSTRAINT fk_machado_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria_machado(id_categoria),

    CONSTRAINT fk_machado_raridade
        FOREIGN KEY (id_raridade)
        REFERENCES raridade(id_raridade)
);

-- Categorias
INSERT INTO categoria_machado (nome_categoria) VALUES
('Inicial'),
('Comercial'),
('Especial'),
('Evento'),
('Exclusivo');

-- Raridades
INSERT INTO raridade (nome_raridade) VALUES
('Comum'),
('Incomum'),
('Raro'),
('Épico'),
('Lendário');

-- Dados iniciais de exemplo
INSERT INTO machados (
    id_categoria,
    id_raridade,
    nome_machado,
    preco,
    local_obtencao,
    madeira_eficiencia,
    descricao
) VALUES
(1, 1, 'Basic Hatchet', NULL, 'Loja inicial', NULL, 'Machado básico'),
(2, 1, 'Plain Axe', NULL, 'Loja de machados', NULL, 'Machado comercial'),
(2, 1, 'Rookie Axe', NULL, 'Loja de machados', NULL, 'Machado para iniciantes'),
(3, 4, 'End Times Axe', NULL, 'Área especial', NULL, 'Machado especial'),
(3, 3, 'Fire Axe', NULL, 'Área especial', NULL, 'Machado temático de fogo'),
(3, 3, 'Cave Axe', NULL, 'Caverna', NULL, 'Machado encontrado em uma caverna');

-- Conferência dos registros
SELECT
    m.*,
    c.nome_categoria,
    r.nome_raridade
FROM machados m
LEFT JOIN categoria_machado c
    ON m.id_categoria = c.id_categoria
LEFT JOIN raridade r
    ON m.id_raridade = r.id_raridade;
