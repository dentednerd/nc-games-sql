exports.formatComments = (comments, lookupTable) => {
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
  return arr.reduce((finalObj, current) => {
    finalObj[current[finalKey]] = current[finalValue];
    return finalObj;
  }, {});
};
