const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const db = low(new FileSync('server/db/database.json'))

db.defaults({seenAlbums: {}, newAlbumsCache: {}})
    .write()

module.exports = db
