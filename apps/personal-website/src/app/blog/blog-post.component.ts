import { DOCUMENT } from '@angular/common'
import {
  Component,
  inject,
  LOCALE_ID,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { HlmBadge } from '@spartan-ng/helm/badge'
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
  imports: [RouterLink, HlmBadge],
  encapsulation: ViewEncapsulation.None,
  template: `
    <article
      class="prose lg:prose-xl dark:prose-invert mx-auto px-6 py-12 md:py-20"
    >
      <!-- Back Link -->
      <div class="mb-8 flex items-center print:hidden">
        <a
          class="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm font-semibold no-underline transition-colors"
          [routerLink]="['/blog']"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <line
              x1="19"
              x2="5"
              y1="12"
              y2="12"
            />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span i18n>Back to articles</span>
        </a>
      </div>

      <!-- Content Section -->
      <section
        class="content-fade-in"
        [innerHTML]="content()"
      ></section>

      <!-- Tags Footer Section -->
      @if (post()?.keywords?.length) {
        <footer
          class="animate-in fade-in slide-in-from-bottom-4 border-border mt-16 border-t pt-8 duration-1000"
        >
          <div class="mb-6 flex items-center gap-2">
            <span class="bg-primary h-px w-8 opacity-50"></span>
            <h3
              class="text-muted-foreground text-xs font-bold tracking-[0.2em] uppercase"
              i18n
            >
              Discover More
            </h3>
          </div>

          <div class="flex flex-wrap gap-3">
            @for (tag of post()?.keywords; track tag) {
              <a
                class="hover:bg-primary hover:text-primary-foreground border-border text-muted-foreground bg-muted cursor-pointer text-[10px] font-medium tracking-wider uppercase no-underline transition-colors"
                hlmBadge
                variant="outline"
                [queryParams]="{ tag: tag }"
                [routerLink]="['/blog']"
              >
                #{{ tag }}
              </a>
            }
          </div>
        </footer>
      }
    </article>
  `,
  styles: [
    `
      @reference "tailwindcss";

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
      h1 {
        @apply text-4xl;
      }
      h2 {
        @apply text-3xl;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: var(--foreground);
        font-weight: 700;
        letter-spacing: -0.025em;
      }
      .prose p {
        color: var(--muted-foreground);
        line-height: 1.625;
      }
      .prose a {
        color: var(--primary);
        text-decoration: none;
      }
      .prose a:hover {
        text-decoration: underline;
      }
      .prose strong {
        color: var(--foreground);
        font-weight: 700;
      }
      .prose blockquote {
        border-left: 4px solid var(--primary);
        padding-left: 1rem;
        font-style: italic;
        color: var(--muted-foreground);
        margin: 1.5rem 0;
      }
      .prose ul {
        list-style-type: disc;
        list-style-position: inside;
        margin-bottom: 1.5rem;
        color: var(--muted-foreground);
      }
      .prose ol {
        list-style-type: decimal;
        list-style-position: inside;
        margin-bottom: 1.5rem;
        color: var(--muted-foreground);
      }
      .prose li {
        color: var(--muted-foreground);
        margin-bottom: 0.5rem;
      }
      .prose code {
        background-color: var(--muted);
        color: var(--muted-foreground);
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
      }
    `,
  ],
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
          inLanguage: this.locale,
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
