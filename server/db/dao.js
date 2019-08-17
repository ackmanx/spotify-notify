const {getUserDataCollection} = require('./mongo')

function fetchUserData(userId) {
    return getUserDataCollection().find({userId})
}

//todo: add a comment here explaining how this works
exports.getNewAlbumsCache = async userId => {
    const [document] = await fetchUserData(userId).project({newAlbumsCache: 1}).toArray()
    return document.newAlbumsCache
}

// //Saves a fresh new albums cache for a given user
// exports.saveNewAlbumsCache = (userId, cache) => db.set(`${SLICES.newAlbumsCache}.${userId}`, cache).write()

exports.getSeenAlbums = async userId => {
    const [document] = await fetchUserData(userId).project({seenAlbums: 1}).toArray()
    return document.seenAlbums
}

// //Saves seen albums cache for a given user
// exports.saveSeenAlbums = (userId, seenAlbums) => db.set(`${SLICES.seenAlbums}.${userId}`, seenAlbums).write()





//todo: LEFT OFF HERE
//todo: have to implement the two save functions. update spotify.js with it. update auth.js if it uses it.
