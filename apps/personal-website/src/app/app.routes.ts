import { Route } from '@angular/router'

import { HomeComponent } from './home.component'
import { MainLayoutComponent } from './layout/main-layout.component'

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./blog/blog-list.component').then((m) => m.BlogListComponent),
      },
      {
        path: 'blog/:slug',
        loadComponent: () =>
          import('./blog/blog-post.component').then((m) => m.BlogPostComponent),
      },
    ],
  },
]
