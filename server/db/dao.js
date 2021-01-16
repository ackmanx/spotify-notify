const { getUserDataCollection } = require('./mongo')

exports.Slices = {
    unseenAlbumsCache: 'unseenAlbumsCache',
    seenAlbums: 'seenAlbums',
    user: 'user',
    search: 'search',
}

exports.initializeDatabaseForUser = async (user) => {
    const userAlreadyInDatabase = await getUserDataCollection().find({ 'user.id': user.id }).count()

    if (!userAlreadyInDatabase) {
        await getUserDataCollection().insertOne({
            user: {
                id: user.id,
                name: user.display_name,
            },
            seenAlbums: [],
            unseenAlbumsCache: {},
            search: [],
        })
    }
}

/*
 * The DB has a single `collection` that contains all user data. Each `document` corresponds to a single user
 * Here we get the user's complete data set, then filter (using `project`) to only return the requested data
 * Because this returns a MongoDB `Cursor` and we want all of the results immediately, we have to convert to an array
 */
exports.getUserData = async (userId, slice) => {
    const userCursor = await getUserDataCollection().find({ 'user.id': userId })

    if (slice) {
        const [document = {}] = await userCursor.project({ [slice]: 1 }).toArray()
        return document[slice]
    }

    const [document = {}] = await userCursor.toArray()
    return document
}

exports.saveUserData = async (userId, slice, value) => {
    if (process.env.MOCK) {
        return true
    }

    return await getUserDataCollection().updateOne({ 'user.id': userId }, { $set: { [slice]: value } })
}
