const express = require('express');
const router = express.Router();
const form = require('../controllers/formController');
const proteger = require('../middleware/proteger');

router.get('/formulario', proteger(['gestor','vendedora','suporte','recepcao']), form.renderPage);
router.post('/submit', proteger(['gestor','vendedora','recepcao','suporte']), form.create);

module.exports = router;