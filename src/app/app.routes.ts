import { Routes } from '@angular/router';
import { AppRoute } from './app-route';
import { Layout } from './components/layout/layout';

export const routes: Routes = [
  {
    path: AppRoute.Register,
    loadComponent: () => import('./pages/register-page/register-page').then((m) => m.RegisterPage)
  },
  {
    path: AppRoute.VerifyEmail,
    loadComponent: () => import('./pages/verify-email-page/verify-email-page').then((m) => m.VerifyEmailPage)
  },
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: AppRoute.Dashboard, pathMatch: 'full' },
      {
        path: AppRoute.Dashboard,
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard)
      }
    ]
  }
];
