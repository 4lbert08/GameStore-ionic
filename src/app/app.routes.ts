import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'advanced-search-page',
    loadComponent: () => import('./pages/advanced-search-page/advanced-search-page.page').then(m => m.AdvancedSearchPage)
  },
  {
    path: 'about-us-page',
    loadComponent: () => import('./pages/about-us-page/about-us-page.page').then( m => m.AboutUsPagePage)
  },
  {
    path: 'view-more-section-page',
    loadComponent: () => import('./pages/view-more-section-page/view-more-section-page.page').then( m => m.ViewMoreSectionPage)
  },
  {
  path: '**', redirectTo: '',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.page').then( m => m.LoginPage)
  },  {
    path: 'sign-in',
    loadComponent: () => import('./pages/sign-in/sign-in.page').then( m => m.SignInPage)
  },

];
