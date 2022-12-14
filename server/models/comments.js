const db = require('../../db/connection');

const fetchCommentsByUser = async (username) => {
  const queryStr = `
    SELECT *
    FROM comments
    WHERE author = $1;
  `;

  const comments = await db
    .query(queryStr, [username])
    .then(({ rows }) => rows);

  if (!comments || !comments.length) {
    return Promise.reject({
      status: 405,
      msg: `Comments not found`,
    });
  }

  return comments;
}

const postCommentToReview = async (review_id, { body, username }) => {
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

const deleteComment = async (comment_id) => {
  const queryStr = `
    DELETE FROM comments
    WHERE comment_id = $1;
  `;

  const { rowCount: numberOfDeletions } = await db
    .query(queryStr, [comment_id]);

  if (!numberOfDeletions) {
    return Promise.reject({
      status: 404,
      msg: 'Comment not found'
    });
  }
};

const updateComment = async (comment_id, inc_votes = 0) => {
  const queryStr = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;
  `;

  const { rows: comments } = await db
    .query(queryStr, [inc_votes, comment_id]);

  if (!comments.length) {
    return Promise.reject({
      status: 404,
      msg: 'Comment not found'
    });
  }
  return comments;
}

module.exports = {
  fetchCommentsByUser,
  postCommentToReview,
  deleteComment,
  updateComment
};
