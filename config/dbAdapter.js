const adapter = (process.env.DB_ADAPTER || 'mongoose').toLowerCase();

module.exports = {
  getAdapter: () => adapter,
  isMongoose: adapter === 'mongoose',
  isSequelize: adapter === 'sequelize',
};