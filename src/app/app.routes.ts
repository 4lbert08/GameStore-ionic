import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'advanced-search',
    loadComponent: () => import('./pages/advanced-search/landing-page.page').then(m => m.LandingPagePage)
  },

  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.page').then( m => m.LoginPage)
  },

];
