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
        console.log('')
        console.log('##', this.currentItem)
        let response = await fetch(`http://me:3666/sandbox?id=${this.currentItem}`)
        let retryAfter = response.headers.get('retry-after') || ''

        while (retryAfter) {
            console.log('going to retry', retryAfter)
            response = await fetch(`http://me:3666/sandbox?id=${this.currentItem}`)
            retryAfter = response.headers.get('retry-after') || ''
            console.log('new response', retryAfter)
        }

        console.log('final response', response.status, retryAfter)
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
