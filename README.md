# Remaining

* PROD: When I deploy, how will I backup my database?
    * Maybe have a script that will download it so I can version control updates periodically

* CHORE: Refactor service to provide `releases` which is an object with albums and singles as separate arrays so the UI doesn't need to do this
    * This will also clean up naming so that an album is just a set of songs, not and also meaning a single

* TRAINING: Introduce styled components

* TRAINING: Convert to TypeScript

* DOC: Explain how this works. Explain setup required (like in ganjing for heroku) but also mention Spotify developer dashboard and whitelisting URLs

* CHORE: generate a new client secret with spotify. then add a heroku config for it and reference that in the code
    * For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses

* FEATURE: Mobile friendly

* FEATURE: Disable buttons until requests finish

* BUG: db not being written to disk so after heroku sleeps my server I lost the changes
    * Also, if two users updated at the same time what would happen?
    
* CHORE: Add heroku env variable with mongodb url

Question, what happens if you refresh spotify, reload the page then do it again before the first finishes?
