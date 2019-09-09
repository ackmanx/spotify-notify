export async function doGet(url) {
    const response = await fetch(url)
    return await response.json()
}

export async function fetchUnseenAlbums(shouldGetCached) {
    return await doGet(shouldGetCached ? '/api/albums/cached' : '/api/albums/refresh')
}

export async function postSeenAlbums(seenAlbums) {
    await fetch('/api/seen-albums/update',
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
