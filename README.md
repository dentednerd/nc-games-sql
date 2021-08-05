# Northcoders House of Games

[nc-games-sql-dentednerd.herokuapp.com](https://nc-games-sql-dentednerd.herokuapp.com/)

## requirements

- PSQL: `brew install postgresql`
- Heroku CLI: `brew tap heroku/brew && brew install heroku`

## installation

```sh
git clone https://github.com/dentednerd/be-nc-games.git
cd be-nc-games
npm install
```

## development

```sh
npm run setup-dbs
npm run seed
npm start
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
npm run seed:prod # if first time deploying
git push heroku main
```
