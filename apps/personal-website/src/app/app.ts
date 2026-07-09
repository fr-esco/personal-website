import { DOCUMENT } from '@angular/common'
import { Component, inject, LOCALE_ID } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { filter } from 'rxjs/operators'

import {
  APP_DESCRIPTION,
  APP_FACEBOOK,
  APP_IMAGE,
  APP_INSTAGRAM,
  APP_LINKEDIN,
  APP_LOGO,
  APP_PINTEREST,
  APP_SITE_NAME,
  APP_SNAPCHAT,
  APP_TIKTOK,
  APP_TITLE,
  APP_TWITTER,
  APP_URL,
  APP_X,
  APP_YOUTUBE,
} from './app-seo'
import { getAlternateLocales, normalizeLocale } from './core/i18n-l10n.util'
import { SeoService } from './seo.service'
import { ThemeService } from './theme.service'

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
  host: {
    class:
      'block h-full bg-zinc-50 text-zinc-900 dark:text-zinc-50 dark:bg-zinc-900',
  },
})
export class App {
  private meta = inject(Meta)
  private titleService = inject(Title)
  private router = inject(Router)
  private document = inject(DOCUMENT)
  private locale = inject(LOCALE_ID)
  private seoService = inject(SeoService)
  private themeService = inject(ThemeService)

  constructor() {
    this.setSeo()
    this.trackCanonical()
  }

  private trackCanonical() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateCanonical()
        this.updateAlternateLinks()
      })
  }

  private updateAlternateLinks() {
    const head = this.document.head
    const existingAlternates = head.querySelectorAll(
      "link[rel='alternate'][hreflang]"
    )
    existingAlternates.forEach(el => el.remove())

    const path = this.router.url.split('?')[0]
    const baseUrl = APP_URL.replace(/\/$/, '')

    // Add IT translation alternate link
    const linkIt = this.document.createElement('link')
    linkIt.rel = 'alternate'
    linkIt.hreflang = 'it'
    linkIt.href = `${baseUrl}/it${path}`
    head.appendChild(linkIt)

    // Add EN translation alternate link
    const linkEn = this.document.createElement('link')
    linkEn.rel = 'alternate'
    linkEn.hreflang = 'en'
    linkEn.href = `${baseUrl}/en${path}`
    head.appendChild(linkEn)

    // Add x-default (defaults to English)
    const linkDefault = this.document.createElement('link')
    linkDefault.rel = 'alternate'
    linkDefault.hreflang = 'x-default'
    linkDefault.href = `${baseUrl}/en${path}`
    head.appendChild(linkDefault)
  }

  private updateCanonical() {
    const head = this.document.head
    let canonical = head.querySelector(
      "link[rel='canonical']"
    ) as HTMLLinkElement | null
    const lang = this.locale.substring(0, 2) // e.g. 'en', 'it'

    const path = this.router.url.split('?')[0]

    // Construct full URL
    // Ensure APP_URL doesn't have trailing slash, and path starts with slash
    const baseUrl = APP_URL.replace(/\/$/, '')
    const fullUrl = `${baseUrl}/${lang}${path}`

    if (canonical) {
      canonical.href = fullUrl
    } else {
      canonical = this.document.createElement('link') as HTMLLinkElement
      canonical.rel = 'canonical'
      canonical.href = fullUrl
      head.appendChild(canonical)
    }

    // Update structured data based on route if needed, currently handling global here
    // But specific pages will override
    if (this.router.url === '/' || this.router.url.startsWith('/?')) {
      this.setHomeStructuredData()
    }
  }

  private setHomeStructuredData() {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${APP_URL}/#website`,
          url: APP_URL,
          name: APP_SITE_NAME,
          description: APP_DESCRIPTION,
          publisher: {
            '@id': `${APP_URL}/#organization`,
          },
        },
        {
          '@type': 'Organization',
          '@id': `${APP_URL}/#organization`,
          name: APP_SITE_NAME,
          url: APP_URL,
          logo: {
            '@type': 'ImageObject',
            url: APP_LOGO,
          },
          sameAs: [
            APP_X,
            APP_FACEBOOK,
            APP_INSTAGRAM,
            APP_LINKEDIN,
            APP_PINTEREST,
            APP_YOUTUBE,
            APP_TIKTOK,
            APP_SNAPCHAT,
          ].filter(url => url && url !== 'https://francescocolamonici.it'), // Filter out placeholders if they match base warning
        },
      ],
    }
    this.seoService.setStructuredData(schema)
  }

  private setSeo() {
    this.titleService.setTitle(APP_TITLE)
    const locale = normalizeLocale(this.locale)
    const alternateLocales = getAlternateLocales(this.locale)

    this.meta.updateTag({ name: 'description', content: APP_DESCRIPTION })

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: APP_TITLE })
    this.meta.updateTag({
      property: 'og:description',
      content: APP_DESCRIPTION,
    })
    this.meta.updateTag({ property: 'og:site_name', content: APP_SITE_NAME })
    this.meta.updateTag({ property: 'og:type', content: 'website' })
    this.meta.updateTag({ property: 'og:locale', content: locale })
    alternateLocales.forEach(alternateLocale => {
      this.meta.updateTag({
        property: 'og:locale:alternate',
        content: alternateLocale,
      })
    })
    this.meta.updateTag({ property: 'og:image', content: APP_IMAGE })
    this.meta.updateTag({ property: 'og:image:alt', content: APP_TITLE }) // TODO: add image alt
    this.meta.updateTag({ property: 'og:url', content: APP_URL })

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: APP_TITLE })
    this.meta.updateTag({
      name: 'twitter:description',
      content: APP_DESCRIPTION,
    })
    this.meta.updateTag({ name: 'twitter:image', content: APP_IMAGE })
    this.meta.updateTag({ name: 'twitter:site', content: APP_TWITTER })
    this.meta.updateTag({ name: 'twitter:creator', content: APP_TWITTER })
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    })

    // App Links / Mobile
    this.meta.updateTag({ name: 'twitter:domain', content: APP_URL })

    // Set initial home structured data
    this.setHomeStructuredData()
  }
}
