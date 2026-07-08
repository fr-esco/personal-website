import { DOCUMENT } from '@angular/common'
import { inject, Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private document = inject(DOCUMENT)

  setStructuredData(
    data: Record<string, unknown> | Record<string, unknown>[]
  ): void {
    const scriptId = 'structured-data-jsonld'
    let script = this.document.getElementById(scriptId) as HTMLScriptElement

    if (!script) {
      script = this.document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      this.document.head.appendChild(script)
    }

    script.text = JSON.stringify(data)
  }
}
