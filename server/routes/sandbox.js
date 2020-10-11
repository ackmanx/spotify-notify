const express = require('express')
const router = express.Router()
const path = require('path')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

router.get('/', function (req, res) {
    const body = {
        initial: new Date(),
        ...req.query,
    }

    setTimeout(() => {
        body.finished = new Date()

        if (Math.floor(Math.random() * 3 + 1) % 3 === 0) {
            res.status(429)
            res.header('retry-after', 5)
        }

        res.json(body)
    }, Math.floor(Math.random() * 3) * 1000)
})

module.exports = router
