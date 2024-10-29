//IMPORTS AND REQUIREMENTS

//catching common coding errors and preventing the use of certain error-prone features
'use strict';

//used for reading files
const fs = require('fs');
//used for handling file paths
const path = require('path');
//Imports the Sequelize library.
const Sequelize = require('sequelize');
//provides information about the current Node.js process.
const process = require('process');
//Gets the base filename of the current file (without the directory path)
const basename = path.basename(__filename);
//Sets the environment.
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
