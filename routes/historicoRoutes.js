const express = require('express');
const router = express.Router();
const proteger = require('../middleware/proteger');
const historico = require('../controllers/historicoController');

router.get('/historico', proteger(['gestor','vendedora','suporte']), historico.list);
router.get('/historico/:id', proteger(['gestor','vendedora','suporte']), historico.detail);
router.post('/historico/:id', proteger(['gestor','vendedora','suporte']), historico.update);
router.post('/co/:id', proteger(['gestor','vendedora','suporte']), historico.updateCo);
router.get('/api/historico', historico.apiHistorico);

module.exports = router;