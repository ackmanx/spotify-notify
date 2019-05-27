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

exports.initializeDatabaseForUser = function initializeDatabaseForUser(userId) {
    if (!db.get(SLICES.users).value()[userId]) {
        db.get(SLICES.users).value()[userId] = true
        db.get(SLICES.newAlbumsCache).value()[userId] = {}
        db.get(SLICES.seenAlbums).value()[userId] = []

        db.write()
    }
}

exports.getNewAlbumsCache = () => db.get(SLICES.newAlbumsCache).value()
