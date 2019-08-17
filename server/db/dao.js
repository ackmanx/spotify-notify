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
    const [document] = await fetchUserData(userId).project({newAlbumsCache: 1}).toArray()
    return document.newAlbumsCache
}

// //Saves a fresh new albums cache for a given user
// exports.saveNewAlbumsCache = (userId, cache) => db.set(`${SLICES.newAlbumsCache}.${userId}`, cache).write()

/*
 * The DB has a single `collection` that contains all user data. Each `document` corresponds to a single user
 * Here we get the user's complete data set, then filter to only return `seenAlbums` field
 * Because this returns a MongoDB `Cursor`, we have to convert to an array
 */
exports.getSeenAlbums = async userId => {
    const [document] = await fetchUserData(userId).project({seenAlbums: 1}).toArray()
    return document.seenAlbums
}

// //Saves seen albums cache for a given user
// exports.saveSeenAlbums = (userId, seenAlbums) => db.set(`${SLICES.seenAlbums}.${userId}`, seenAlbums).write()





//todo: LEFT OFF HERE
//todo: have to implement the two save functions. update spotify.js with it. update auth.js if it uses it.
