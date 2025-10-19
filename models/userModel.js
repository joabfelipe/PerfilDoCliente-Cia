
const mongoose = require('../config/db');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  perfil: { type: String, enum: ['gestor', 'recepcao', 'vendedora', 'suporte'], required: true }
});

UserSchema.methods.validarSenha = function(senha) {
  return bcrypt.compare(senha, this.senha);
};

UserSchema.pre('save', async function(next) {
  if (this.isModified('senha')) {
    this.senha = await bcrypt.hash(this.senha, 10);
  }
  next();
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
