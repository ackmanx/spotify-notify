export async function doGet(url) {
    const response = await fetch(url)
    return await response.json()
}

export async function fetchNewReleases(shouldGetCached) {
    return await doGet(shouldGetCached ? '/api/releases/cached' : '/api/releases/refresh')
}

export async function postSeenReleases(seenAlbums) {
    await fetch('/api/seen-releases/update',
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
