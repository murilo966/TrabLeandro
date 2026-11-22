var express = require('express');
var router = express.Router();

/* Página inicial */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Lumber Tycoon 2 - Catálogo de Machados'
    });
});

module.exports = router;
