const {
  fetchAllReviews,
  fetchReviewById,
  updateReviewVotesById,
  fetchCommentsByReviewId,
} = require('../models/reviews');

const getAllReviews = (req, res, next) => {
  fetchAllReviews()
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

  fetchCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

module.exports = {
  getAllReviews,
  getReviewById,
  patchReviewVotesById,
  getCommentsByReviewId,
};
