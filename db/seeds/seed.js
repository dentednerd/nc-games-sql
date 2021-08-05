const { dropAllTables, createAllTables } = require('./reset-tables');
const {
  insertCategories,
  insertUsers,
  insertReviews,
  insertComments
} = require('./insert-data');
const { createLookupTable, formatComments } = require('../utils');

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  await dropAllTables();
  await createAllTables();

  await insertCategories(categoryData);
  await insertUsers(userData);
  await insertReviews(reviewData)
    .then((reviewRows) => {
      const reviewLookupTable = createLookupTable(reviewRows, 'title', 'review_id');

      const formattedCommentData = formatComments(commentData, reviewLookupTable);

      return insertComments(formattedCommentData);
    });
};

module.exports = seed;
