
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const db = require('./config/db');

var app = express();

// ======================================
// CONFIGURAÇÕES DO EXPRESS
// ======================================

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ======================================
// LISTAR MACHADOS
// ======================================

app.get('/api/machados', async function (req, res) {

    const sql = `
        SELECT
            m.id_machado,
            m.nome_machado,
            m.id_categoria,
            m.id_raridade,
            m.preco,
            m.local_obtencao,
            m.madeira_eficiencia,
            m.descricao,
            c.nome_categoria,
            r.nome_raridade
        FROM machados m
        LEFT JOIN categoria_machado c
            ON m.id_categoria = c.id_categoria
        LEFT JOIN raridade r
            ON m.id_raridade = r.id_raridade
        ORDER BY m.id_machado;
    `;

    try {

        const [resultados] = await db.query(sql);

        res.json(resultados);

    } catch (erro) {

        console.error('Erro ao buscar machados:', erro);

        res.status(500).json({
            erro: 'Não foi possível buscar os machados.',
            detalhe: erro.message
        });

    }

});

// ======================================
// LISTAR CATEGORIAS
// ======================================

app.get('/api/categorias', async function (req, res) {

    const sql = `
        SELECT
            id_categoria,
            nome_categoria
        FROM categoria_machado
        ORDER BY nome_categoria;
    `;

    try {

        const [resultados] = await db.query(sql);

        res.json(resultados);

    } catch (erro) {

        console.error('Erro ao buscar categorias:', erro);

        res.status(500).json({
            erro: 'Não foi possível buscar as categorias.',
            detalhe: erro.message
        });

    }

});

// ======================================
// LISTAR RARIDADES
// ======================================

app.get('/api/raridades', async function (req, res) {

    const sql = `
        SELECT
            id_raridade,
            nome_raridade
        FROM raridade
        ORDER BY id_raridade;
    `;

    try {

        const [resultados] = await db.query(sql);

        res.json(resultados);

    } catch (erro) {

        console.error('Erro ao buscar raridades:', erro);

        res.status(500).json({
            erro: 'Não foi possível buscar as raridades.',
            detalhe: erro.message
        });

    }

});

// ======================================
// CADASTRAR MACHADO
// ======================================

app.post('/api/machados', async function (req, res) {

    const {
        nome_machado,
        id_categoria,
        id_raridade,
        preco,
        local_obtencao,
        madeira_eficiencia,
        descricao
    } = req.body;

    if (
        !nome_machado ||
        !nome_machado.trim() ||
        !id_categoria ||
        !id_raridade
    ) {

        return res.status(400).json({
            erro: 'Nome, categoria e raridade são obrigatórios.'
        });

    }

    const precoNumerico =
        preco === '' || preco == null ? null : Number(preco);

    if (
        precoNumerico !== null &&
        (!Number.isFinite(precoNumerico) || precoNumerico < 0)
    ) {
        return res.status(400).json({
            erro: 'O preço informado é inválido.'
        });
    }

    const sql = `
        INSERT INTO machados (
            nome_machado,
            id_categoria,
            id_raridade,
            preco,
            local_obtencao,
            madeira_eficiencia,
            descricao
        ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const valores = [
        nome_machado.trim(),
        Number(id_categoria),
        Number(id_raridade),
        precoNumerico,
        local_obtencao || null,
        madeira_eficiencia || null,
        descricao || null
    ];

    try {

        const [resultado] = await db.query(sql, valores);

        res.status(201).json({
            mensagem: 'Machado cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {

        console.error('Erro ao cadastrar machado:', erro);

        res.status(500).json({
            erro: 'Não foi possível cadastrar o machado.',
            detalhe: erro.message
        });

    }

});

// ======================================
// EDITAR MACHADO
// ======================================

app.put('/api/machados/:id', async function (req, res) {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {

        return res.status(400).json({
            erro: 'ID inválido.'
        });

    }

    const {
        nome_machado,
        id_categoria,
        id_raridade,
        preco,
        local_obtencao,
        madeira_eficiencia,
        descricao
    } = req.body;

    if (
        !nome_machado ||
        !nome_machado.trim() ||
        !id_categoria ||
        !id_raridade
    ) {

        return res.status(400).json({
            erro: 'Nome, categoria e raridade são obrigatórios.'
        });

    }

    const precoNumerico =
        preco === '' || preco == null ? null : Number(preco);

    if (
        precoNumerico !== null &&
        (!Number.isFinite(precoNumerico) || precoNumerico < 0)
    ) {
        return res.status(400).json({
            erro: 'O preço informado é inválido.'
        });
    }

    const sql = `
        UPDATE machados
        SET
            nome_machado = ?,
            id_categoria = ?,
            id_raridade = ?,
            preco = ?,
            local_obtencao = ?,
            madeira_eficiencia = ?,
            descricao = ?
        WHERE id_machado = ?;
    `;

    const valores = [
        nome_machado.trim(),
        Number(id_categoria),
        Number(id_raridade),
        precoNumerico,
        local_obtencao || null,
        madeira_eficiencia || null,
        descricao || null,
        id
    ];

    try {

        const [resultado] = await db.query(sql, valores);

        if (resultado.affectedRows === 0) {

            const [existentes] = await db.query(
                'SELECT id_machado FROM machados WHERE id_machado = ?',
                [id]
            );

            if (existentes.length === 0) {

                return res.status(404).json({
                    erro: 'Machado não encontrado.'
                });

            }

        }

        res.json({
            mensagem: 'Machado atualizado com sucesso!'
        });

    } catch (erro) {

        console.error('Erro ao editar machado:', erro);

        res.status(500).json({
            erro: 'Não foi possível editar o machado.',
            detalhe: erro.message
        });

    }

});

// ======================================
// EXCLUIR MACHADO
// ======================================

app.delete('/api/machados/:id', async function (req, res) {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {

        return res.status(400).json({
            erro: 'ID inválido.'
        });

    }

    const sql = `
        DELETE FROM machados
        WHERE id_machado = ?;
    `;

    try {

        const [resultado] = await db.query(sql, [id]);

        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                erro: 'Machado não encontrado.'
            });

        }

        res.json({
            mensagem: 'Machado excluído com sucesso!'
        });

    } catch (erro) {

        console.error('Erro ao excluir machado:', erro);

        res.status(500).json({
            erro: 'Não foi possível excluir o machado.',
            detalhe: erro.message
        });

    }

});

// ======================================
// ROTAS PADRÃO DO EXPRESS
// ======================================

app.use('/', indexRouter);
app.use('/users', usersRouter);

// ======================================
// ERRO 404
// ======================================

app.use(function (req, res, next) {

    next(createError(404));

});

// ======================================
// TRATAMENTO GERAL DE ERROS
// ======================================

app.use(function (err, req, res, next) {

    res.locals.message = err.message;

    res.locals.error =
        req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);

    res.render('error');

});

module.exports = app;
