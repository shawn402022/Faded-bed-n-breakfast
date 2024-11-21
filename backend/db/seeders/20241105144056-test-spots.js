'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options.schema ? `${options.schema}.Spots` : 'Spots', [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 1,
        address: "empire state",
        city: "new york",
        state: "new york",
        country: "United States of America",
        lat: 40.7484405,
        lng: -73.9856644,
        name: "Empire State Building",
        description: "Iconic skyscraper in the heart of NYC",
        price: 123,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options.schema ? `${options.schema}.Spots` : 'Spots', {
      address: { [Op.in]: ['123 Disney Lane', "empire state"] }
    }, {});
  }
};