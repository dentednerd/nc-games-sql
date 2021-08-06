const getApi = (req, res, next) => {
  res.status(200).send({
    "/api": {
      "/categories": {
        "GET /": "returns all categories",
        "POST /": "adds a category"
      },
      "/reviews": {
        "GET /": "returns all reviews",
        "POST /": "adds a review",
        "/:review_id": {
          "GET /": "returns a single review",
          "PATCH /": "updates the vote count on a review",
          "DELETE /": "deletes a review",
          "/comments": {
            "GET /": "returns all comments on a review",
            "POST /": "adds a comment to a review"
          }
        }
      },
      "/comments": {
        "/:comment_id" : {
          "PATCH /": "updates the vote count on a comment",
          "DELETE /": "deletes a comment"
        }
      },
      "/users": {
        "GET /": "returns all users",
        "/:username": {
          "GET /": "returns a single user"
        }
      }
    }
  })
};

module.exports = getApi;
