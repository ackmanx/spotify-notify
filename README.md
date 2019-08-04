# Remaining

* Need to somehow batch and retry after rate limit hit

* BUG: Extreme performance problems with huge list, selecting and deselecting  super-cpu intensive and has huge delays until state is reflected
    * Maybe I can optimize `markAsSeen`

* BUG: Screen jumps to top after selecting

* STYLE: Artist name should act like a button and not a div

* BUG: Clicking artist name twice adds again. The seenAlbums list in state needs to be a set.

* CHORE: Rename `markAsSeen` to `markAlbumAsSeen`
