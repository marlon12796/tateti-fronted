import type { Routes } from '@angular/router'
import { PlayComponent } from './page/play/play.component'
import { requireNameGuard } from './guards/require-name.guard'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page/home/home.component').then((page) => page.HomeComponent),
    canActivate: [requireNameGuard]
  },
  {
    path: 'play',
    loadComponent: () => import('./page/play/play.component').then((page) => page.PlayComponent),
    canActivate: [requireNameGuard]
  },
  {
    path: 'play-private',
    loadComponent: () => import('./page/play/play.component').then((page) => page.PlayComponent),
    canActivate: [requireNameGuard],
    data: { isPrivate: true }
  },
  {
    path: 'play/:id',
    loadComponent: () => import('./page/play/play.component').then((page) => page.PlayComponent),
    canActivate: [requireNameGuard]
  },
  {
    path: 'change-name',
    loadComponent: () => import('./page/change-name/change-name.component').then((page) => page.ChangeNameComponent)
  }
]
