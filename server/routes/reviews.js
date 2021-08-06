const {
  getAllReviews,
  getReviewById,
  patchReviewVotesById,
  getCommentsByReviewId,
  postReview,
  deleteReviewById
} = require('../controllers/reviews');

const {
  addCommentToReview
} = require('../controllers/comments');

const { handle405s } = require('../errors');

const reviewsRouter = require('express').Router();

reviewsRouter
  .route('/')
  .get(getAllReviews)
  .post(postReview)
  .all(handle405s);

reviewsRouter
  .route('/:review_id')
  .get(getReviewById)
  .patch(patchReviewVotesById)
  .delete(deleteReviewById)
  .all(handle405s);

reviewsRouter
  .route('/:review_id/comments')
  .post(addCommentToReview)
  .get(getCommentsByReviewId)
  .all(handle405s);

module.exports = reviewsRouter;
