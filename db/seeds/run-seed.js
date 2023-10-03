const devData = require('../data/development-data');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = () => {
  console.log(`Seeding ${process.env.DATABASE_URL || process.env.PGDATABASE}...`);
  return seed(devData).then(() => {
    console.log(`${process.env.DATABASE_URL || process.env.PGDATABASE} successfully seeded!`);
    db.end();
  });
};

runSeed();
