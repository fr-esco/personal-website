# App Marketing SEO Guide

Questa app supporta metadati SEO avanzati per pagine statiche e blog.

## Front Matter per i Post del Blog

Per ottenere una **SEO perfetta**, includi sempre i seguenti campi nel front matter dei tuoi file Markdown (`src/content/{lang}/*.md`):

```yaml
---
title: Titolo del Post
description: Breve descrizione che appare nelle anteprime social (150-160 caratteri).
date: 2024-03-21
image: /assets/blog/copertina-post.jpg  # Deve esistere in public/assets o essere un URL assoluto
author: Nome Autore
category: Tech # O altra categoria
tags: [seo, angular, webdev] # Array di tag
translationKey: unique-post-key # Consigliato: Per collegare traduzioni tra lingue diverse
modified: 2024-03-22 # Opzionale: data ultima modifica. Se omesso, usa la data di modifica del file.
---
```

## Mappatura Open Graph & Meta

Questi campi vengono mappati automaticamente nei seguenti meta tag nel componente `BlogPostComponent`:

- **title** -> `<title>`, `og:title`, `twitter:title`
- **description** -> `description`, `og:description`, `twitter:description`
- **image** -> `og:image`, `twitter:image`
- **date** -> `article:published_time`
- **modified** -> `article:modified_time`
- **author** -> `article:author`
- **category** -> `article:section`
- **tags** -> `article:tag` (multiplo)

Inoltre vengono aggiunti automaticamente:
- `og:type`: `article`
- `og:site_name`: `World Pulse` (configurabile in `app-seo.ts`)
- `og:locale`: `it_IT`, `en_US`, ecc. in base alla lingua corrente.
- `og:url`: URL completo canonico.
- `twitter:card`: `summary_large_image`.
- `canonical`: Link canonico generato automaticamente.

## Sitemap

Lo script `scripts/generate-blog.ts` genera una sitemap.xml che include:
- `lastmod` per la home page (basato su `app.ts`).
- `lastmod` per i post del blog (basato su frontmatter `modified`, `updated_at` o data file).
- Immagini per Google Images sitemap (se presente `image` nel frontmatter).

## Pagine Statiche

Le pagine statiche come la Home (`App` component) e la lista Blog (`BlogListComponent`) hanno impostazioni predefinite ottimizzate:
- `og:type`: `website`
- `og:locale`: Dinamico
- `og:site_name`: `World Pulse`
