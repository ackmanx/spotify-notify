# Features 

### Add a search at the top that auto-focuses on page load
When you search it shows only results that match, not scroll to results
Search only searches artist titles
Could incorporate small edit distance to allow for a single character mistype

### Sort results predictably

### Add UI to menu to see all artists I follow with new albums as a easily-viewed list
Clicking an artist will show just that one
Add menu option to see all artists, regardless of new albums or not

### Filter by genre and album type
Persist genres property for each artist from spotify's following-artists call
Build UI to show all the genres available, then filters each
Put in another menu called Filters on the action bar with the username

### Add album to playlist from the website
Let's have a playlist for this webapp, sort of like a queue

Add all the songs from the selected album to the playlist
https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/

Mark album as seen

### Re-think mobile
Can we get rid of the modal and flip cards still? What if we showed only one album on the screen so it was bigger?


# Bugs 

### The spotify access token expires but I don't have code that gets a new one if this happens so the request will fail
Need to save in session the date that access_token expires
    Then before making a request we check if it's expired
    If so, send the refresh_token instead to get a new access_token and save that in the session
    Then continue with the original request
So, need a mock server like nock to test this (use jest-nock branch)
https://developer.spotify.com/documentation/general/guides/authorization-guide/

### Request throttling still doesn't work
It fails at "Uh oh, the retry after throttle failed too" with a 429, suggesting the throttling is not working
Set up a nock server to test this

### Lazy load is broken now
When you load the page you cannot search for artists below because the whole artist is being lazy loaded it seems

### Should say "Show" instead of "Collapse" when the artist is collapsed


# Chores

### Generate a new client secret with spotify
Then add a heroku config for it and reference that in the code
For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses
