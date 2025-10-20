const { isMongoose, isSequelize } = require('../config/dbAdapter');

let MForm, SForm;
if (isMongoose) {
  MForm = require('../models/formModel');
} else if (isSequelize) {
  SForm = require('../models/sequelize/formModel');
}

const toPlain = (doc) => {
  if (!doc) return null;
  if (doc.toObject) return doc.toObject();
  if (doc.get) return doc.get({ plain: true });
  return doc;
};

const normalize = (doc) => {
  const plain = toPlain(doc);
  if (!plain) return null;
  return {
    _id: plain._id || plain.id,
    tipo_visita: plain.tipo_visita,
    nome_visitante: plain.nome_visitante,
    codigo_cadastro: plain.codigo_cadastro,
    consultora: plain.consultora,
    unidade: plain.unidade,
    data_horario_visita: plain.data_horario_visita ? new Date(plain.data_horario_visita) : null,
    atividade_fisica: plain.atividade_fisica,
    qual_atividade: plain.qual_atividade,
    forma_fisica: plain.forma_fisica,
    outra_academia: plain.outra_academia,
    qual_academia: plain.qual_academia,
    horario: plain.horario || [],
    modalidade_interesse: plain.modalidade_interesse,
    importancia: plain.importancia || [],
    motivacao: plain.motivacao || [],
    motivacao_outros: plain.motivacao_outros,
    obs_atividade_fisica: plain.obs_atividade_fisica,
    obs_forma_fisica: plain.obs_forma_fisica,
    obs_outra_academia: plain.obs_outra_academia,
    obs_horario: plain.obs_horario,
    obs_modalidade: plain.obs_modalidade,
    obs_importancia: plain.obs_importancia,
    obs_motivo: plain.obs_motivo,
    observacoes: plain.observacoes,
  };
};

module.exports = {
  findSortedByDateDesc: async () => {
    if (isMongoose) {
      const docs = await MForm.find().sort({ data_horario_visita: -1 });
      return docs.map(normalize);
    }
    const rows = await SForm.findAll({ order: [['data_horario_visita', 'DESC']] });
    return rows.map(normalize);
  },
  getById: async (id) => {
    const doc = isMongoose ? await MForm.findById(id) : await SForm.findByPk(id);
    return normalize(doc);
  },
  updateById: async (id, updates) => {
    if (isMongoose) {
      const doc = await MForm.findByIdAndUpdate(id, updates, { new: true });
      return normalize(doc);
    }
    await SForm.update(updates, { where: { id } });
    const doc = await SForm.findByPk(id);
    return normalize(doc);
  },
  create: async (dados) => {
    if (isMongoose) {
      const novo = new MForm(dados);
      await novo.save();
      return normalize(novo);
    }
    const novo = await SForm.create(dados);
    return normalize(novo);
  },
};