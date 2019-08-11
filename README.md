# Remaining

* BUG: Extreme performance problems with huge list, selecting and deselecting  super-cpu intensive and has huge delays until state is reflected
    * Maybe I can optimize `markAsSeen`

* PROD: When I deploy, how will I backup my database?
    * Maybe have a script that will download it so I can version control updates periodically

* CHORE: Refactor service to provide `releases` which is an object with albums and singles as separate arrays so the UI doesn't need to do this
    * This will also clean up naming so that an album is just a set of songs, not and also meaning a single
