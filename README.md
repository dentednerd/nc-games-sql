# Northcoders House of Games

Deployment: [Heroku](https://nc-games-sql-dentednerd.herokuapp.com/)

## requirements

- PSQL: `brew install postgresql`
- Heroku CLI: `brew tap heroku/brew && brew install heroku`

## development

```sh
git clone https://github.com/dentednerd/be-nc-games.git
cd be-nc-games
npm run setup-dbs
npm run seed
npm start

# to push to Github:
git push origin main

# to deploy to Heroku:
npm run seed:prod # if first time deploying
git push heroku main
```

## testing

```sh
npm t # jest --verbose
```
