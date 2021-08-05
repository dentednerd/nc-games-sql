const db = require('../../db/connection');

const fetchAllReviews = async () => {
  const queryStr = `
    SELECT *
    FROM reviews;
  `;

  const reviews = await db
    .query(queryStr)
    .then(data => data.rows);

  if (!reviews || !reviews.length) {
    return Promise.reject({
      status: 404,
      msg: 'Reviews not found',
    });
  }

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

const fetchCommentsByReviewId = async(review_id) => {
  const queryStr = `
    SELECT *
    FROM comments
    WHERE review_id = $1;
  `;

  const comments = await db
    .query(queryStr, [review_id])
    .then(({ rows }) => rows);

  if (!comments.length) {
    return Promise.reject({
      status: 404,
      msg: `Comments not found`,
    });
  }

  return comments;
}

const postCommentToReview = async (review_id, { body, username }) => {
  const queryStr = `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`;

  const comment = await db
    .query(queryStr, [review_id, username, body])
    .then((result) => result.rows);

  if (!comment || !comment.length) {
    return Promise.reject({
      status: 405,
      msg: `Unable to post comment`,
    });
  }

  return comment;
}

module.exports = {
  fetchAllReviews,
  fetchReviewById,
  updateReviewVotesById,
  fetchCommentsByReviewId,
  postCommentToReview
};
