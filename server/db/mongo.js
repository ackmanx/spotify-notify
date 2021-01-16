const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)
const MongoClient = require('mongodb').MongoClient

let client
const clusterName = 'hobby-cluster'
const databaseName = 'spotify-notify'

//This was provided by the mongodb website dashboard
const connectionUrl = `mongodb+srv://admin:F8cHHZjWza0SRGOx@${clusterName}-f6tmy.mongodb.net/test?retryWrites=true&w=majority`

exports.initDatabase = (callback) => {
    client = new MongoClient(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true })

    client.connect(function (err) {
        if (err) {
            debug(err)
            return
        }

        debug('Connected successfully to MongoDB server')

        const shutdown = (reason) => () => {
            debug(`${reason} signal received. Shutting MongoDB server down...`)
            client.close()
        }

        process.on('SIGTERM', shutdown('SIGTERM')).on('SIGINT', shutdown('SIGINT'))

        callback()
    })
}

exports.getUserDataCollection = () => client.db(databaseName).collection('user-data')

exports.databaseName = databaseName
