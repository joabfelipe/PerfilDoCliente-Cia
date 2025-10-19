const Formulario = require('../models/formModel');

module.exports = {
  list: async (req, res) => {
    const registros = await Formulario.find().sort({ data_horario_visita: -1 });
    let html = `
    <!doctype html>
    <html lang="pt-BR" class="h-full">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <title>Histórico de Visitantes</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://unpkg.com/lucide@latest"></script>
      <style>
        * { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
        *::-webkit-scrollbar { width: 8px; height: 8px; }
        *::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 999px; }
      </style>
    </head>
    <body class="bg-white text-slate-900 antialiased">
      <header class="bg-red-600 text-white px-6 py-3 flex justify-between items-center shadow">
        <h1 class="text-lg font-semibold">Histórico de Visitantes</h1>
        <a href="/index" class="underline hover:text-red-200 text-sm">Voltar ao início</a>
      </header>
      <main class="max-w-5xl mx-auto my-10 px-4">
        <div class="bg-white border border-red-100 rounded-2xl shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-red-700 flex items-center gap-2">
              <i data-lucide="users" class="h-5 w-5"></i> Visitantes cadastrados
            </h2>
            <a href="/formulario" class="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition">
              <i data-lucide="plus-circle" class="h-4 w-4"></i> Novo visitante
            </a>
          </div>
          <div class="overflow-x-auto border border-red-100 rounded-xl">
            <table class="min-w-full text-sm text-left">
              <thead class="bg-red-600 text-white">
                <tr>
                  <th class="px-4 py-2 font-medium">Nome</th>
                  <th class="px-4 py-2 font-medium">Consultora</th>
                  <th class="px-4 py-2 font-medium">Unidade</th>
                  <th class="px-4 py-2 font-medium">Data da Visita</th>
                  <th class="px-4 py-2 font-medium text-center">Ação</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-red-100 bg-white">
                ${registros.map(item => `
                  <tr class="hover:bg-red-50 transition">
                    <td class="px-4 py-2">${item.nome_visitante || '—'}</td>
                    <td class="px-4 py-2">${item.consultora || '—'}</td>
                    <td class="px-4 py-2">${item.unidade || '—'}</td>
                    <td class="px-4 py-2">${new Date(item.data_horario_visita).toLocaleString('pt-BR')}</td>
                    <td class="px-4 py-2 text-center">
                      <a href="/historico/${item._id}" class="inline-flex items-center gap-1 text-red-600 font-medium hover:underline">
                        <i data-lucide="file-text" class="h-4 w-4"></i> Ver / Editar
                      </a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <script>lucide.createIcons();</script>
    </body>
    </html>`;
    res.send(html);
  },

  detail: async (req, res) => {
    try {
      const item = await Formulario.findById(req.params.id);
      if (!item) return res.status(404).send('Formulário não encontrado');
      res.render('historico_detalhe', { item });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao carregar formulário');
    }
  },

  update: async (req, res) => {
    try {
      const campos = [
        'obs_atividade_fisica',
        'obs_forma_fisica',
        'obs_outra_academia',
        'obs_horario',
        'obs_modalidade',
        'obs_importancia',
        'obs_motivo',
        'observacoes',
      ];
      const atualizacoes = {};
      campos.forEach(c => { if (req.body[c] !== undefined) atualizacoes[c] = req.body[c]; });
      await Formulario.findByIdAndUpdate(req.params.id, atualizacoes, { new: true });
      res.redirect(`/historico/${req.params.id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao salvar observações');
    }
  },

  updateCo: async (req, res) => {
    try {
      let dataVisita = new Date(req.body.data_horario_visita);
      if (isNaN(dataVisita)) {
        const orig = await Formulario.findById(req.params.id, 'data_horario_visita');
        dataVisita = orig.data_horario_visita;
      }
      const atualizacao = {
        obs_atividade_fisica: req.body.obs_atividade_fisica,
        obs_forma_fisica: req.body.obs_forma_fisica,
        obs_outra_academia: req.body.obs_outra_academia,
        obs_horario: req.body.obs_horario,
        obs_modalidade: req.body.obs_modalidade,
        obs_importancia: req.body.obs_importancia,
        obs_motivo: req.body.obs_motivo,
        observacoes: req.body.observacoes,
        data_horario_visita: dataVisita,
      };
      await Formulario.findByIdAndUpdate(req.params.id, atualizacao);
      res.redirect('/historico');
    } catch (err) {
      console.error('Erro ao atualizar formulário:', err);
      res.status(500).send('Erro ao salvar');
    }
  },

  apiHistorico: async (req, res) => {
    try {
      const registros = await Formulario.find().sort({ data_horario_visita: -1 });
      res.json(registros);
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
      res.status(500).json({ erro: 'Erro ao carregar o histórico.' });
    }
  },
};