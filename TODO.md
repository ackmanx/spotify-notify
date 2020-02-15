# Features -----------------------------------------------------------------------------------------------------------------------

## Add a search at the top that auto-focuses on page load
When you search it shows only results that match, not scroll to results
Search only searches artist titles
Could incorporate small edit distance to allow for a single character mistype

## Sort results predictably

## Add UI to menu to see all artists I follow with new albums as a easily-viewed list
Clicking an artist will show just that one
Add menu option to see all artists, regardless of new albums or not

## Add UI to put metadata into a menu dropdown panel on hover of username

## Filter by genre
Dependent on menu dropdowns
Persist genres property for each artist from spotify's following-artists call
Build UI to show all the genres available, then filters each
Put in another menu called Filters on the action bar with the username

## Collapse an artist if you click on its name
Requires to put the select all feature at the end of the artist title or something


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

## Generate a new client secret with spotify
Then add a heroku config for it and reference that in the code
For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses
