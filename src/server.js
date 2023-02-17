/**
 * The starting point of the application.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import session from 'express-session'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import logger from 'morgan'
import helmet from 'helmet'
import { router } from './routes/router.js'

try {
  // Creates an Express application.
  const app = express()

  // Create an HTTP server and pass it to Socket.IO.
  const httpServer = createServer(app)
  const io = new Server(httpServer)

  // Not necessary, but nice to log when a user connects/disconnects.
  io.on('connection', (socket) => {
    console.log('socket.io: a user connected')

    socket.on('disconnect', () => {
      console.log('socket.io: a user disconnected')
    })
  })

  // Get the directory name of this module's path.
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Set the base URL to use for all relative URLs in a document.
  const baseURL = process.env.BASE_URL || '/'

  // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
  // (The web application uses external scripts and therefore needs to explicitly trust on cdn.jsdelivr.net.)
  app.use(helmet())
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", 'cdn.jsdelivr.net'],
        'img-src': ["'self'", 'secure.gravatar.com']
      }
    })
  )
  // app.use(helmet({ crossOriginEmbedderPolicy: false }))
  // Set up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // View engine setup.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  app.use(express.urlencoded({ extended: false }))

  // --------------------------------------------------------------------------
  //
  // Webhook: Parse incoming requests with JSON payloads (application/json).
  // Populates the request object with a body object (req.body).
  //
  app.use(express.json())
  // --------------------------------------------------------------------------

  // Serve static files.
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // Setup and use session middleware (https://github.com/expressjs/session)
  const sessionOptions = {
    name: process.env.SESSION_NAME, // Don't use default session cookie name.
    secret: process.env.SESSION_SECRET, // Change it!!! The secret is used to hash the session with HMAC.
    resave: false, // Resave even if a request is not changing the session.
    saveUninitialized: false, // Don't save a created but not modified session.
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax', // Protect cookie from CSRF
      httpOnly: true // Protect from XSS-attack
    }
  }

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionOptions.cookie.secure = true // serve secure cookies
  }

  app.use(session(sessionOptions))

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Flash messages - survives only a round trip.
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    // Pass the base URL to the views.
    res.locals.baseURL = baseURL

    // Add the io object to the response object to make it available in controllers.
    res.io = io

    next()
  })

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use(function (err, req, res, next) {
    // 404 Not Found.
    if (err.status === 404 || res.status === 404) {
      return res
        .status(404)
        .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
    }

    // 500 Internal Server Error (in production, all other errors send this response).
    if (req.app.get('env') !== 'development') {
      return res
        .status(500)
        .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))
    }
    // Development only!
    // Only providing detailed error in development.

    // Render the error page.
    res
      .status(err.status || 500)
      .render('errors/error', { error: err })
  })

  // Starts the HTTP server listening for connections.
  httpServer.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
