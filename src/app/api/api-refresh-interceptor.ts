import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppRoute } from '../app-route';
import { AuthStore, SessionStore } from '../state/auth';

export const apiRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionStore);
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const canRefresh =
        err.status === 401 &&
        req.url.startsWith(environment.apiUrl) &&
        !req.url.startsWith(`${environment.apiUrl}/auth/`) &&
        session.refreshToken() !== null;

      if (!canRefresh) {
        return throwError(() => err);
      }

      return authStore.refreshTokens().pipe(
        switchMap((accessToken) =>
          next(req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })),
        ),
        catchError((refreshErr) => {
          session.clear();
          router.navigate(['/', AppRoute.Login]);
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
