# Features -----------------------------------------------------------------------------------------------------------------------

## Have option to show only seen
We would need a new api call to fetch all of the seen IDs and return in same contract
Then all seen albums would appear but marked
Can toggle to unmark and counter would go negative
Can trigger mode by clicking "Unseen"

## Create hamburger menu and put refresh in there
See stash

## Add UI to menu to see all artists I follow with new albums as a easily-viewed list
Add search to the UI
Clicking an artist will show just that one
Add menu option to go back and see all artists

## Add UI to menu to shuffle playlists because Spotify sucks at that
Needs permission to modify playlists


# Bugs ---------------------------------------------------------------------------------------------------------------------------

## The spotify access token expires but I don't have code that gets a new one if this happens so the request will fail
Being debugging this requires restarting node, we'd fetch a new token and not be able to debug
So, need a mock server like nock to test this

## Request throttling still doesn't work
It fails at "Uh oh, the retry after throttle failed too" with a 429, suggesting the throttling is not working
Set up a nock server to test this


# Chores -------------------------------------------------------------------------------------------------------------------------

## Convert to TypeScript

## Generate a new client secret with spotify
Then add a heroku config for it and reference that in the code
For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses
