const db = require('../../db/connection');

const fetchAllUsers = () => {
  const queryStr = `
    SELECT *
    FROM users;
  `;

  return db
    .query(queryStr)
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: 'Users not found'
        });
      }
      return rows;
    })
}

const fetchUserByUsername = (username) => {
  const queryStr = `
    SELECT *
    FROM users
    WHERE username = $1;
  `;

  return db
    .query(queryStr, [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: 'User not found'
        });
      }
      return rows;
    });
};

module.exports = {
  fetchAllUsers,
  fetchUserByUsername
}
