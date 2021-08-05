const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

// API

describe('/api', () => {
  it('returns a JSON of available routes', () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(({ body }) => {
      expect(body).toHaveProperty('/api');
      expect(body['/api']).toHaveProperty('/categories');
      expect(body['/api']).toHaveProperty('/reviews');
      expect(body['/api']).toHaveProperty('/comments');
      expect(body['/api']).toHaveProperty('/users');
    });
  });

  it('returns 404 on invalid path', () => {
    return request(app)
      .get('/bla')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('This route is invalid.');
      });
  });
});

// CATEGORIES

describe('/api/categories', () => {
  describe('GET', () => {
    it('returns all categories', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({ body: { categories } }) => {
          categories.forEach((category) => {
            expect(category).toHaveProperty('slug');
            expect(category).toHaveProperty('description');
          });
        });
    });
  });
});

// REVIEWS

describe('/api/reviews', () => {
  describe('GET', () => {
    it('returns an array of the first page of reviews, sorted by created_at in desc order by default', () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body: { reviews }}) => {
          expect(reviews.length).toBe(10);
          reviews.forEach((review) => {
            expect(review).toHaveProperty('review_id');
            expect(review).toHaveProperty('title');
            expect(review).toHaveProperty('review_body');
            expect(review).toHaveProperty('designer');
            expect(review).toHaveProperty('review_img_url');
            expect(review).toHaveProperty('votes');
            expect(review).toHaveProperty('category');
            expect(review).toHaveProperty('owner');
            expect(review).toHaveProperty('created_at');
            expect(reviews).toBeSortedBy('created_at', {
              descending: true,
            });
          });
        });
    });

    it('returns an array of the first page of reviews, sorted by comment_count in descending order', () => {
      return request(app)
        .get('/api/reviews?sort_by=comment_count')
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews.length).toBe(10);
          expect(reviews).toBeSortedBy('comment_count', {
            descending: true,
          });
        });
    });

    it('returns different results for the first and second page of results', () => {
      const firstPage = request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body: { reviews } }) => reviews);
      return request(app)
        .get('/api/reviews?p=2')
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).not.toBe(firstPage);
        });
    });

    it('returns a limited number of results', () => {
      return request(app)
        .get('/api/reviews?limit=5')
        .expect(200)
        .then(({ body: { reviews }}) => {
          expect(reviews.length).toBe(5);
        });
    });
  });
});

describe('/api/reviews/:review_id', () => {
  describe('GET', () => {
    it('returns a single review', () => {
      return request(app)
        .get('/api/reviews/1')
        .expect(200)
        .then(({ body: { review }}) => {
          expect(review).toHaveProperty('review_id');
          expect(review).toHaveProperty('title');
          expect(review).toHaveProperty('review_body');
          expect(review).toHaveProperty('designer');
          expect(review).toHaveProperty('review_img_url');
          expect(review).toHaveProperty('votes');
          expect(review).toHaveProperty('category');
          expect(review).toHaveProperty('owner');
          expect(review).toHaveProperty('created_at');
        });
    });
  });

  describe('PATCH', () => {
    it('updates the vote count on a single review', () => {
      return request(app)
        .patch('/api/reviews/2')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: review }) => {
          expect(review.votes).toBe(6);
        });
    });
  });
});

// COMMENTS

describe('/api/reviews/:review_id/comments', () => {
  describe('GET', () => {
    it('returns an array of all comments for a single review', () => {
      return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then(({ body: { comments }}) => {
          comments.forEach((comment) => {
            expect(comment).toHaveProperty('comment_id');
            expect(comment).toHaveProperty('author');
            expect(comment).toHaveProperty('review_id');
            expect(comment).toHaveProperty('votes');
            expect(comment).toHaveProperty('created_at');
            expect(comment).toHaveProperty('body');
          })
        });
    });

    it('returns an array of the first page of comments on a given review, sorted by votes in descending order', () => {
      return request(app)
        .get('/api/reviews/2/comments?sort_by=votes')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBeLessThanOrEqual(10);
          expect(comments).toBeSortedBy('votes', {
            descending: true,
          });
        });
    });

    it('returns a limited number of comments for a given review', () => {
      return request(app)
        .get('/api/reviews/2/comments?limit=3')
        .expect(200)
        .then(({ body: { comments }}) => {
          expect(comments.length).toBe(3);
        });
    });

    it('returns 404 when a review has no comments', () => {
      return request(app)
        .get('/api/reviews/1/comments')
        .expect(404)
        .then(({ body: { msg }}) => {
            expect(msg).toBe('Comments not found');
        });
    });
  });

  describe('POST', () => {
    it('adds a comment to a given review and returns it', () => {
      return request(app)
        .post('/api/reviews/2/comments')
        .send({
          'username': 'bainesface',
          'body': 'Testing APIs can be very...testing.'
        })
        .then(({ body: { comment }}) => {
          expect(comment).toHaveProperty('body');
        });
    });
    it('returns 422 when no request body provided', () => {
      return request(app)
        .post('/api/reviews/2/comments')
        .send({})
        .expect(422)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Unprocessable entity');
        });
    });
  })
});


describe('/api/comments/:comment_id', () => {
  describe('DELETE', () => {
    it('returns 204 when comment is deleted', () => {
      return request(app)
        .delete('/api/comments/2')
        .expect(204)
        .then(() => {
          return request(app)
            .delete('/api/comments/2')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Comment not found');
            });
        });
    });
  });

  describe('PATCH', () => {
    it ('returns an updated vote count on a comment', () => {
      return request(app)
        .patch('/api/comments/3')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toBe(11);
        });
    });
  });
});

// USERS

describe('/api/users', () => {
  describe('GET', () => {
    it('returns all users', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: { users }}) => {
          users.forEach((user) => {
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('avatar_url');
          });
        });
    });
  });
});

describe('/api/users/:username', () => {
  describe('GET', () => {
    it ('returns a single user when provided a single username', () => {
      return request(app)
        .get('/api/users/mallionaire')
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toEqual({
            username: 'mallionaire',
            name: 'haz',
            avatar_url:
              'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
          });
        });
    });
  });
});
