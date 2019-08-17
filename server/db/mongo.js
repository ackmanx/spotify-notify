const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

//This was provided by the mongodb website dashboard
const connectionUrl = 'mongodb+srv://admin:F8cHHZjWza0SRGOx@spotify-notify-f6tmy.mongodb.net/test?retryWrites=true&w=majority'

const MongoClient = require('mongodb').MongoClient

const client = new MongoClient(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect(function (err) {
    if (err) {
        debug(err)
        return
    }

    debug("Connected successfully to MongoDB server")

    const shutdown = reason => () => {
        debug(`${reason} signal received from Heroku dyno manager. Shutting down`)
        client.close()
    }

    process
        .on('SIGTERM', shutdown('SIGTERM'))
        .on('SIGINT', shutdown('SIGINT'))
})
