const { isMongoose, isSequelize } = require('../config/dbAdapter');

let MUser, SUser;
if (isMongoose) {
  MUser = require('../models/userModel');
} else if (isSequelize) {
  SUser = require('../models/sequelize/userModel');
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
  const hashedSenha = plain.senha;
  const result = {
    _id: plain._id || plain.id,
    email: plain.email,
    perfil: plain.perfil,
  };
  result.validarSenha = async (senha) => {
    const bcrypt = require('bcrypt');
    return bcrypt.compare(senha, hashedSenha);
  };
  return result;
};

module.exports = {
  find: async () => {
    if (isMongoose) {
      const docs = await MUser.find();
      return docs.map(normalize);
    }
    const rows = await SUser.findAll();
    return rows.map(normalize);
  },
  findOneByEmail: async (email) => {
    const doc = isMongoose ? await MUser.findOne({ email }) : await SUser.findOne({ where: { email } });
    return normalize(doc);
  },
  create: async ({ email, senha, perfil }) => {
    if (isMongoose) {
      const novo = new MUser({ email, senha, perfil });
      await novo.save();
      return normalize(novo);
    }
    const novo = await SUser.create({ email, senha, perfil });
    return normalize(novo);
  },
  deleteById: async (id) => {
    if (isMongoose) return MUser.findByIdAndDelete(id);
    return SUser.destroy({ where: { id } });
  },
};