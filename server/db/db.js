const db = require('dirty')('server/seenAlbums.db')

db.on('load', function() {
    console.log('Dirty: DB is loaded');
})

db.on('drain', function() {
    console.log('Dirty: All records are saved on disk now')
})

module.exports = db
