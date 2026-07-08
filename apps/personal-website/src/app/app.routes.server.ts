import { inject, LOCALE_ID } from '@angular/core'
import { RenderMode, ServerRoute } from '@angular/ssr'

interface RegistryEntry {
  slug: string
}

/**
 * Reads the blog registry from the filesystem at build time.
 *
 * `getPrerenderParams` runs during route extraction, outside of any HTTP
 * request context, so a relative `HttpClient` call has no origin to resolve
 * against and hangs until the extraction times out. Since prerendering always
 * runs from the workspace root, we read the generated registry directly from
 * disk instead. (See `scripts/generate-blog.ts`, which writes these files.)
 */
async function readRegistrySlugs(locale: string): Promise<RegistryEntry[]> {
  const fs = await import('node:fs')
  const path = await import('node:path')

  const candidates = [
    path.resolve(
      process.cwd(),
      `apps/personal-website/public/assets/blog/${locale}/registry.json`
    ),
    path.resolve(process.cwd(), `public/assets/blog/${locale}/registry.json`),
  ]

  const registryPath = candidates.find(candidate => fs.existsSync(candidate))
  if (!registryPath) {
    throw new Error(
      `Blog registry for locale "${locale}" not found. Run the "blog:build" ` +
        `target first. Looked in:\n${candidates.join('\n')}`
    )
  }

  return JSON.parse(fs.readFileSync(registryPath, 'utf-8')) as RegistryEntry[]
}

export const serverRoutes: ServerRoute[] = [
  // https://angular.dev/guide/ssr#customizing-build-time-prerendering-ssg
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const locale = inject(LOCALE_ID)
      const registry = await readRegistrySlugs(locale)
      return registry.map(post => ({ slug: post.slug }))
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
]
