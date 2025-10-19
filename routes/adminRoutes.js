const express = require('express');
const router = express.Router();
const proteger = require('../middleware/proteger');
const admin = require('../controllers/adminController');

router.get('/admin', proteger(['gestor','suporte']), admin.index);
router.post('/admin', proteger(['gestor','suporte']), admin.create);
router.post('/admin/delete', proteger(['gestor','suporte']), admin.remove);

module.exports = router;