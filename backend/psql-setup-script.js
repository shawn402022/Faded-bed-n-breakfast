//CHECK DATA BASE SCHEMA
//ensures that a specific database schema exists before application start

//imports sequelize instance from model/index.js
const { sequelize } = require('./db/models');

sequelize.showAllSchemas({ logging: false }).then(async (data) => {
  if (!data.includes(process.env.SCHEMA)) {
    await sequelize.createSchema(process.env.SCHEMA); // <--- creates schema if one does not exist
  }
});