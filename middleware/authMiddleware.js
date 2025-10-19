
function proteger(perfisPermitidos) {
  return function(req, res, next) {
    // Impede cache em rotas protegidas
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    if (req.session && req.session.user && perfisPermitidos.includes(req.session.user.perfil)) {
      return next();
    }

    return res.status(403).send('Acesso negado.');
  };
}

module.exports = proteger;
