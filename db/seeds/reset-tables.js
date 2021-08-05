const db = require('../connection');

const dropAllTables = async () => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS categories;`);
};

const createAllTables = async () => {
  await db.query(`
    CREATE TABLE categories (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR NOT NULL
    );
  `);
  await db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      avatar_url VARCHAR
    );
  `);
  await db.query(`
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      review_body TEXT NOT NULL,
      designer VARCHAR NOT NULL,
      review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg' NOT NULL,
      votes INT DEFAULT 0 NOT NULL,
      category VARCHAR NOT NULL REFERENCES categories(slug),
      owner VARCHAR NOT NULL REFERENCES users(username),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR REFERENCES users(username) NOT NULL,
      review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE NOT NULL,
      votes INT DEFAULT 0 NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      body TEXT NOT NULL
    );
  `);
};

module.exports = { dropAllTables, createAllTables };
