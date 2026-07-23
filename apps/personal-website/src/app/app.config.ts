import { provideHttpClient, withFetch } from '@angular/common/http'
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { provideSpartanHlm } from '@spartan-ng/helm/utils'

import { appRoutes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(appRoutes),
    provideSpartanHlm(),
  ],
}
