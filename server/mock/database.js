const schema = {
    //This is the list of albumId that the user has acknowledged as no longer being considered new
    seenAlbums: {
        '<userId>': ['<albumbId>']
    },
    //This is the response from /get-new-albums
    //It will persist until the user forces a refresh of the endpoint and will be replaced with the new response
    newAlbumsCache: {
        '<userId>': {
            '1l2oLiukA9i5jEtIyNWIEP': {
                id: '1l2oLiukA9i5jEtIyNWIEP',
                name: 'Carpenter Brut',
                albums: [
                    {
                        id: '7fy6Wpnn5NZllJzUXDeDpS',
                        name: 'Leather Teeth',
                        url: 'https://open.spotify.com/album/7fy6Wpnn5NZllJzUXDeDpS',
                        coverArt: 'https://i.scdn.co/image/878f652904ef84d9d357a3df9d92d8da313b3f12'
                    }
                ]
            }
        }
    }
}
