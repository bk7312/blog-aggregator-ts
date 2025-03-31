# gator

A CLI blog aggregator from [boot.dev](https://www.boot.dev/courses/build-blog-aggregator-typescript) built using TS.

## Installation

Ensure node is installed and execute the following command in your terminal:

```bash
npm install
```

Ensure postgres is installed and create a `gator` database.

```sql
CREATE DATABASE gator;
```

Generate and migrate the database.

```bash
npm run generate
npm run migrate
```

Create a json file in your home directory `~/.gatorconfig.json` containing the following your postgres connection url. Username can be left blank as you'll need to `register` the user in the db first later.

```json
{
  "db_url": "connection_string_goes_here",
  "current_user_name": "username_goes_here"
}
```

And you should be able to run `npm run start <command>` to use the CLI.

## Usage

To run the CLI, run `npm run start <command>` for the list of available commands below.

- login: `npm run start login <username>` to login once registered.
- register: `npm run start register <username>` to register.
- reset: `npm run start reset` will reset the database.
- users: `npm run start users` to list all users.
- agg: : `npm run start agg <time>` to fetch the feeds, runs continuously in intervals set by `<time>` (5s, 3m, 1h, etc).
- addfeed: `npm run start addfeed <feed_name> <feed_url>` to add feed to db.
- feeds: `npm run start feeds` to list all available feeds in db.
- follow: `npm run start follow <feed_url>` to follow the feed.
- following: `npm run start following` to show list of followed feeds.
- unfollow: `npm run start unfollow <feed_url>` to unfollow the feed.
- browse: `npm run start browse <limit>` to show latest `<limit>` number of posts.
- help: `npm run start help` to show the list of available commands.
