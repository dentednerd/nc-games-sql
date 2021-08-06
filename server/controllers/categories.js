const {
  fetchAllCategories,
  insertCategory
} = require('../models/categories');

const getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => {
      res.status(200).send({ categories })
    })
    .catch(next);
};

const postCategory = (req, res, next) => {
  const { body } = req;

  insertCategory(body)
    .then(([category]) => {
      res.status(201).send({ category });
    })
    .catch(next);
};

module.exports = {
  getAllCategories,
  postCategory
};
