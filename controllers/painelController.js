module.exports = {
  render: (req, res) => {
    const usuario = req.session.user.email;
    let html = `
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Painel de Atendimento</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-white text-slate-900 antialiased">

<header class="fixed top-0 left-0 right-0 bg-red-600 text-white px-6 py-3 flex justify-between items-center shadow z-50">
  <span class="text-sm">Logado como: <strong>${usuario}</strong></span>
  <a href="/auth/logout" class="underline hover:text-red-200 text-sm">Sair</a>
</header>

<main class="max-w-5xl mx-auto pt-20 pb-10 px-4">
  <h1 class="text-2xl font-bold text-red-700 text-center mb-8 flex items-center justify-center gap-2">
    <i data-lucide="bell-ring" class="h-6 w-6"></i>
    Painel de Atendimento — Novos Formulários
  </h1>

  <section id="alertas" class="space-y-4"></section>
  <section class="mt-10">
    <h2 class="text-lg font-semibold text-red-700 flex items-center gap-2 mb-3">
      <i data-lucide="clock" class="h-5 w-5"></i>
      Últimos formulários recebidos
    </h2>
    <ul id="historico" class="space-y-3"></ul>
  </section>
</main>

<audio id="audio-alerta" src="/assets/alert.mp3" preload="auto"></audio>
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();
  const alertas = document.getElementById('alertas');
  const historico = document.getElementById('historico');
  const audio = document.getElementById('audio-alerta');

  socket.on('novo_formulario', (dados) => {
    const alerta = document.createElement('div');
    alerta.className = 'bg-white border-l-8 border-red-600 shadow-md rounded-xl p-5 transition-all hover:shadow-lg';
    alerta.innerHTML = '<div class="flex items-start justify-between">'+
        '<div>'+
          '<h3 class="font-bold text-red-700 text-lg mb-1 flex items-center gap-2">'+
            '<i data-lucide="user-plus" class="h-5 w-5"></i>'+
            'Novo visitante'+
          '</h3>'+
          '<p class="text-sm text-slate-700 leading-relaxed">'+
            '<strong>Nome:</strong> '+(dados.nome_visitante || 'N/A')+'<br>'+
            '<strong>Consultora:</strong> '+(dados.consultora || 'N/A')+'<br>'+
            '<strong>Unidade:</strong> '+(dados.unidade || 'N/A')+'<br>'+
            '<strong>Horário:</strong> '+new Date(dados.data_horario_visita).toLocaleString('pt-BR')+
          '</p>'+
        '</div>'+
      '</div>';
    alertas.prepend(alerta);

    const item = document.createElement('li');
    item.className = 'bg-red-50 border border-red-100 rounded-xl p-3 flex justify-between items-center shadow-sm';
    item.innerHTML =
      '<div class="text-sm text-slate-800">'+
        '<span class="font-semibold">'+(dados.nome_visitante || 'N/A')+'</span> — '+
        (dados.consultora || 'N/A')+' — '+
        (dados.unidade || 'N/A')+
      '</div>'+
      '<span class="text-xs text-slate-500">'+new Date(dados.data_horario_visita).toLocaleTimeString('pt-BR')+'</span>';

    historico.prepend(item);
    if (historico.children.length > 5) historico.removeChild(historico.lastChild);

    audio.play().catch(err => console.warn('Falha ao tocar áudio:', err));
    lucide.createIcons();
  });
</script>

<script>lucide.createIcons();</script>
</body>
</html>`;

    res.send(html);
  }
};