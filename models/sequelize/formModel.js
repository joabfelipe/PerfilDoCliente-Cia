const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbOracle');

const jsonField = (fieldName) => ({
  type: DataTypes.TEXT,
  allowNull: true,
  get() {
    const raw = this.getDataValue(fieldName);
    try { return raw ? JSON.parse(raw) : []; } catch { return []; }
  },
  set(val) {
    this.setDataValue(fieldName, JSON.stringify(val || []));
  },
});

const Formulario = sequelize.define('Formulario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo_visita: { type: DataTypes.STRING },
  nome_visitante: { type: DataTypes.STRING },
  codigo_cadastro: { type: DataTypes.STRING },
  consultora: { type: DataTypes.STRING },
  unidade: { type: DataTypes.STRING },
  data_horario_visita: { type: DataTypes.DATE },
  atividade_fisica: { type: DataTypes.STRING },
  qual_atividade: { type: DataTypes.STRING },
  forma_fisica: { type: DataTypes.STRING },
  outra_academia: { type: DataTypes.STRING },
  qual_academia: { type: DataTypes.STRING },
  horario: jsonField('horario'),
  modalidade_interesse: { type: DataTypes.STRING },
  importancia: jsonField('importancia'),
  motivacao: jsonField('motivacao'),
  motivacao_outros: { type: DataTypes.STRING },
  obs_atividade_fisica: { type: DataTypes.STRING },
  obs_forma_fisica: { type: DataTypes.STRING },
  obs_outra_academia: { type: DataTypes.STRING },
  obs_horario: { type: DataTypes.STRING },
  obs_modalidade: { type: DataTypes.STRING },
  obs_importancia: { type: DataTypes.STRING },
  obs_motivo: { type: DataTypes.STRING },
  observacoes: { type: DataTypes.STRING },
}, {
  tableName: 'Formulario',
  timestamps: false,
});

module.exports = Formulario;