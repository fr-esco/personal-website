import { Route } from '@angular/router'

import { BlogListComponent } from './blog/blog-list.component'
import { BlogPostComponent } from './blog/blog-post.component'
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
        component: BlogListComponent,
      },
      {
        path: 'blog/:slug',
        component: BlogPostComponent,
      },
    ],
  },
]
