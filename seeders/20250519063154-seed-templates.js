'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

 
    const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const cities = ['Moscow', 'New York', 'Berlin', 'Tokyo', 'London'];
    const streets = ['Main St', 'Broadway', 'High St', 'Park Ave', '5th Ave'];

    const rooms = Array.from({ length: 20 }).map((_, id) => ({
      name: `Room with ID ${id + 1}`,
      capacity: randomInt(4, 20),
      location: `${randomChoice(cities)} - ${randomChoice(streets)}`,
      hasProjector: Math.random() < 0.5,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('rooms', rooms);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('rooms', null, {});
  },
};
