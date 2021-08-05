const apiRouter = require('express').Router();

const { handle405s } = require('../errors');

const categoriesRouter = require('./categories');
const reviewsRouter = require('./reviews');
const commentsRouter = require('./comments');
const usersRouter = require('./users');

apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.route('/').all(handle405s);

module.exports = apiRouter;
