import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'

import { SonnerPreview } from './demo-toast'

@Component({
  imports: [RouterModule, SonnerPreview],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'personal-website'
}
