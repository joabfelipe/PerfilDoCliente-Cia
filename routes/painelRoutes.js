const express = require('express');
const router = express.Router();
const proteger = require('../middleware/proteger');
const painel = require('../controllers/painelController');
const index = require('../controllers/indexController');

router.get('/painel', proteger(['gestor','vendedora','suporte']), painel.render);
router.get('/index', proteger(['gestor','vendedora','recepcao','suporte']), index.index);

module.exports = router;