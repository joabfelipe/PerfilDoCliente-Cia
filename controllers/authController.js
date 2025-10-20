const path = require('path');
const { users } = require('../db');

module.exports = {
  getLogin: (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
  },

  postLogin: async (req, res) => {
    try {
      const { email, senha } = req.body;
      const user = await users.findOneByEmail(email);

      if (!user) return res.status(401).send('Credenciais inválidas');

      const senhaValida = await user.validarSenha(senha);
      if (!senhaValida) return res.status(401).send('Credenciais inválidas');

      req.session.user = {
        id: user._id,
        email: user.email,
        perfil: user.perfil,
      };

      if (user.perfil === 'suporte') {
        res.redirect('/admin');
      } else {
        res.redirect('/index');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      res.status(500).send('Erro interno no servidor');
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  },
};