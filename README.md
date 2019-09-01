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
