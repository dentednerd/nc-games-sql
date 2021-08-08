const db = require('../../db/connection');
const {
  fetchUserByUsername
} = require('./users');
const {
  validateSortBy,
  validateOrder,
  validateCategory
} = require('../../utils');

const fetchAllReviews = async (
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  p = 1,
  category
) => {
  let queryStr = `
    SELECT reviews.*,
    COUNT(comments.comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
  `;

  if (category) {
    const validCategory = await validateCategory(category);

    if (validCategory) {
      queryStr += `WHERE reviews.category = '${validCategory.replace("'", "''")}'`;
    };
  };

  const validSortBy = await validateSortBy(
    sort_by,
    [
      'title', 'designer', 'owner', 'review_img_url', 'review_body', 'category', 'created_at', 'votes', 'comment_count'
    ]
  );
  const validOrder = await validateOrder(order);

  const offset = (p - 1) * limit;

  queryStr += `
    GROUP BY reviews.review_id
    ORDER BY ${validSortBy} ${validOrder}
    LIMIT ${limit} OFFSET ${offset};
  `;

  const reviews = await db
    .query(queryStr)
    .then(({ rows }) => rows);

  return reviews;
}

const fetchReviewById = async (review_id) => {
  const queryStr = `
    SELECT *
    FROM reviews
    WHERE review_id = $1;
  `;

  const review = await db
    .query(queryStr, [review_id])
    .then(({ rows }) => rows);

  if (!review.length) {
    return Promise.reject({
      status: 404,
      msg: 'Review not found',
    });
  }

  return review[0];
}

const updateReviewVotesById = async (review_id, votes = 0) => {
  const queryStr = `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;
  `;

  const review = await db
    .query(queryStr, [votes, review_id])
    .then(({ rows }) => rows);

  if (!review || !review.length) {
    return Promise.reject({
      status: 404,
      msg: `Review not found`,
    });
  }

  return review[0];
};

const fetchCommentsByReviewId = async(review_id, limit = 10, p = 1) => {
  const validatedReview = await fetchReviewById(review_id);

  if (!validatedReview) {
    return Promise.reject({
      status: 404,
      msg: `Review not found`,
    });
  }

  const queryStr = `
    SELECT *
    FROM comments
    WHERE review_id = $1
    LIMIT $2 OFFSET $3;
  `;

  const offset = (p - 1) * limit;

  const comments = await db
    .query(queryStr, [review_id, limit, offset])
    .then(({ rows }) => rows);

  return comments;
}

const postCommentToReview = async (review_id, { body, username }) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: 'Missing required fields'
    });
  };

  const queryStr = `
    INSERT INTO comments
    (review_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const comment = await db
    .query(queryStr, [review_id, username, body])
    .then(({ rows }) => rows);

  if (!comment || !comment.length) {
    return Promise.reject({
      status: 405,
      msg: `Unable to post comment`,
    });
  }

  return comment;
}

const insertReview = async ({
  title,
  review_body,
  designer,
  category,
  owner
}) => {

  const queryStr = `
    INSERT INTO reviews
    (title, review_body, designer, category, owner)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const review = await db
    .query(queryStr, [title, review_body, designer, category, owner])
    .then(({ rows }) => rows);

  if (!review || !review.length) {
    return Promise.reject({
      status: 405,
      msg: `Unable to post review`,
    });
  }

  return review;
}

const removeReviewById = async (review_id) => {
  const queryStr = `
    DELETE FROM reviews
    WHERE review_id = $1;
  `;

  const { rowCount: numberOfDeletions } = await db
    .query(queryStr, [review_id]);

  if (!numberOfDeletions) {
    return Promise.reject({
      status: 404,
      msg: 'Review not found'
    });
  }
}

module.exports = {
  fetchAllReviews,
  fetchReviewById,
  updateReviewVotesById,
  fetchCommentsByReviewId,
  postCommentToReview,
  insertReview,
  removeReviewById
};
