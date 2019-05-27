const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const db = low(new FileSync('server/db/database.json'))

const SLICES = {
    newAlbumsCache: 'newAlbumsCache',
    seenAlbums: 'seenAlbums',
    users: 'users',
}

db
    .defaults({
        newAlbumsCache: {},
        seenAlbums: {},
        users: {}
    })
    .write()

function initializeDatabaseForUser(userId) {
    if (!db.get(SLICES.users).value()[userId]) {
        db.get(SLICES.users).value()[userId] = null
        db.get(SLICES.newAlbumsCache).value()[userId] = null
        db.get(SLICES.seenAlbums).value()[userId] = null

        db.write()
    }
}

module.exports = {
    db,
    initializeDatabaseForUser,
}
