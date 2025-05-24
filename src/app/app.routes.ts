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
    loadComponent: () => import('./pages/about-us-page/about-us-page.page').then( m => m.AboutUsPage)
  },
  {
    path: 'view-more-section-page',
    loadComponent: () => import('./pages/view-more-section-page/view-more-section-page.page').then( m => m.ViewMoreSectionPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.page').then( m => m.LoginPage)
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/sign-in/sign-in.page').then( m => m.SignInPage)
  },

  {
    path: 'user-settings',
    loadComponent: () => import('./pages/user-settings/user-settings.page').then( m => m.UserSettingsComponent)
  },
  {
    path: 'otp-verification',
    loadComponent: () => import('./pages/otp-verification/otp-verification.page').then( m => m.OtpVerificationPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  },
  {
    path: 'my-reviews',
    loadComponent: () => import('./pages/my-reviews/my-reviews.page').then( m => m.MyReviewsPage)
  },
  {
    path: 'my-orders',
    loadComponent: () => import('./pages/my-orders/my-orders.page').then( m => m.MyOrdersPage)
  },
  {
    path: 'user-fav-games',
    loadComponent: () => import('./pages/user-fav-games/user-fav-games.page').then( m => m.UserFavGamesPage)
  },
  {
    path: 'gamePage/:id',
    loadComponent: () => import('./pages/game-showcase/game-showcase.page').then(m => m.GameShowcasePageComponent)
  },
  {
  path: '**', redirectTo: '',
  },

];
