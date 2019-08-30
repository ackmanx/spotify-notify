/*
 * This is what gets saved into the MongoDB collection `user-data`
 */
const userDataSchema = [
    {
        "userId": "ackmanx",
        "newAlbumsCache": {
            "artists": {
                "0OTY72l7CC7ynKzp6N2o5b": { //artistId
                    "id": "0OTY72l7CC7ynKzp6N2o5b",
                    "name": "Daniel Deluxe",
                    "albums": [
                        {
                            "id": "7sAspG14R2muJBcJ3HcFcp",
                            "name": "Territory",
                            "coverArt": "https://i.scdn.co/image/4ffb0a1554dc7ad4b8ce30c553eef8210a81d3af",
                            "releaseDate": "2018-06-22",
                            "type": "single",
                            "spotifyUri": "spotify:album:7sAspG14R2muJBcJ3HcFcp",
                            "spotifyWebPlayerUrl": "https://open.spotify.com/album/7sAspG14R2muJBcJ3HcFcp"
                        }
                    ]
                },
                totalFollowedArtists: 155,
                totalNewAlbums: 25,
            }
        },
        "seenAlbums": [
            "64EHlRxOKVjlK1CY4RPjJz" //albumId
        ]
    }
]
