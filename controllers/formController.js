const Formulario = require('../models/formModel');

module.exports = {
  renderPage: (req, res) => {
    const usuario = req.session.user.email;
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Formulário de Visitantes</title>
      <style>
        :root { --vermelho: #c8102e; --fundo: #f9f9f9; --texto: #333; }
        body { font-family: "Inter", Arial, sans-serif; background: var(--fundo); margin: 0; padding-top: 70px; color: var(--texto); }
        header { position: fixed; top: 0; left: 0; right: 0; background: var(--vermelho); color: #fff; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 6px rgba(0,0,0,0.2); z-index: 1000; }
        header span { font-size: 15px; }
        header strong { font-weight: 600; }
        a.logout { color: #fff; text-decoration: none; font-size: 15px; transition: opacity 0.2s ease; }
        a.logout:hover { opacity: 0.8; }
        .container { max-width: 1000px; margin: 0 auto; padding: 24px; }
        iframe { width: 100%; min-height: 1000px; border: none; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        @media (max-width: 768px) { header { flex-direction: column; align-items: flex-start; gap: 8px; } .container { padding: 16px; } iframe { min-height: 1200px; } }
      </style>
    </head>
    <body>
      <header>
        <span>Logado como: <strong>${usuario}</strong></span>
        <a class="logout" href="/auth/logout">Sair</a>
      </header>
      <div class="container">
        <iframe src="/assets/formulario.html" title="Formulário do Visitante"></iframe>
      </div>
    </body>
    </html>`;
    res.send(html);
  },

  create: async (req, res) => {
    try {
      const dadosForm = {
        ...req.body,
        data_horario_visita: new Date(req.body.data_horario_visita),
      };

      const novo = new Formulario(dadosForm);
      await novo.save();

      if (req.io) {
        req.io.emit('novo_formulario', {
          ...dadosForm,
          data_horario_visita: novo.data_horario_visita,
        });
      }

      res.send('<h2>Formulário enviado com sucesso! Obrigado pela visita.</h2>');
    } catch (e) {
      console.error('Erro ao salvar formulário:', e);
      res.status(500).send('Erro');
    }
  },
};