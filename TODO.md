# Features

### Styled Components

### Convert to TypeScript

### Mobile friendly

### Generate a new client secret with spotify
Then add a heroku config for it and reference that in the code
For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses


# Bugs

### Every Album instance on the page renders when you ghost an item

### Clicking an artist to mark all albums as seen stacks and sends duplicates

### `totalNewAlbums` is not being populated correctly, or is not being updated when the cache is read
    * If a user marks an album as seen, but doesn't refresh. That should reduce `totalNewAlbums` still
    * The current problem is that I'm iterating over artists, thinking it's albums
