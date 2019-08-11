# Remaining

* Need to somehow batch and retry after rate limit hit
    * Spotify will send this header with the number of seconds you need to wait: `'retry-after': '1'`,

* BUG: Extreme performance problems with huge list, selecting and deselecting  super-cpu intensive and has huge delays until state is reflected
    * Maybe I can optimize `markAsSeen`

* BUG: Screen jumps to top after selecting

* BUG: Clicking artist name twice adds again. The seenAlbums list in state needs to be a set.

* PROD: When I deploy, how will I backup my database?
    * Maybe have a script that will download it so I can version control updates periodically


## If there's performance issues with DB in the future...

Do a quick performance test of current speeds, then swap this and see if it helps
Also check file size before and after
const db = low(new FileSync('server/db/database.json', {
    serialize: (obj) => JSON.stringify(obj),
    deserialize: (data) => JSON.parse(data)
}
