module.exports = (err, req, res, next) => {
  console.error('Erro não tratado:', err);
  const status = err.status || 500;
  res.status(status).json({
    erro: true,
    mensagem: err.message || 'Erro interno no servidor'
  });
};