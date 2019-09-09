# Features

## Styled Components

## Convert to TypeScript

## Mobile friendly
loading text is too high
    center it when first loading the page
    add padding when doing a refresh
check the new user text
    reduce to 48px
    add line break
check the no followed artists text
    reduce to 48px
    add line break
refresh button hover styles doesn't go away after finished (is this an issue on a real mobile device?)

## Generate a new client secret with spotify
Then add a heroku config for it and reference that in the code
For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses

## Create modal to listen to that album RIGHT NOW
After modal open, generate an iframe to insert an embedded player
Use the album's URI so it shows the whole album
https://developer.spotify.com/documentation/widgets/generate/play-button/

## Have an option to view all albums, including seen
Would need a new UI for this
Combine action buttons to the left and add a hamburger to the right

## Add overlay for refresh and submit

# Bugs

## The spotify access token expires but I don't have code that gets a new one if this happens so the request will fail
Use case is a user (me) sets a bunch of albums as seen but doesn't submit it

## Spotify doesn't take focus after opening
This only happens on my work Mac

# Chores

## Namespace my css or use Styled Components instead of avoiding it because I'm having conflicts

## Rename new albums concept to unseen albums

## The spotify access token expires but being my server restarts every 30 min of inactivity on heroku i haven't encountered that

## Need a way to reset an artist because I mistakenly marked all of Krewella as seen
