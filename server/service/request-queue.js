/*
 * This is intended to be run as a script until it's ready to be integrated into the application and used
 */

const fetch = require('node-fetch')

/*
 * Asynchronously and sequentially process a queue
 * Todo: Handle request throttling like Spotify does
 */
class RequestQueue {
    currentItem;
    items;

    constructor(items) {
        this.items = items
        this.currentItem = this.items[0]
    }

    next() {
        this.items.splice(0, 1)
        this.currentItem = this.items[0]
        return this.currentItem
    }

    async request() {
        const response = await fetch(`http://me:3666/sandbox?id=${this.currentItem}`)
        await response.json()
        const retryAfter = response.headers.get('retry-after')
        console.log('##', response.status, retryAfter || '')
    }

    async process() {
        do {
            await this.request()
        }
        while (queue.next())
    }
}

const queue = new RequestQueue([1, 2, 3, 4, 5])

queue.process()
