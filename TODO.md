# Features

## Styled Components
Standardize colors, font sizes and paddings/margins

## Convert to TypeScript

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
Need a way to reset an artist because I mistakenly marked all of Krewella as seen
Require navigation by letter or something (like android lists) to prevent loading everything

# Bugs

## The spotify access token expires but I don't have code that gets a new one if this happens so the request will fail
Use case is a user (me) sets a bunch of albums as seen but doesn't submit it

## Spotify doesn't take focus after opening
This only happens on my work Mac

## App is slow

## Hover is ugly on the shapeship
We want enough space so the header doesn't shift when going from 1 to 2 digits
We want the hover border to only go around the ship and number, not the padding too (try using margin)

# Chores
