import { AsyncPipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'

import { ThemeService } from '../theme.service'

@Component({
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class MainLayoutComponent {
  public themeService = inject(ThemeService)
}
