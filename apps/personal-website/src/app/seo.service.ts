import { DOCUMENT, isPlatformBrowser } from '@angular/common'
import { inject, Injectable, PLATFORM_ID } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private document = inject(DOCUMENT)
  private platformId = inject(PLATFORM_ID)

  setStructuredData(
    data: Record<string, unknown> | Record<string, unknown>[],
    // Distinct id per logical source (site-global vs page-level) so multiple
    // JSON-LD blocks coexist on the same page instead of overwriting each
    // other. Google supports several <script type="application/ld+json"> tags.
    scriptId = 'structured-data-jsonld'
  ): void {
    // JSON-LD only needs to reach crawlers, which read it from the prerendered
    // (SSR) HTML — so we write it during server rendering only. Writing a
    // <script> element's content in the browser hits a Trusted Types
    // "TrustedScript" sink (even for non-executable application/ld+json, and
    // even via a text node once bundlers fold it back into a text assignment).
    // Skipping the browser path avoids the sink without a CSP escape hatch; the
    // SSR-injected <script> stays untouched in the DOM after hydration.
    if (isPlatformBrowser(this.platformId)) return

    let script = this.document.getElementById(
      scriptId
    ) as HTMLScriptElement | null

    if (!script) {
      script = this.document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      this.document.head.appendChild(script)
    }

    script.textContent = JSON.stringify(data)
  }
}
