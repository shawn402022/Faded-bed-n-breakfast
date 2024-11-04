//PRODUCTION/DEVELOPMENT VARIABLES FOR DB

//imports .env variables
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
    use_env_variable: 'postgresql://app_academy_projects_7ywb_user:nBOxFoRL4olnyYh1b4AQQ0ABLZKLXJ9j@dpg-cskf320gph6c73aakqhg-a/app_academy_projects_7ywb',
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