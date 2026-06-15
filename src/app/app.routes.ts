import { Routes } from '@angular/router';
import { AppRoute } from './app-route';
import { Layout } from './components/layout/layout';
import { authGuard, guestGuard } from './guards/auth';
import { tenantGuard } from './guards/tenant';

export const routes: Routes = [
  {
    path: AppRoute.Register,
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register-page/register-page').then((m) => m.RegisterPage),
  },
  {
    path: AppRoute.VerifyEmail,
    loadComponent: () =>
      import('./pages/verify-email-page/verify-email-page').then((m) => m.VerifyEmailPage),
  },
  {
    path: AppRoute.Login,
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: AppRoute.Maintenance,
    loadComponent: () => import('./pages/maintenance/maintenance').then((m) => m.Maintenance),
  },
  {
    path: AppRoute.SelectCompany,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/tenant-selection/tenant-selection').then((m) => m.TenantSelection),
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
    canActivate: [authGuard, tenantGuard],
    children: [
      { path: '', redirectTo: AppRoute.Dashboard, pathMatch: 'full' },
      {
        path: AppRoute.Dashboard,
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: AppRoute.Members,
        loadComponent: () =>
          import('./pages/members-page/members-page').then((m) => m.MembersPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: AppRoute.Dashboard,
  },
];
