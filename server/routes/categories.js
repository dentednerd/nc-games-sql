const getAllCategories = require('../controllers/categories');
const { handle405s } = require('../errors');

const categoriesRouter = require('express').Router();

categoriesRouter
  .route('/')
  .get(getAllCategories)
  .all(handle405s);

module.exports = categoriesRouter;
