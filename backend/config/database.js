//  PRODUCTION/DEVELOPMENT VARIABLES FOR DB

//loads .env varaibles
const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite", // <--- local DB used for development
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres', // <--- online DB for deployment
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      schema: process.env.SCHEMA
    }
  }
};