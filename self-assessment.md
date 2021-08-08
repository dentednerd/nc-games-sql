# BE Northcoders NC Games Portfolio Check List

## Readme - Remove the one that was provided and write your own:

- [x] Link to hosted version
- [x] Write a summary of what the project is
- [x] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [x] Include information about how to create `.env.test` and `.env.development` files
- [x] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

## General

- [x] Remove any unnecessary `console.logs` and comments
- [x] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)
- [x] .gitignore the `.env` files

## Connection to db

- [x] Throw error if `process.env.PGDATABASE` is not set

## Creating tables

- [x] Use `NOT NULL` on required fields
- [x] Default `created_at` in reviews and comments tables to the current date:`TIMESTAMP DEFAULT NOW()`
- [x] Delete all comments when the review they are related to is deleted: Add `ON DELETE CASCADE` to `review_id` column in `comments` table.

## Inserting data

- [x] Make sure util functions do not mutate data
- [x] Make util functions easy to follow with well named functions and variables
- [x] Test util functions
- [x] Drop tables and create tables in seed function

## Tests

- [x] Seeding before each test
- [x] If asserting inside a `forEach`, also has an assertion to check length is at least > 0
- [x] Ensure all tests are passing
- [x] Cover all endpoints and errors

- `GET /api/categories`

  - [x] Status 200, array of category objects

- `GET /api/reviews/:review_id`

  - [x] Status 200, single review object (including `comment_count`)
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999

- `PATCH /api/reviews/:review_id`

  - [x] Status 200, updated single review object
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [x] Status 400, missing / incorrect body, e.g. `inc_votes` property is not a number, or missing

- `GET /api/reviews`

  - [x] Status 200, array of review objects (including `comment_count`, excluding `body`)
  - [x] Status 200, default sort & order: `created_at`, `desc`
  - [x] Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
  - [x] Status 200, accepts `order` query, e.g. `?order=desc`
  - [x] Status 200, accepts `category` query, e.g. `?category=dexterity`
  - [x] Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
  - [x] Status 400. invalid `order` query, e.g. `?order=bananas`
  - [x] Status 404. non-existent `category` query, e.g. `?category=bananas`
  - [x] Status 200. valid `category` query, but has no reviews responds with an empty array of reviews, e.g. `?category=children's games`

- `GET /api/reviews/:review_id/comments`

  - [x] Status 200, array of comment objects for the specified review
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [x] Status 200, valid ID, but has no comments responds with an empty array of comments

- `POST /api/reviews/:review_id/comments`

  - [x] Status 201, created comment object
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] TODO: Status 400, missing required field(s), e.g. no username or body properties // 422???
  - [x] Status 404, username does not exist
  - [x] Status 201, ignores unnecessary properties

- `GET /api`

  - [x] Status 200, JSON describing all the available endpoints

## Routing

- [x] Split into api, categories, users, comments and reviews routers
- [x] Use `.route` for endpoints that share the same path

## Controllers

- [x] Name functions and variables well
- [x] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)

## Models

- Protected from SQL injection
  - [x] Using parameterized queries for values in `db.query` e.g `$1` and array of variables
  - [x] Sanitizing any data for tables/columns, e.g. greenlisting when using template literals or pg-format's `%s`
- [x] Consistently use either single object argument _**or**_ multiple arguments in model functions
- [x] Use `LEFT JOIN` for comment counts

## Errors

- [x] Use error handling middleware functions in app and extracted to separate directory/file
- [x] Consistently use `Promise.reject` in either models _**OR**_ controllers

## Extra Tasks - To be completed after hosting

- `DELETE /api/comments/:comment_id`

- [x] Status 204, deletes comment from database
- [x] Status 404, non existant ID, e.g 999
- [x] Status 400, invalid ID, e.g "not-an-id"

- `GET /api/users`

- [x] Status 200, responds with array of user objects

- `GET /api/users/:username`

- [x] Status 200, responds with single user object
- [x] Status 404, non existant ID, e.g 999
// TODO:
- [ ] Status 400, invalid ID, e.g "not-an-id"

- `PATCH /api/comments/:comment_id`

  - [x] Status 200, updated single comment object
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [x] Status 400, missing / incorrect body, e.g. `inc_votes` property is not a number, or missing

## Extra Advanced Tasks

// TODO:

### Easier

- [ ] Patch: Edit an review body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an review by title
- [ ] Post: add a new user

### Harder

// TODO: (with exception of JWT shit)

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get reviews created in last 10 minutes
- [ ] Get: Get all reviews that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for categories
