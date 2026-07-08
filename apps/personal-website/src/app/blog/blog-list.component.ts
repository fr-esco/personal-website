import { DatePipe } from '@angular/common'
import { Component, computed, inject, LOCALE_ID } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Meta, Title } from '@angular/platform-browser'
import { ActivatedRoute, Params, RouterLink } from '@angular/router'

import { APP_LOGO, APP_SITE_NAME, APP_TITLE, APP_URL } from '../app-seo'
import { SeoService } from '../seo.service'
import { BlogService } from './blog.service'

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <header class="mb-12 text-center">
      <h2
        class="text-on-surface mb-4 text-4xl font-bold tracking-tight lg:text-5xl"
        i18n
      >
        Running Blog
      </h2>
      <p
        class="text-on-surface-variant mx-auto max-w-2xl text-lg"
        i18n
      >
        Insights, updates, and deep dives into world building and game
        mastering.
      </p>

      @if (activeTag()) {
        <div class="animate-in fade-in slide-in-from-top-4 mt-8 duration-500">
          <div
            class="border-primary/20 bg-primary/5 inline-flex items-center gap-3 rounded-full border px-4 py-2"
          >
            <span class="text-on-surface-variant text-sm font-medium"
              >Filtering by:</span
            >
            <span class="text-primary text-sm font-bold"
              >#{{ activeTag() }}</span
            >
            <a
              aria-label="Clear filter"
              class="text-on-surface-variant hover:bg-primary/10 hover:text-error ml-2 rounded-full p-1 transition-colors"
              [routerLink]="['/blog']"
            >
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </a>
          </div>
        </div>
      }
    </header>

    @if (filteredPosts().length === 0) {
      <div class="animate-in fade-in zoom-in-95 py-20 text-center duration-500">
        <p
          class="text-on-surface-variant mb-4 text-xl"
          i18n
        >
          No posts found for this tag.
        </p>
        <a
          class="text-primary font-medium hover:underline"
          i18n
          [routerLink]="['/blog']"
          >View all posts</a
        >
      </div>
    } @else {
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        @for (post of filteredPosts(); track post.slug) {
          <article
            class="group bg-surface-container-low border-outline-variant hover:border-primary/50 relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            @if (post.image) {
              <div
                class="bg-surface-container-high aspect-video overflow-hidden"
              >
                <a
                  class="block h-full w-full"
                  [routerLink]="['/blog', post.slug]"
                >
                  <img
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    [alt]="post.title"
                    [src]="post.image"
                  />
                </a>
              </div>
            }

            <div class="flex flex-1 flex-col p-6">
              <div
                class="text-on-surface-variant/80 mb-3 flex items-center gap-3 text-xs font-medium tracking-wider uppercase"
              >
                <time [dateTime]="post.date">{{
                  post.date | date: 'mediumDate'
                }}</time>
                @if (post.keywords?.length) {
                  <span>•</span>
                  <span>{{ activeTag() || post.keywords![0] }}</span>
                }
              </div>

              <h3
                class="text-on-surface group-hover:text-primary mb-3 line-clamp-2 text-xl font-bold transition-colors"
              >
                <a
                  class="focus:outline-none"
                  [routerLink]="['/blog', post.slug]"
                >
                  {{ post.title }}
                </a>
              </h3>

              <p
                class="text-on-surface-variant mb-6 line-clamp-3 flex-1 leading-relaxed"
              >
                {{ post.description }}
              </p>

              <a
                class="text-primary relative z-10 flex items-center text-sm font-medium transition-transform group-hover:translate-x-1"
                [routerLink]="['/blog', post.slug]"
              >
                Read article
                <svg
                  class="ml-1 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    fill-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </article>
        }
      </div>
    }
  `,
})
export class BlogListComponent {
  private blogService = inject(BlogService)
  private route = inject(ActivatedRoute)
  private locale = inject(LOCALE_ID)
  private meta = inject(Meta)
  private titleService = inject(Title)
  private seoService = inject(SeoService)

  // Signals
  private allPosts = toSignal(this.blogService.getPosts(), { initialValue: [] })
  private queryParams = toSignal(this.route.queryParams, { initialValue: {} })

  public activeTag = computed(() => {
    const params = this.queryParams() as Params
    return params['tag']
  })

  public filteredPosts = computed(() => {
    const posts = this.allPosts()
    const tag = this.activeTag()?.toLowerCase()

    if (!tag) return posts

    return posts.filter(
      post =>
        post.keywords?.some(k => k.toLowerCase() === tag) ||
        // Fallback: check tags array if used instead of keywords in some markdown files
        // post.tags?.some(t => t.toLowerCase() === tag)
        false
    )
  })

  constructor() {
    this.setSeo()
  }

  private setSeo() {
    const title = $localize`Blog | ${APP_TITLE}`
    const description = $localize`Read our latest blog posts`
    const url = `${APP_URL}/${this.locale}/blog`

    this.titleService.setTitle(title)
    this.meta.updateTag({ name: 'description', content: description })

    this.meta.updateTag({ property: 'og:title', content: title })
    this.meta.updateTag({ property: 'og:description', content: description })
    this.meta.updateTag({ property: 'og:type', content: 'website' })
    this.meta.updateTag({ property: 'og:url', content: url })

    this.meta.updateTag({ name: 'twitter:title', content: title })
    this.meta.updateTag({ name: 'twitter:description', content: description })

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: title,
      description,
      url,
      publisher: {
        '@type': 'Organization',
        name: APP_SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: APP_LOGO,
        },
      },
    }
    this.seoService.setStructuredData(schema)
  }
}
