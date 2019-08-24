export async function doGet(url) {
    const response = await fetch(url)
    return await response.json()
}

export async function fetchNewAlbums(shouldGetCached) {
    return await doGet(shouldGetCached ? '/api/new-albums/cached' : '/api/new-albums/refresh')
}

export async function postSeenAlbums(seenAlbums) {
    await fetch('/api/update-seen-albums',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({albumIds: seenAlbums}),
        }
    )
}
