import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRoute } from '../../app-route';
import { SessionStore } from '../../state/auth';

export const guestGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  return session.isAuthenticated() ? router.createUrlTree(['/', AppRoute.Dashboard]) : true;
};
