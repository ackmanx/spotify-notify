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

* CHORE: Add heroku env variable with mongodb url

* FEATURE: Lazy-load images

Question, what happens if you refresh spotify, reload the page then do it again before the first finishes?

# Bug
After everything is marked as seen, the response is:
{
    "5k4FRe5qvkCjlqLYS1o3Jn": {
        "id": "5k4FRe5qvkCjlqLYS1o3Jn",
        "name": "The Background Musicians",
        "albums": []
    }
}

This is not triggering "Nothing new :(" text because the response has keys, just no albums.

We need to not return results for artists that have no new albums


# Feature
Send back in data set how many followed artists there are

We can use this to see if the user is following any artists and report that to the screen

This work can be done with the refactor to `releases` naming
