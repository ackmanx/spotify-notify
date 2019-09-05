# Features

### Styled Components

### Convert to TypeScript

### Mobile friendly
clean up css and modal code
loading text is too high
    center it when first loading the page
    add padding when doing a refresh
check the new user text
check the no followed artists text
refresh button hover text doesn't go away after finished
artist name not showing up in modal

### Generate a new client secret with spotify
Then add a heroku config for it and reference that in the code
For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses

### Create modal to listen to that album RIGHT NOW
After modal open, generate an iframe to insert an embedded player
Use the album's URI so it shows the whole album
https://developer.spotify.com/documentation/widgets/generate/play-button/

### Have an option to view all albums, including seen
Would need a new UI for this
Combine action buttons to the left and add a hamburger to the right

### Add overlay for refresh and submit

### Use card flip css trick instead of hover on desktop

# Bugs

### Every Album instance on the page renders when you ghost an item

### The spotify access token expires but I don't have code that gets a new one if this happens so the request will fail
Use case is a user (me) sets a bunch of albums as seen but doesn't submit it

### Spotify doesn't take focus after opening
This is because I remove the _blank target from the link. This prevented a new tab from opening, but also caused this where focus isn't there
Either go back to _blank or find a different method

# Chores

### Namespace my css or use Styled Components instead of avoiding it because I'm having conflicts

### Rename new albums concept to unseen albums

### Remove artistName from artist.js and album.js because it will be included in the album now after I do a refresh
