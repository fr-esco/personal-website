import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node'
import express from 'express'

const serverDistFolder = dirname(fileURLToPath(import.meta.url))
const browserDistFolder = resolve(serverDistFolder, '../browser')

const app = express()
const angularApp = new AngularNodeAppEngine()

/**
 * Supported locales for the application.
 */
const supportedLocales = ['it', 'en']
const defaultLocale = 'en'

/**
 * Middleware to redirect to the preferred language if no language is specified in the URL.
 * Only active in production, as development mode usually serves a single locale without subdirectories.
 */
app.use((req, res, next) => {
  // Only redirect if running in production
  if (process.env['NODE_ENV'] !== 'production') {
    return next()
  }

  const { url, path } = req

  // Skip requests for files (e.g., .js, .css, .ico) and internal Angular paths
  if (path.includes('.') || path.startsWith('/@')) {
    return next()
  }

  // Check if the URL already starts with one of the supported locales
  const hasLocalePrefix = supportedLocales.some(
    locale => path.startsWith(`/${locale}/`) || path === `/${locale}`
  )

  if (!hasLocalePrefix) {
    // Detect the user's preferred language from the 'Accept-Language' header
    const preferredLocale =
      req.acceptsLanguages(supportedLocales) || defaultLocale

    // Redirect to the localized URL (e.g., / -> /it/ or /home -> /it/home)
    const redirectUrl =
      url === '/' ? `/${preferredLocale}/` : `/${preferredLocale}${url}`

    return res.redirect(302, redirectUrl)
  }

  next()
})

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
)

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then(response =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next)
})

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app)
