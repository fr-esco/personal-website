export function normalizeLocale(locale: string) {
  let normalizedLocale = locale.replace('-', '_')
  if (normalizedLocale === 'en') {
    normalizedLocale = 'en_US'
  } else if (normalizedLocale === 'it') {
    normalizedLocale = 'it_IT'
  }

  return normalizedLocale
}

export function getAlternateLocales(locale: string) {
  const normalizedLocale = normalizeLocale(locale)
  const supportedLocales = ['en_US', 'it_IT']
  const alternateLocales = supportedLocales.filter(
    supportedLocale => supportedLocale !== normalizedLocale
  )

  return alternateLocales
}
