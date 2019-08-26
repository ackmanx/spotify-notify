# Remaining

* PROD: When I deploy, how will I backup my database?
    * Maybe have a script that will download it so I can version control updates periodically

* TRAINING: Introduce styled components

* TRAINING: Convert to TypeScript

* DOC: Explain how this works. Explain setup required (like in ganjing for heroku) but also mention Spotify developer dashboard and whitelisting URLs

* CHORE: generate a new client secret with spotify. then add a heroku config for it and reference that in the code
    * For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses

* FEATURE: Mobile friendly

* CHORE: Add heroku env variable with mongodb url

* FEATURE: Lazy-load images

# Feature
Send back in data set how many followed artists there are

We can use this to see if the user is following any artists and report that to the screen

See cache contract v2

# Bug
`sleep` is not working. I get all my requests fired off at the same time, then they all try to sleep at the same time
Then errors start flying
I don't even think they're sleeping for the correct amount of time even though that function worked when I tested it
