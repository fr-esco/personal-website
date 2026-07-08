import { DOCUMENT } from '@angular/common'
import { Component, inject, LOCALE_ID, OnInit, signal } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { marked } from 'marked'

import {
  APP_IMAGE,
  APP_LOGO,
  APP_SITE_NAME,
  APP_TITLE,
  APP_URL,
} from '../app-seo'
import { SeoService } from '../seo.service'
import { BlogPost, BlogService } from './blog.service'

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="prose lg:prose-xl dark:prose-invert mx-auto px-4 py-20">
      <!-- Content Section -->
      <section
        class="content-fade-in"
        [innerHTML]="content()"
      ></section>

      <!-- Tags Footer Section -->
      @if (post()?.keywords?.length) {
        <footer
          class="animate-in fade-in slide-in-from-bottom-4 border-outline-variant mt-16 border-t pt-8 duration-1000"
        >
          <div class="mb-6 flex items-center gap-2">
            <span class="bg-primary h-px w-8 opacity-50"></span>
            <h3
              class="text-on-surface-variant text-xs font-bold tracking-[0.2em] uppercase"
              i18n
            >
              Discover More
            </h3>
          </div>

          <div class="flex flex-wrap gap-3">
            @for (tag of post()?.keywords; track tag) {
              <a
                class="group from-surface-container to-surface-container-high border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary relative transform cursor-pointer rounded-full border bg-linear-to-br px-4 py-1.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_-5px_var(--color-primary)]"
                [queryParams]="{ tag: tag }"
                [routerLink]="['/blog']"
              >
                <span class="relative z-10 flex items-center gap-1.5">
                  <span
                    class="text-primary opacity-50 transition-all group-hover:opacity-100"
                    >#</span
                  >
                  {{ tag }}
                </span>
              </a>
            }
          </div>
        </footer>
      }
    </article>

    <style>
      .content-fade-in {
        animation: fadeIn 0.8s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  `,
})
export class BlogPostComponent implements OnInit {
  private blogService = inject(BlogService)
  private route = inject(ActivatedRoute)

  private document = inject(DOCUMENT)
  private locale = inject(LOCALE_ID)
  private meta = inject(Meta)
  private titleService = inject(Title)
  private seoService = inject(SeoService)

  public readonly content = signal<string>('')
  public readonly post = signal<BlogPost | null>(null)

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')
    if (!slug) return

    this.blogService.getPostContent(slug).subscribe({
      next: async markdown => {
        const cleanMarkdown = markdown.replace(/^---[\s\S]*?---\n/, '')
        const html = await marked.parse(cleanMarkdown)
        this.content.set(html)
      },
    })

    this.blogService.getPost(slug).subscribe({
      next: post => {
        if (!post) return
        this.post.set(post)
        const fullTitle = `${post.title} | ${APP_TITLE}`
        const fullUrl = `${APP_URL}/${this.locale}/blog/${slug}`

        this.titleService.setTitle(fullTitle)

        // Metadata base
        this.meta.updateTag({ name: 'description', content: post.description })

        this.meta.updateTag({ property: 'og:title', content: fullTitle })
        this.meta.updateTag({
          property: 'og:description',
          content: post.description,
        })
        this.meta.updateTag({
          property: 'og:image',
          content: post.image || APP_IMAGE,
        })
        this.meta.updateTag({ property: 'og:url', content: fullUrl })
        this.meta.updateTag({ property: 'og:type', content: 'article' })

        // Article specific
        this.meta.updateTag({
          property: 'article:published_time',
          content: post.date,
        })
        if (post.modified) {
          this.meta.updateTag({
            property: 'article:modified_time',
            content: post.modified,
          })
        }
        if (post.authorUrl) {
          this.meta.updateTag({
            property: 'article:author',
            content: post.authorUrl,
          })
        }
        if (post.authorUsername) {
          this.meta.updateTag({
            property: 'profile:username',
            content: post.authorUsername,
          })
        }
        if (post.category) {
          this.meta.updateTag({
            property: 'article:section',
            content: post.category,
          })
        }

        // Tags (Handle multiple)
        const oldTags = this.document.head.querySelectorAll(
          "meta[property='article:tag']"
        )
        oldTags.forEach(tag => tag.remove())
        post.keywords?.forEach(keyword => {
          this.meta.addTag({ property: 'article:tag', content: keyword })
        })

        // Twitter
        this.meta.updateTag({ name: 'twitter:title', content: fullTitle })
        this.meta.updateTag({
          name: 'twitter:description',
          content: post.description,
        })
        this.meta.updateTag({
          name: 'twitter:image',
          content: post.image || APP_IMAGE,
        })

        // SEO: Canonical
        // Remove existing if any (to avoid duplicates on nav)
        const head = this.document.head
        let canonical = head.querySelector(
          "link[rel='canonical']"
        ) as HTMLLinkElement | null
        if (canonical) {
          canonical.href = fullUrl
        } else {
          canonical = this.document.createElement('link') as HTMLLinkElement
          canonical.rel = 'canonical'
          canonical.href = fullUrl
          head.appendChild(canonical)
        }

        // Structured Data
        const schemas: Record<string, unknown>[] = []

        const blogPostingSchema = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          alternativeHeadline: post.excerpt,
          abstract: post.excerpt,
          keywords: post.keywords?.join(', '),
          image: [post.image || APP_IMAGE],
          datePublished: post.date,
          dateModified: post.modified || post.date,
          author: [
            {
              '@type': 'Person',
              name: post.author || APP_SITE_NAME,
              url: post.authorUrl,
            },
          ],
          publisher: {
            '@type': 'Organization',
            name: APP_SITE_NAME,
            logo: {
              '@type': 'ImageObject',
              url: APP_LOGO,
            },
          },
          description: post.description,
          url: fullUrl,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': fullUrl,
          },
        }
        schemas.push(blogPostingSchema)

        // AEO: Direct Answer via FAQPage
        if (post.directAnswer) {
          schemas.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: post.title,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: post.directAnswer,
                },
              },
            ],
          })
        }

        this.seoService.setStructuredData(schemas)

        // SEO: Alternates (hreflang)
        // We need to fetch ALL posts or at least know the alternates.
        // BlogService currently gets posts for current lang only.
        // For a proper implementation we would need a way to look up slug -> translationKey -> other slugs.
        // Assuming we could fetch a global map or simply use the translationKey if provided.
        // Let's implement a 'getTranslations' in BlogService in the future.
        // For now, if translationKey exists, we can GUESS the structure or we'd need a registry fetch.

        // Let's skip heavy alternate logic client-side unless requested,
        // as SSR handles the initial load generally, but Single Page App navigation needs updates.
        // The sitemap already handles the static alternates for crawlers.
      },
    })
  }
}
