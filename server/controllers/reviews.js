const {
  fetchAllReviews,
  fetchReviewById,
  updateReviewVotesById,
  fetchCommentsByReviewId,
  insertReview,
  removeReviewById
} = require('../models/reviews');

const getAllReviews = (req, res, next) => {
  const { sort_by, order, limit, p, category } = req.query;

  fetchAllReviews(sort_by, order, limit, p, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

const getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

const patchReviewVotesById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  updateReviewVotesById(review_id, inc_votes)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch(next);
};

const getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { limit, p } = req.query;

  fetchCommentsByReviewId(review_id, limit, p)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
const postReview = (req, res, next) => {
  const { body } = req;

  insertReview(body)
    .then(([review]) => {
      res.status(201).send({ review });
    })
    .catch(next);
};

const deleteReviewById = (req, res, next) => {
  const { review_id } = req.params;

  removeReviewById(review_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

module.exports = {
  getAllReviews,
  getReviewById,
  patchReviewVotesById,
  getCommentsByReviewId,
  postReview,
  deleteReviewById
};
