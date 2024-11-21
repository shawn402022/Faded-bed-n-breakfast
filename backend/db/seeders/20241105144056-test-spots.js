'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spots.bulkCreate([
      {
        "ownerId": 1,
        "address": "123 Disney Lane",
        "city": "San Francisco",
        "state": "California",
        "country": "United States of America",
        "lat": 37.7645358,
        "lng": 122.4730327,
        "name": "App Academy",
        "description": "Place where web developers are created",
        "price": 123,
      },
      {
        "ownerId": 1,
        "address": "empire state",
        "city": "new york",
        "state": "new york",
        "country": "United States of America",
        "lat": 37.7645358,
        "lng": 122.4730327,
        "name": "App Academy",
        "description": "Place where web developers are created",
        "price": 123,
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Disney Lane',"empire state"] }
    }, {});
  }
};