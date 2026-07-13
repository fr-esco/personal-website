import * as fs from 'node:fs'
import * as path from 'node:path'

import matter from 'gray-matter'

// Configurazione
const LANGUAGES = ['it', 'en']
const ROOT_DIR = process.cwd()
const CONTENT_ROOT = path.join(ROOT_DIR, 'src/content')
const PUBLIC_ROOT = path.join(ROOT_DIR, 'public')
const ASSETS_ROOT = path.join(PUBLIC_ROOT, 'assets/blog')

// Assicuriamoci che le cartelle esistano
if (!fs.existsSync(PUBLIC_ROOT)) {
  fs.mkdirSync(PUBLIC_ROOT, { recursive: true })
}
if (!fs.existsSync(ASSETS_ROOT)) {
  fs.mkdirSync(ASSETS_ROOT, { recursive: true })
}

// Interface per FrontMatter
interface FrontMatter {
  title: string
  description: string
  date: string
  image?: string
  translationKey?: string
  author?: string
  category?: string
  modified?: string
  updated_at?: string
  author_url?: string
  author_username?: string
  keywords?: string[]
  tags?: string[]
  excerpt?: string
  directAnswer?: string
}

LANGUAGES.forEach(lang => {
  console.log(`\nProcessing language: ${lang.toUpperCase()}`)

  const langContentDir = path.join(CONTENT_ROOT, lang)
  const langAssetsDir = path.join(ASSETS_ROOT, lang)

  if (!fs.existsSync(langAssetsDir))
    fs.mkdirSync(langAssetsDir, { recursive: true })

  // 1. Leggi i file Markdown
  const files = fs.readdirSync(langContentDir).filter(f => f.endsWith('.md'))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registry: any[] = []
  const routes: string[] = ['/' /* '/pricing' */] // Rotte statiche base

  files.forEach(file => {
    const srcPath = path.join(langContentDir, file)
    const content = fs.readFileSync(srcPath, 'utf-8')

    // Parsifica Frontmatter
    const { data } = matter(content)
    const fm = data as FrontMatter
    const slug = file.replace('.md', '')

    // Aggiungi al registro JSON
    registry.push({
      slug,
      title: fm.title,
      description: fm.description,
      excerpt: fm.excerpt,
      directAnswer: fm.directAnswer,
      date: fm.date,
      image: fm.image,
      translationKey: fm.translationKey || slug,
      author: fm.author,
      authorUrl: fm.author_url,
      authorUsername: fm.author_username,
      category: fm.category,
      modified:
        fm.modified ||
        fm.updated_at ||
        fs.statSync(srcPath).mtime.toISOString(),
      keywords: fm.keywords || fm.tags || [],
    })

    // Aggiungi alla lista rotte per il prerendering
    // Nota: Non serve il prefisso /it/ o /en/ qui, Angular lo aggiunge in base alla build
    routes.push(`/blog/${slug}`)

    // Copia il file MD negli assets per il runtime fetching
    fs.copyFileSync(srcPath, path.join(langAssetsDir, file))
  })

  // 2. Salva il registro JSON ordinato per data
  registry.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  fs.writeFileSync(
    path.join(langAssetsDir, 'registry.json'),
    JSON.stringify(registry, null, 2)
  )

  // 3. Genera il file routes.{lang}.txt specifico
  // const routesContent = routes.join('\n')
  // fs.writeFileSync(path.join(ROOT_DIR, `routes.${lang}.txt`), routesContent)

  console.log(`✅ Generated ${routes.length} route paths`)
})

// 4. Generate Sitemap
console.log('\nGenerating Sitemap...')
const BASE_URL = 'https://francescocolamonici.it'
const allPages: Map<
  string,
  {
    lang: string
    url: string
    date?: string
    priority: string
    changefreq: string
    image?: string
  }[]
> = new Map()

// Helper to add pages
function addPage(
  key: string,
  lang: string,
  url: string,
  date?: string,
  priority = '0.5',
  changefreq = 'monthly',
  image?: string
) {
  if (!allPages.has(key)) {
    allPages.set(key, [])
  }
  allPages.get(key)?.push({ lang, url, date, priority, changefreq, image })
}

// Re-scan to build sitemap data
LANGUAGES.forEach(lang => {
  const langContentDir = path.join(CONTENT_ROOT, lang)

  // 1. Home Page LastMod (from app.ts)
  const appTsPath = path.join(ROOT_DIR, 'src/app/app.ts')
  let homeLastMod: string | undefined
  if (fs.existsSync(appTsPath)) {
    homeLastMod = fs.statSync(appTsPath).mtime.toISOString()
  }
  addPage('home', lang, `${BASE_URL}/${lang}/`, homeLastMod, '1.0', 'weekly')

  // 2. Blog Posts & Index LastMod
  let latestBlogDate: Date | null = null

  if (fs.existsSync(langContentDir)) {
    const files = fs.readdirSync(langContentDir).filter(f => f.endsWith('.md'))
    files.forEach(file => {
      const srcPath = path.join(langContentDir, file)
      const content = fs.readFileSync(srcPath, 'utf-8')
      const { data } = matter(content)
      const fm = data as FrontMatter
      const slug = file.replace('.md', '')
      const key = fm.translationKey || slug

      // Track latest date
      if (fm.date) {
        const postDate = new Date(fm.date)
        if (!latestBlogDate || postDate > latestBlogDate) {
          latestBlogDate = postDate
        }
      }

      /* Temporarily disable blog pages in sitemap
      addPage(
        `blog/${key}`,
        lang,
        `${BASE_URL}/${lang}/blog/${slug}`,
        fm.date,
        '0.6',
        'monthly',
        fm.image
      )
      */
    })
  }

  /* Temporarily disable blog index in sitemap
  addPage(
    'blog',
    lang,
    `${BASE_URL}/${lang}/blog/`,
    latestBlogDate ? (latestBlogDate as Date).toISOString() : undefined,
    '0.8',
    'weekly'
  )
  */
})

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${Array.from(allPages.values())
  .map(variants => {
    const xDefault = variants.find(v => v.lang === 'en') || variants[0]
    return variants
      .map(
        variant => `  <url>
    <loc>${variant.url}</loc>
    ${
      variant.date
        ? `<lastmod>${new Date(variant.date as string).toISOString().split('T')[0]}</lastmod>`
        : ''
    }
    <changefreq>${variant.changefreq}</changefreq>
    <priority>${variant.priority}</priority>
${variants.map(v => `    <xhtml:link rel="alternate" hreflang="${v.lang}" href="${v.url}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefault.url}"/>${
      variant.image
        ? `
    <image:image>
      <image:loc>${variant.image.startsWith('http') ? variant.image : BASE_URL + variant.image}</image:loc>
    </image:image>`
        : ''
    }
  </url>`
      )
      .join('\n')
  })
  .join('\n')}
</urlset>`

fs.writeFileSync(path.join(PUBLIC_ROOT, 'sitemap.xml'), sitemapContent)
console.log(
  `✅ Generated sitemap.xml with ${allPages.size} unique pages across ${LANGUAGES.length} languages`
)
