const fetch = require('node-fetch')
const delay = require('delay')

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
        let response = await fetch(`http://me:3666/sandbox?id=${this.currentItem}`)
        let retryAfter = response.headers.get('retry-after') || ''

        while (retryAfter) {
            await delay(retryAfter * 1000)
            response = await fetch(`http://me:3666/sandbox?id=${this.currentItem}`)
            retryAfter = response.headers.get('retry-after') || ''
        }
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
