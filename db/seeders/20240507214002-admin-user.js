'use strict';
/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcrypt');

// This will go to the DB directly. It won't go through the model, so we need to validate it here too
module.exports = {
  up: (queryInterface, Sequelize) => {
    let password = process.env.ADMIN_PASSWORD;
    const hashedPassword = bcrypt.hashSync(password, 10);
    return queryInterface.bulkInsert('user', [
      {
        username: 'John Doe',
        type: '0', // ADMIN
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', { type: '0' }, {}); // deletes all the users with the '0' userType
  },
};
