export async function doGet(url) {
    const response = await fetch(url)
    return await response.json()
}

export async function fetchRefreshStatus() {
    return await doGet('/api/albums/refresh-status')
}

export async function fetchHeartbeat() {
    return await doGet('/api/heartbeat')
}

export async function fetchUnseenAlbums(shouldGetCached) {
    return await doGet(shouldGetCached ? '/api/albums/cached' : '/api/albums/refresh')
}

export async function postAddToPlaylist(albumId) {
    await fetch('/api/albums/add-to-playlist', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ albumId }),
    })
}

export async function postSeenAlbums(seenAlbums) {
    await fetch('/api/albums/update-seen', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ albumIds: seenAlbums }),
    })
}
