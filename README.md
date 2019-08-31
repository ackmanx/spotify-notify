# Remaining

## Styled Components

## Convert to TypeScript

## Mobile friendly

## Docs
Explain how this works. 
Explain setup required (like in ganjing for heroku)

## Generate a new client secret with spotify
Then add a heroku config for it and reference that in the code
For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses

## Add username, followed artists and new albums count to top

# Bugs

## Every Album instance on the page renders when you ghost an item

## Clicking an artist to mark all albums as seen stacks and sends duplicates

## `totalNewAlbums` is not being populated correctly, or is not being updated when the cache is read
    * If a user marks an album as seen, but doesn't refresh. That should reduce `totalNewAlbums` still
    * The current problem is that I'm iterating over artists, thinking it's albums


# Dev Setup

* Run `npm install`
* Use `npm start` to star the node server
* Use `npm run build:watch` to build the UI for development
* Use `me:3666` for development (update `/etc/hosts`)
* Spotify requires you to whitelist domains to access their API
    * https://developer.spotify.com/dashboard/
    * So you need to whitelist your dev domain and prod domains

# Heroku

This app is deployed to Heroku. You can manage the servers at their dashboard.

To deploy, simply add the Heroku origin to this git repository and push to master. Find instructions on their website. After you push, Heroku will run `heroku-postbuild`, which will do a production build of the UI for the node server to host.

# MongoDB

The caches for user data are stored in a MongoDB free tier MongoDB Atlas cluster. You can see the dashboard for management.
    * https://cloud.mongodb.com/user?n=%2Fv2%2F5d547f839ccf643d3ff713bc#clusters 
