const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

// API

describe('/api', () => {
  it('200: returns a JSON of available routes', () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(({ body }) => {
      expect(body).toHaveProperty('endpoints');
    });
  });

  it('404: error on invalid path', () => {
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
    it('200: returns an array of all categories', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories.length).toBeGreaterThan(0);
          categories.forEach((category) => {
            expect(category).toHaveProperty('slug');
            expect(category).toHaveProperty('description');
          });
        });
    });
  });

  describe('POST', () => {
    it('201: posts a category', () => {
      return request(app)
        .post('/api/categories')
        .send(  {
          slug: 'strategy',
          description:
            'Strategy-focused board games that prioritise limited-randomness'
        })
        .expect(201)
        .then(({ body: { category } }) => {
          expect(category.slug).toBe('strategy');
          expect(category.description).toBe('Strategy-focused board games that prioritise limited-randomness');
        });
    });
  });
});

// REVIEWS

describe('/api/reviews', () => {
  describe('GET', () => {
    it('200: returns an array of the first page of reviews, sorted by created_at in desc order by default', () => {
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

    // REVIEWS BY USER

    it('200: returns an array of reviews by a given user', () => {
      return request(app)
        .get('/api/reviews/by/mallionaire')
        .expect(200)
        .then(({ body: { reviews } }) => {
          reviews.forEach((review) => {
            expect(review).toHaveProperty('owner');
            expect(review.owner).toBe('mallionaire');
          });
        });
    });

    // SORTED REVIEWS

    it('200: returns an array of the first page of reviews, sorted by comment_count in descending order', () => {
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

    it('200: returns an array of the first page of reviews, sorted by comment_count in ascending order', () => {
      return request(app)
        .get('/api/reviews?sort_by=comment_count&order=asc')
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews.length).toBe(10);
          expect(reviews).toBeSortedBy('comment_count', {
            descending: false,
          });
        });
    });

    it('400: error on invalid sort_by query', () => {
      return request(app)
        .get('/api/reviews?sort_by=bananas')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid sort by query');
        });
    });

    it('400: error on invalid order query', () => {
      return request(app)
        .get('/api/reviews?sort_by=comment_count&order=bananas')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid order query');
        });
    });

    // REVIEWS FILTERED BY CATEGORY

    it('200: returns an array of reviews filtered by category', () => {
      return request(app)
        .get('/api/reviews?category=dexterity')
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews.length).toBeGreaterThan(0);
          reviews.forEach((review) => {
            expect(review.category).toBe('dexterity');
          });
        });
    });

    it('200: returns an empty array when provided a valid category with no reviews', () => {
      return request(app)
        .get("/api/reviews?category=children%27s%20games")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews.length).toBe(0);
        });
    });

    it('404: error on non-existent category', () => {
      return request(app)
        .get('/api/reviews?category=bananas')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Category not found');
        });
    });

    // PAGINATED REVIEWS

    it('200: returns different results for the first and second page of results', () => {
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

    it('200: returns a limited number of results', () => {
      return request(app)
        .get('/api/reviews?limit=5')
        .expect(200)
        .then(({ body: { reviews }}) => {
          expect(reviews.length).toBe(5);
        });
    });
  });

  describe('POST', () => {
    it('posts a review', () => {
      return request(app)
        .post('/api/reviews')
        .send({
          'title': 'Another excellent review',
          'review_body': 'Testing APIs can be very...testing.',
          'designer': 'Uwe Rosenberg',
          'category': 'dexterity',
          'owner': 'bainesface'
        })
        .expect(201)
        .then(({ body: { review } }) => {
          expect(review.review_id).toBe(14);
          expect(review.title).toBe('Another excellent review');
          expect(review.review_body).toBe('Testing APIs can be very...testing.');
          expect(review.designer).toBe('Uwe Rosenberg');
          expect(review.review_img_url).toBe('https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg');
          expect(review.votes).toBe(0);
          expect(review.category).toBe('dexterity');
          expect(review.owner).toBe('bainesface');
        });
    });
  });
});

describe('/api/reviews/:review_id', () => {
  describe('GET', () => {
    it('200: returns a single review', () => {
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

    it('400: error with an invalid ID', () => {
      return request(app)
        .get('/api/reviews/not-an-id')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });

    it('404: error with non-existent ID', () => {
      return request(app)
        .get('/api/reviews/9999')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Review not found');
        });
    })
  });

  describe('PATCH', () => {
    it('200: updates the vote count on a given review', () => {
      return request(app)
        .patch('/api/reviews/2')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: review }) => {
          expect(review.votes).toBe(6);
        });
    });

    it('400: error on invalid ID', () => {
      return request(app)
        .patch('/api/reviews/not-an-id')
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });

    it('400: error on missing/incorrect ID', () => {
      return request(app)
        .patch('/api/reviews/1')
        .send({ inc_votes: 'banana' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });

    it('404: error on non-existent ID', () => {
      return request(app)
        .patch('/api/reviews/9999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Review not found');
        });
    });
  });

  describe('DELETE', () => {
    it('deletes a review', () => {
      return request(app)
        .delete('/api/reviews/1')
        .expect(204)
        .then(() => {
          return request(app)
            .delete('/api/reviews/1')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Review not found');
            });
        });
    });
  });
});

