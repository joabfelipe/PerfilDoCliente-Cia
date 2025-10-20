const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbOracle');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  perfil: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'Users',
  timestamps: false,
});

User.addHook('beforeCreate', async (user) => {
  if (user.senha) {
    user.senha = await bcrypt.hash(user.senha, 10);
  }
});

User.addHook('beforeUpdate', async (user) => {
  if (user.changed('senha')) {
    user.senha = await bcrypt.hash(user.senha, 10);
  }
});

User.prototype.validarSenha = function(senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = User;