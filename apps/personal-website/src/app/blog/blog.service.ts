import { HttpClient } from '@angular/common/http'
import { inject, Injectable, LOCALE_ID } from '@angular/core'
import { map } from 'rxjs/operators'

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  image?: string
  translationKey?: string
  author?: string
  category?: string
  modified?: string
  keyword?: string[]
  authorUrl?: string
  authorUsername?: string
  keywords?: string[]
  excerpt?: string
  directAnswer?: string
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient)
  private readonly locale = inject(LOCALE_ID)

  getPosts() {
    return this.http.get<BlogPost[]>(
      `assets/blog/${this.locale}/registry.json`
    )
  }

  getPost(slug: string) {
    return this.getPosts().pipe(
      map(posts => posts.find(post => post.slug === slug))
    )
  }

  getPostContent(slug: string) {
    return this.http.get(`assets/blog/${this.locale}/${slug}.md`, {
      responseType: 'text',
    })
  }
}
