const db = require('../connection');
const format = require('pg-format');

const insertCategories = async (categoryData) => {
  const categoriesQueryStr = format(
    'INSERT INTO categories (slug, description) VALUES %L RETURNING *;',
    categoryData.map(({ slug, description }) => [slug, description])
  );

  await db.query(categoriesQueryStr);
};

const insertUsers = async (userData) => {
  const usersQueryStr = format(
    'INSERT INTO users ( username, name, avatar_url) VALUES %L RETURNING *;',
    userData.map(({
      username,
      name,
      avatar_url
    }) => [
      username,
      name,
      avatar_url,
    ])
  );

  await db.query(usersQueryStr);
};

const insertReviews = async (reviewData) => {
  const reviewsQueryStr = format(
    'INSERT INTO reviews (title, review_body,designer, review_img_url, votes, category, owner, created_at) VALUES %L RETURNING *;',
    reviewData.map(
      ({
        title,
        review_body,
        designer,
        review_img_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIOGtX3NcbceZH7JaDO7BNZeC-EyDg1JUk4A&usqp=CAU',
        votes = 0,
        category,
        owner,
        created_at,
      }) => [
        title,
        review_body,
        designer,
        review_img_url,
        votes,
        category,
        owner,
        created_at,
      ]
    )
  );

  return db.query(reviewsQueryStr)
    .then((result) => result.rows);
};

const insertComments = (formattedCommentData) => {
  const commentsQueryStr = format(
    'INSERT INTO comments (author, review_id, votes, created_at, body) VALUES %L RETURNING *;',
    formattedCommentData.map(
      ({ author, review_id,  votes = 0, created_at, body }) => [
        author,
        review_id,
        votes,
        created_at,
        body,
      ]
    )
  );
  return db.query(commentsQueryStr);
}

module.exports = {
  insertCategories,
  insertUsers,
  insertReviews,
  insertComments
}