// COMMENTS

describe('/api/reviews/:review_id/comments', () => {
  describe('GET', () => {
    it('200: returns an array of all comments for a review', () => {
      return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then(({ body: { comments }}) => {
          expect(comments.length).toBeGreaterThan(0);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty('comment_id');
            expect(comment).toHaveProperty('author');
            expect(comment).toHaveProperty('review_id');
            expect(comment).toHaveProperty('votes');
            expect(comment).toHaveProperty('created_at');
            expect(comment).toHaveProperty('body');
          });
        });
    });

    it('200: returns an empty array if no comments on a review', () => {
      return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then(({ body: { comments }}) => {
          expect(comments.length).toBe(0);
        });
    });

    it('400: error on invalid ID', () => {
      return request(app)
        .get('/api/reviews/not-an-id/comments')
        .expect(400)
        .then(({ body: { msg }}) => {
          expect(msg).toBe('Bad request');
        });
    });

    it('404: error on non-existent ID', () => {
      return request(app)
        .get('/api/reviews/9999/comments')
        .expect(404)
        .then(({ body: { msg }}) => {
          expect(msg).toBe('Review not found');
        });
    });

    // PAGINATED COMMENTS

    it('200: returns an array of the first page of comments on a given review, sorted by votes in descending order', () => {
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

    it('200: returns a limited number of comments on a given review', () => {
      return request(app)
        .get('/api/reviews/2/comments?limit=3')
        .expect(200)
        .then(({ body: { comments }}) => {
          expect(comments.length).toBe(3);
        });
    });
  });

  describe('POST', () => {
    it('201: adds a comment to a given review and returns it', () => {
      return request(app)
        .post('/api/reviews/2/comments')
        .send({
          'username': 'bainesface',
          'body': 'Testing APIs can be very...testing.'
        })
        .expect(201)
        .then(({ body: { comment }}) => {
          expect(comment).toHaveProperty('body');
        });
    });

    it('201: adds a comment, ignoring extra properties', () => {
      return request(app)
        .post('/api/reviews/2/comments')
        .send({
          'username': 'bainesface',
          'body': 'Testing APIs can be very...testing.',
          'cats': 'awesome',
          'dogs': 'alright'
        })
        .expect(201)
        .then(({ body: { comment }}) => {
          expect(comment).toHaveProperty('body');
        });
    });

    it('400: error on invalid ID', () => {
      return request(app)
        .post('/api/reviews/not-an-id/comments')
        .send({
          'username': 'bainesface',
          'body': 'Testing APIs can be very...testing.'
        })
        .expect(400)
        .then(({ body: { msg }}) => {
          expect(msg).toBe('Bad request');
        });
    });

    it('404: error on invalid ID', () => {
      return request(app)
        .post('/api/reviews/9999/comments')
        .send({
          'username': 'bainesface',
          'body': 'Testing APIs can be very...testing.'
        })
        .expect(404)
        .then(({ body: { msg }}) => {
          expect(msg).toBe('Not found');
        });
    });

    it('422 TODO: 400: error when no/incomplete request body provided', () => {
      return request(app)
        .post('/api/reviews/2/comments')
        .send({})
        .expect(422)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Unprocessable entity');
        });
    });

    it('404: error when user not found', () => {
      return request(app)
        .post('/api/reviews/2/comments')
        .send({
          'username': 'dentednerd',
          'body': 'Testing APIs can be very...testing.'
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Not found');
        });
    });
  })
});


describe('/api/comments/:comment_id', () => {
  describe('DELETE', () => {
    it('204: deletes a comment', () => {
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

    it('404: error with non-existent ID', () => {
      return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Comment not found');
        });
    });

    it('400: error with invalid ID', () => {
      return request(app)
        .delete('/api/comments/not-an-id')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
  });

  describe('PATCH', () => {
    it ('200: updates the vote count on a comment', () => {
      return request(app)
        .patch('/api/comments/3')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toBe(11);
        });
    });

    it ('400: error on invalid ID', () => {
      return request(app)
        .patch('/api/comments/not-an-id')
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });

    it ('400: error on invalid body', () => {
      return request(app)
        .patch('/api/comments/not-an-id')
        .send({ inc_votes: 'cool' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });

    it ('404: error on non-existent ID', () => {
      return request(app)
        .patch('/api/comments/9999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Comment not found');
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
          expect(users.length).toBeGreaterThan(0);
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
    it ('200: returns a user when provided a username', () => {
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

    it ('404: error on non-existent username', () => {
      return request(app)
        .get('/api/users/dentednerd')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('User not found');
        });
    });

    // TODO:
    // it ('400: error on invalid username', () => {
    //   return request(app)
    //     .get('/api/users/not-an-id')
    //     .expect(400)
    //     .then(({ body: { msg } }) => {
    //       expect(msg).toEqual('Bad request');
    //     });
    // });
  });
});
