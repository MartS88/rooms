'use strict';

import { faker } from '@faker-js/faker';

export default {
  up: async (queryInterface, Sequelize) => {
    const rooms = Array.from({ length: 20 }).map(() => ({
      name: `${faker.company.name()} Room`,
      capacity: faker.number.int({ min: 4, max: 20 }),
      location: `${faker.location.city()} - ${faker.location.streetAddress()}`,
      hasProjector: faker.datatype.boolean(),
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('rooms', rooms);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('rooms', {}, {});
  },
};
