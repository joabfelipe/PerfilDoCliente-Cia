const mongoose = require('../config/db');

const FormSchema = new mongoose.Schema({
  tipo_visita: String,
  nome_visitante: String,
  codigo_cadastro: String,
  consultora: String,
  unidade: String,
  data_horario_visita: Date,
  atividade_fisica: String,
  qual_atividade: String,
  forma_fisica: String,
  outra_academia: String,
  qual_academia: String,
  horario: [String],
  modalidade_interesse: String,
  importancia: [String],
  motivacao: [String],
  motivacao_outros: String,
  obs_atividade_fisica: String,
  obs_forma_fisica: String,
  obs_outra_academia: String,
  obs_horario: String,
  obs_modalidade: String,
  obs_importancia: String,
  obs_motivo: String,
  observacoes: String
});

module.exports = mongoose.models.Formulario || mongoose.model('Formulario', FormSchema);