import { Routes } from '@angular/router';
import { AppRoute } from './app-route';
import { Layout } from './components/layout/layout';
import { authGuard } from './guards/auth';

export const routes: Routes = [
  {
    path: AppRoute.Register,
    loadComponent: () => import('./pages/register-page/register-page').then((m) => m.RegisterPage),
  },
  {
    path: AppRoute.VerifyEmail,
    loadComponent: () =>
      import('./pages/verify-email-page/verify-email-page').then((m) => m.VerifyEmailPage),
  },
  {
    path: AppRoute.Onboarding,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/onboarding-page/onboarding-page').then((m) => m.OnboardingPage),
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: AppRoute.Dashboard, pathMatch: 'full' },
      {
        path: AppRoute.Dashboard,
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
];
