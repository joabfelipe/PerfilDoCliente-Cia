const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.ORACLE_USER || 'usuario',
  process.env.ORACLE_PASSWORD || 'senha',
  process.env.ORACLE_HOST || 'oracle_host',
  {
    dialect: 'oracle',
    dialectOptions: { connectString: process.env.ORACLE_CONNECT_STRING || 'localhost:1521/XEPDB1' },
    logging: false,
  }
);
module.exports = sequelize;