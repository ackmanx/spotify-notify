const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const compression = require('compression')
const debug = require('debug')(`sn:${path.basename(__filename)}`)

const renderRouter = require('./routes/render')
const apiRouter = require('./routes/api')
const { authRouter } = require('./routes/spotify-auth')

const app = express()

// ---------------------------------------------------------------------------------
// Engine setup
// ---------------------------------------------------------------------------------
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// ---------------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------------
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: 31536000 }))
app.use(compression())

app.use(
    session({
        secret: 'oh-boy-oh-boy',
        resave: false,
        saveUninitialized: true,
    })
)

// ---------------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------------
app.use('/', renderRouter)
app.use('/api', apiRouter)
app.use('/auth', authRouter)

if (process.env.MOCK) app.use('/sandbox', require('./routes/sandbox'))

// ---------------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------------

//If we made it this far, none of our routes were triggered, so it is a 404
app.use(function (req, res, next) {
    debug(`No resource found for ${req.url}, creating 404 error`)
    next(createError(404))
})

app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
