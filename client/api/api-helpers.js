export async function doGet(url) {
    const response = await fetch(url)
    return await response.json()
}

export async function fetchNewAlbums(shouldGetCached) {
    return await doGet(shouldGetCached ? '/api/new-albums/cached' : '/api/new-albums/refresh')
}
