const User = require('../models/userModel');

module.exports = {
  index: async (req, res) => {
    const users = await User.find();
    let html = `
    <!doctype html>
<html lang="pt-BR" class="h-full">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Painel Administrativo</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    * { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
    *::-webkit-scrollbar { width: 8px; height: 8px; }
    *::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 999px; }
  </style>
</head>

<body class="h-full bg-white text-slate-900 antialiased">
  <header class="fixed top-0 left-0 right-0 bg-red-600 text-white px-6 py-3 flex justify-between items-center shadow z-50">
    <span>Logado como: <strong>${req.session.user.email}</strong></span>
    <a href="/auth/logout" class="underline hover:text-red-200">Sair</a>
  </header>

  <nav class="mt-14 bg-red-50 border-y border-red-100 px-4 py-3 flex flex-wrap gap-2 justify-center shadow-sm">
    <a href="/formulario" class="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition">
      <i data-lucide="file-text" class="h-4 w-4"></i> Formulário
    </a>
    <a href="/historico" class="inline-flex items-center gap-2 border border-red-200 bg-white text-red-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition">
      <i data-lucide="clock" class="h-4 w-4"></i> Histórico
    </a>
    <a href="/painel" class="inline-flex items-center gap-2 border border-red-200 bg-white text-red-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition">
      <i data-lucide="monitor" class="h-4 w-4"></i> Painel Consultora
    </a>
    <a href="/index" class="inline-flex items-center gap-2 border border-red-200 bg-white text-red-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition">
      <i data-lucide="home" class="h-4 w-4"></i> Tela Inicial
    </a>
  </nav>

  <main class="max-w-5xl mx-auto mt-10 mb-20 px-4">
    <div class="bg-white border border-red-100 rounded-2xl shadow-md p-6 space-y-8">
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-red-700 flex items-center gap-2">
            <i data-lucide="users" class="h-5 w-5"></i> Usuários Cadastrados
          </h2>
        </div>
        <div class="overflow-x-auto border border-red-100 rounded-xl">
          <table class="min-w-full text-sm text-left">
            <thead class="bg-red-600 text-white">
              <tr>
                <th class="px-4 py-2 font-medium">Email</th>
                <th class="px-4 py-2 font-medium">Perfil</th>
                <th class="px-4 py-2 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-red-100 bg-white">
              {{USUARIOS}}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-red-700 flex items-center gap-2">
          <i data-lucide="user-plus" class="h-5 w-5"></i> Novo Usuário
        </h2>
        <form method="POST" action="/admin" class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input type="email" name="email" placeholder="Email" required class="w-full border border-red-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-600 mb-1">Senha</label>
            <input type="password" name="senha" placeholder="Senha" required class="w-full border border-red-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-600 mb-1">Perfil</label>
            <select name="perfil" required class="w-full border border-red-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="gestor">Gestor</option>
              <option value="vendedora">Vendedora</option>
              <option value="recepcao">Recepção</option>
              <option value="suporte">Suporte</option>
            </select>
          </div>
          <div class="sm:col-span-2 flex justify-end">
            <button type="submit" class="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-red-700 transition">
              <i data-lucide="check-circle" class="h-4 w-4"></i> Cadastrar
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
  <script>lucide.createIcons();</script>
</body>
</html>`;

    const userRows = users.map(u => `
      <tr>
        <td>${u.email}</td>
        <td>${u.perfil}</td>
        <td class="actions">
          <form method="POST" action="/admin/delete">
            <input type="hidden" name="id" value="${u._id}" />
            <button class="btn-danger">Excluir</button>
          </form>
        </td>
      </tr>
    `).join('');

    html = html.replace('{{USUARIOS}}', userRows);
    res.send(html);
  },

  create: async (req, res) => {
    try {
      const { email, senha, perfil } = req.body;
      const novo = new User({ email, senha, perfil });
      await novo.save();
      res.redirect('/admin');
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      res.status(500).send('Erro ao cadastrar usuário');
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.body;
      await User.findByIdAndDelete(id);
      res.redirect('/admin');
    } catch (err) {
      console.error('Erro ao deletar usuário:', err);
      res.status(500).send('Erro ao deletar usuário');
    }
  },
};