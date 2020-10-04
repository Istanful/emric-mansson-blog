# Emric Månsson blog

This is the server for the Emric Månsson blog. It fetches the posts from the
Sanity hosted app and renders the HTML.

## Getting started

Install dependencies.

```bash
bundle
```

Install JavaScript dependencies.

```bash
rails yarn:install
```

Start development server.

```bash
rails s
```

Access the site at [http://localhost:3000](http://localhost:3000)

## Deployment

Add heroku remote.

```bash
heroku git:remote -a emric-mansson-blog
```

Push to the heroku remote.

```bash
git push heroku master
```
