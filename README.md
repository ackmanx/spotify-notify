# Dev Setup

* Run `yarn install`
* Use `yarn start` to start the node server
* Use `yarn build:watch` to build the UI for development
* Use `me:3666` for development (update `/etc/hosts`)
* Set env `DEBUG=sn:*` to enable node debug output
* Spotify requires you to whitelist domains to access their API
    * https://developer.spotify.com/dashboard/
    * So you need to whitelist your dev domain and prod domains

# Heroku

This app is deployed to Heroku. You can manage the servers at their dashboard.

Docs for Heroku with git: https://devcenter.heroku.com/articles/git

To deploy:
* Run `yarn version --patch` to up the version
* Push to origin/heroku and a build will trigger automatically because I've got this app hooked up to my GitHub account in the Heroku app settings

After you push, Heroku will run `heroku-postbuild`, which will do a production build of the UI for the node server to host.

# MongoDB

The caches for user data are stored in a MongoDB free tier MongoDB Atlas cluster. You can see the dashboard for management.
