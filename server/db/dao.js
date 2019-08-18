const {getUserDataCollection} = require('./mongo')

/*
 * Returns a MongoDB `Cursor` for all of the specified user's data in a single `document`
 */
function fetchUserData(userId) {
    return getUserDataCollection().find({userId})
}

/*
 * The DB has a single `collection` that contains all user data. Each `document` corresponds to a single user
 * Here we get the user's complete data set, then filter to only return `newAlbumsCache` field
 * Because this returns a MongoDB `Cursor`, we have to convert to an array
 */
exports.getNewAlbumsCache = async userId => {
    const [document = {}] = await fetchUserData(userId).project({newAlbumsCache: 1}).toArray()
    return document.newAlbumsCache || {}
}

/*
 * Replaces the user's new albums cache with the passed cache using Mongo's `$set` update operator
 */
exports.saveNewAlbumsCache = async (userId, newAlbumsCache) => await getUserDataCollection().updateOne({userId}, {$set: {newAlbumsCache}})

/*
 * The DB has a single `collection` that contains all user data. Each `document` corresponds to a single user
 * Here we get the user's complete data set, then filter to only return `seenAlbums` field
 * Because this returns a MongoDB `Cursor`, we have to convert to an array
 */
exports.getSeenAlbums = async userId => {
    const [document = {}] = await fetchUserData(userId).project({seenAlbums: 1}).toArray()
    return document.seenAlbums || []
}

/*
 * Replaces the user's seen albums with the passed array using Mongo's `$set` update operator
 */
exports.saveSeenAlbums = async (userId, seenAlbums) => await getUserDataCollection().updateOne({userId}, {$set: {seenAlbums}})


exports.initializeDatabaseForUser = async userId => {
    const userAlreadyInDatabase = await getUserDataCollection().find({userId}).count()

    if (!userAlreadyInDatabase) {
        await getUserDataCollection().insertOne({userId})
    }
}

/*
 * Dumps the entire database. A sledgehammer of curiosity if I don't want to go to the MongoDB Atlas dashboard
 */
exports.dump = async () => await getUserDataCollection().find({}).toArray()
