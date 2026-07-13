import { AsyncPipe } from '@angular/common'
import { Component, inject, LOCALE_ID } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'

import { ThemeService } from '../theme.service'

@Component({
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class MainLayoutComponent {
  public themeService = inject(ThemeService)
  private localeId = inject(LOCALE_ID)

  public get currentLocale(): string {
    return this.localeId
  }

  public preloadBlog() {
    import('../blog/blog-list.component').catch((err) => console.debug(err))
    import('../blog/blog-post.component').catch((err) => console.debug(err))
  }

  public toggleLanguage(): void {
    if (typeof window === 'undefined') return

    const pathname = window.location.pathname
    const search = window.location.search
    const hash = window.location.hash

    let newPath = pathname
    if (this.localeId.startsWith('it')) {
      // Switch from Italian to English
      if (pathname.startsWith('/it/')) {
        newPath = pathname.substring(3) // /it/blog -> /blog
      } else if (pathname === '/it') {
        newPath = '/'
      }
    } else {
      // Switch from English to Italian
      if (pathname.startsWith('/en/')) {
        newPath = '/it' + pathname.substring(3)
      } else if (pathname === '/en') {
        newPath = '/it'
      } else {
        newPath = '/it' + pathname
      }
    }

    // Ensure it starts with / and clean up double slashes
    if (!newPath.startsWith('/')) {
      newPath = '/' + newPath
    }
    newPath = newPath.replace(/\/+/g, '/')

    window.location.href = `${window.location.origin}${newPath}${search}${hash}`
  }
}
