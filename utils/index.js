const db = require('../db/connection');

exports.formatComments = (comments, lookupTable) => {
  if (!comments || !lookupTable) {
    return Promise.reject({
      status: 400,
      msg: 'Unable to format comments'
    });
  };

  return comments.map(
    ({ created_by, belongs_to: key, ...restOfComment }) => {
      const newComment = {
        author: created_by,
        review_id: lookupTable[key],
        ...restOfComment,
      };
      return newComment;
    }
  );
};

exports.createLookupTable = (arr, finalKey, finalValue) => {
  if (!arr || !finalKey || !finalValue) {
    return Promise.reject({
      status: 400,
      msg: 'Unable to create lookup table'
    });
  };

  return arr.reduce((finalObj, current) => {
    finalObj[current[finalKey]] = current[finalValue];
    return finalObj;
  }, {});
};

exports.validateSortBy = (sort_by, columns) => {
  const isValidSortByColumn = columns.includes(sort_by);
  return isValidSortByColumn
    ? sort_by
    : Promise.reject({
        status: 400,
        msg: 'Invalid sort by query'
      });
};

exports.validateOrder = (order) => {
  const lowerCaseOrder = order.toLowerCase();
  const isValidOrder = ['asc', 'desc'].includes(lowerCaseOrder);
  return isValidOrder
    ? lowerCaseOrder
    : Promise.reject({
        status: 400,
        msg: 'Invalid order query'
      });
};

exports.validateCategory = async (category) => {
  const categories = await db
    .query(`SELECT * FROM categories;`)
    .then(({ rows }) => {
      return rows.map((cat) => {
        return cat.slug;
      });
    });

  return categories.includes(category)
    ? category
    : Promise.reject({
      status: 404,
      msg: 'Category not found'
    });
}
