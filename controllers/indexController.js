module.exports = {
  index: (req, res) => {
    const html = `
    <!doctype html>
<html lang="pt-BR" class="h-full">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Perfil do Cliente — Bem-vindo</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    * { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
    *::-webkit-scrollbar { width: 8px; height: 8px; }
    *::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 999px; }
  </style>
</head>

<body class="h-full bg-white text-slate-900 antialiased">
  <header class="bg-red-600 text-white px-6 py-3 flex justify-between items-center shadow">
    <h1 class="text-lg font-semibold tracking-tight">Perfil do Cliente</h1>
    <div class="text-sm">
      Logado como: <strong>${req.session.user.email}</strong>
      <a href="/auth/logout" class="ml-2 underline hover:text-red-200">Sair</a>
    </div>
  </header>
  <main class="h-[calc(100vh-64px)] grid place-items-center p-4">
    <div class="bg-white border border-red-100 rounded-2xl shadow-md p-8 w-full max-w-md text-center space-y-6">
      <div>
        <div class="mx-auto h-12 w-12 rounded-xl bg-red-600 text-white grid place-items-center mb-4 shadow">
          <i data-lucide="user" class="h-6 w-6"></i>
        </div>
        <h2 class="text-2xl font-semibold text-red-700">Bem-vindo</h2>
        <p class="text-slate-500 text-sm mt-1">Escolha uma das opções abaixo para continuar</p>
      </div>
      <div class="space-y-3">
        <a href="/formulario" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-white font-medium px-4 py-3 hover:bg-red-700 transition shadow-sm">
          <i data-lucide="file-text" class="h-4 w-4"></i> Preencher Novo Formulário
        </a>
        <a href="/historico" class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-red-700 font-medium px-4 py-3 hover:bg-red-50 transition">
          <i data-lucide="clock" class="h-4 w-4"></i> Visualizar Histórico de Formulários
        </a>
        <a href="/painel" class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-red-700 font-medium px-4 py-3 hover:bg-red-50 transition">
          <i data-lucide="monitor" class="h-4 w-4"></i> Abrir Painel da Consultora
        </a>
      </div>
    </div>
  </main>
  <script>lucide.createIcons();</script>
</body>
</html>`;

    res.send(html);
  }
};