const { fetchAllCategories } = require('../models/categories');

const getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => {
      res.status(200).send({ categories })
    })
    .catch(next);
};

module.exports = getAllCategories;
