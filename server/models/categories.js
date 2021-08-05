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
}

module.exports = { fetchAllCategories }
