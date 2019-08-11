const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

//Providing serialize/deserialize functions to remove whitespace. By default lowdb outputs a nicely formatted JSON file
const db = low(new FileSync('server/db/database.json', {
    serialize: obj => JSON.stringify(obj),
    deserialize: data => JSON.parse(data)
}))

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

//Returns the new albums cache for a given user
exports.getNewAlbumsCache = userId => db.get(SLICES.newAlbumsCache).value()[userId]

//Saves a fresh new albums cache for a given user
exports.saveNewAlbumsCache = (userId, cache) => db.set(`${SLICES.newAlbumsCache}.${userId}`, cache).write()

//Returns the seen albums cache for a given user
exports.getSeenAlbums = userId => db.get(SLICES.seenAlbums).value()[userId]

//Saves seen albums cache for a given user
exports.saveSeenAlbums = (userId, seenAlbums) => db.set(`${SLICES.seenAlbums}.${userId}`, seenAlbums).write()
