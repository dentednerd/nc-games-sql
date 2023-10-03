# Northcoders House of Games

A RESTful API with a PostgreSQL database.

## requirements

- Node v14.17.4: [download](https://nodejs.org/)
- PostgreSQL v13.3: `brew install postgresql`

## installation

```sh
git clone https://github.com/dentednerd/be-nc-games.git
cd be-nc-games
npm install
echo PGDATABASE=nc_games_test > .env.test
echo PGDATABASE=nc_games > .env.development
```

## development

```sh
npm run setup-dbs
npm run seed
npm start # server will listen on port 9090 by default
```

## testing

```sh
npm t # jest --verbose
```

## deployment

```sh
# to push to Github:
git push origin main

# to deploy to Heroku:
# ensure that heroku remote exists:
git remote -v
# if no heroku remote:
git add remote heroku https://git.heroku.com/nc-games-sql-dentednerd.git
npm run seed:prod # on first deploy only
git push heroku main
```
