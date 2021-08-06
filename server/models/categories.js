const db = require('../../db/connection');

const fetchAllCategories = async () => {
  const queryStr = `
    SELECT *
    FROM categories;
  `;

  const categories = await db
    .query(queryStr)
    .then(({ rows }) => rows);

  if (!categories || !categories.length) {
    return Promise.reject({
      status: 404,
      msg: 'Categories not found',
    });
  }

  return categories;
};

const insertCategory = async ({ slug, description }) => {
  const queryStr = `
    INSERT INTO categories
    (slug, description)
    VALUES ($1, $2)
    RETURNING *
  `;

  const category = await db
    .query(queryStr, [slug, description])
    .then(({ rows }) => rows);

  if (!category || !category.length) {
    return Promise.reject({
      status: 404,
      msg: 'Unable to post category'
    });
  }

  return category;
}

module.exports = {
  fetchAllCategories,
  insertCategory
};
