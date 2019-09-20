# Features -----------------------------------------------------------------------------------------------------------------------

## Have an option to view all albums, including seen
Would need a new UI for this
Need a way to reset an artist because I mistakenly marked all of Krewella as seen

## Re-think lazy loading album by index because screen sizes make it hard to predict
Should we test if a placeholder is in the viewport when determining if lazy?
Can we trigger that forceRecheck function again somehow?


# Bugs ---------------------------------------------------------------------------------------------------------------------------

## The spotify access token expires but I don't have code that gets a new one if this happens so the request will fail
Being debugging this requires restarting node, we'd fetch a new token and not be able to debug
So, need a mock server like nock to test this

## Request throttling still doesn't work
It fails at "Uh oh, the retry after throttle failed too" with a 429, suggesting the throttling is not working


# Chores -------------------------------------------------------------------------------------------------------------------------

## LESS
Standardize colors, font sizes and paddings/margins

## Convert to TypeScript

## Generate a new client secret with spotify
Then add a heroku config for it and reference that in the code
For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses

## Could probably combine to some extent the album actions
