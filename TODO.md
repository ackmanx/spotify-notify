# Features -----------------------------------------------------------------------------------------------------------------------

## Have option to show only seen
We would need a new api call to fetch all of the seen IDs and return in same contract
Then all seen albums would appear but marked
Can toggle to unmark and counter would go negative
Can trigger mode by clicking "Unseen"

## Create hamburger menu and put refresh in there
See stash

## Change refresh icon to an egg that shakes when you hover

## Add a search at the top that auto-focuses on page load
When you search it shows only results that match, not scroll to results
Search only searches artist titles
Could incorporate small edit distance to allow for a single character mistype
Check spotify response to see if it includes tags or something, so you could search for chinese and it would show artists tagged with chinese

## Add UI to menu to see all artists I follow with new albums as a easily-viewed list
Clicking an artist will show just that one
Add menu option to go back and see all artists

## Have option to show every artist every album, regardless of seen or not

## Add UI to menu to shuffle playlists because Spotify sucks at that
Needs permission to modify playlists


# Bugs ---------------------------------------------------------------------------------------------------------------------------

## The spotify access token expires but I don't have code that gets a new one if this happens so the request will fail
Need to save in session the date that access_token expires
    Then before making a request we check if it's expired
    If so, send the refresh_token instead to get a new access_token and save that in the session
    Then continue with the original request
So, need a mock server like nock to test this (use jest-nock branch)
https://developer.spotify.com/documentation/general/guides/authorization-guide/

## Request throttling still doesn't work
It fails at "Uh oh, the retry after throttle failed too" with a 429, suggesting the throttling is not working
Set up a nock server to test this


# Chores -------------------------------------------------------------------------------------------------------------------------

## Convert to TypeScript

## Generate a new client secret with spotify
Then add a heroku config for it and reference that in the code
For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses
