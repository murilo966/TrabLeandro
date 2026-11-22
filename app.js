var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const db = require('./config/db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/bestiario', async (req, res) => {
    try {
        let sql = `
            SELECT
                b.id_criatura,
                b.nome AS nome_besta,
                b.localizacao,
                b.ecos,
                b.id_fraqueza,
                b.id_status,
                e.nome_fraqueza,
                s.nome_status
            FROM bestiario b, estatistica e, statuscriatura s
            WHERE b.id_fraqueza = e.id_fraqueza AND b.id_status = s.id_status
        `;

        const parametros = [];

        if (req.query.pesquisa) {
            sql += ` AND (b.nome LIKE ? OR b.localizacao LIKE ?)`;

            parametros.push(
                '%' + req.query.pesquisa + '%',
                '%' + req.query.pesquisa + '%'
            );
        }

        sql += ' ORDER BY b.ecos';

        const [rows] = await db.query(sql, parametros);

        res.json(rows);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            erro: 'Erro ao buscar registro: ' + err.message
        });
    }
});

app.post('/api/bestiario', async (req, res) => {
    try {
        const { nome, localizacao, ecos, id_fraqueza, id_status } = req.body;

        const sql = `
            INSERT INTO bestiario
            (nome, localizacao, ecos, id_fraqueza, id_status)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [resultado] = await db.query(sql, [
            nome,
            localizacao,
            ecos,
            id_fraqueza,
            id_status
        ]);

        res.status(201).json({
            mensagem: 'Registrado com sucesso, bom caçador.',
            id_criatura: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao registrar criatura:', erro);

        res.status(500).json({
            erro: 'Erro ao registrar criatura.'
        });
    }
});

app.put('/api/bestiario/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const { nome, localizacao, ecos, id_fraqueza, id_status } = req.body;

        if (!nome || !localizacao || ecos == null || ecos === '' || !id_fraqueza || !id_status) {
            return res.status(400).json({
                erro: 'Preencha todos os campos.'
            });
        }

        const [resultado] = await db.query(
            `UPDATE bestiario
             SET nome = ?,
                 localizacao = ?,
                 ecos = ?,
                 id_fraqueza = ?,
                 id_status = ?
             WHERE id_criatura = ?`,
            [nome, localizacao, ecos, id_fraqueza, id_status, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Registro não encontrado.'
            });
        }

        res.json({
            mensagem: 'Registro atualizado com sucesso, bom caçador.'
        });

    } catch (erro) {
        console.error('Erro ao atualizar registro:', erro);

        res.status(500).json({
            erro: 'Erro ao atualizar registro.'
        });
    }
});

app.delete('/api/bestiario/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const [resultado] = await db.query(
            'DELETE FROM bestiario WHERE id_criatura = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Registro não encontrado.'
            });
        }

        res.json({
            mensagem: 'Registro deletado com sucesso, bom caçador.'
        });

    } catch (erro) {
        console.error('Erro ao deletar registro:', erro);

        res.status(500).json({
            erro: 'Erro ao deletar registro.'
        });
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;