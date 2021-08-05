const {
  patchComment,
  removeComment,
} = require('../controllers/comments');
const { handle405s } = require('../errors');

const commentsRouter = require('express').Router();

commentsRouter
  .route('/:comment_id')
  .patch(patchComment)
  .delete(removeComment)
  .all(handle405s);

module.exports = commentsRouter;
