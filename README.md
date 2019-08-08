# Remaining

* Need to somehow batch and retry after rate limit hit

* BUG: Extreme performance problems with huge list, selecting and deselecting  super-cpu intensive and has huge delays until state is reflected
    * Maybe I can optimize `markAsSeen`

* BUG: Screen jumps to top after selecting

* BUG: Clicking artist name twice adds again. The seenAlbums list in state needs to be a set.

* PROD: When I deploy, how will I backup my database?
    * Maybe have a script that will download it so I can version control updates periodically

* IDEA: Sort albums first, then singles, show a divider, or indicate somehow which is which
    * Manually update database with some mock data so can wait on a full refresh
    * This requires a full refresh of the db because cached data does not have `type` property from Spotify

* IDEA: Allow choosing to open spotify url (for web player) or spotify uri (which opens desktop player)
    * Manually update database with some mock data so can wait on a full refresh
    * This requires a full refresh of the db because cached data does not have `uri` property from Spotify
    * See `uri` in mock response


## If there's performance issues with DB in the future...

Do a quick performance test of current speeds, then swap this and see if it helps
Also check file size before and after
const db = low(new FileSync('server/db/database.json', {
    serialize: (obj) => JSON.stringify(obj),
    deserialize: (data) => JSON.parse(data)
}
