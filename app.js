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

// Minha edição
app.get('/api/alunos', async (req, res) => {
    try {
        let sql = `
            SELECT
                a.id_aluno,
                a.matricula,
                a.nome AS nome_aluno,
                a.cpf,
                a.celular,
                a.id_curso,
                c.nome_curso
            FROM aluno a, curso c
            WHERE a.id_curso = c.id_curso
        `;

        const parametros = [];

        if (req.query.pesquisa) {
            sql += ` AND (a.nome LIKE ? OR a.matricula LIKE ?)`;

            parametros.push(
                '%' + req.query.pesquisa + '%',
                '%' + req.query.pesquisa + '%'
            );
        }

        sql += ' ORDER BY a.nome';

        const [rows] = await db.query(sql, parametros);

        res.json(rows);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            erro: 'Erro ao buscar alunos: ' + err.message
        });
    }
});

app.get('/cadastro', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM aluno');
    res.render('aluno', { alunos: rows });
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).send('Erro ao buscar alunos');
  };

})
  
//teste

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
