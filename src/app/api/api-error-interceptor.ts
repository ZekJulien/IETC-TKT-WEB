import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AppRoute } from '../app-route';
import { I18nStore, TranslationKey } from '../i18n/i18n-store';
import { ApiError } from '../models/api-error';
import { ServerStore } from '../state/server';

const SERVER_DOWN_STATUSES = [0, 502, 503, 504];

const ERROR_CODE_KEYS: Record<string, TranslationKey> = {
  'comment.ticket_unassigned': 'ticketComments.errors.unassigned',
};

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const i18n = inject(I18nStore);
  const router = inject(Router);
  const server = inject(ServerStore);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (SERVER_DOWN_STATUSES.includes(err.status)) {
        redirectToMaintenance(router, server);
      }
      return throwError(() => new Error(toMessage(err, i18n)));
    }),
  );
};

function redirectToMaintenance(router: Router, server: ServerStore): void {
  const maintenancePath = '/' + AppRoute.Maintenance;
  if (!router.url.startsWith(maintenancePath)) {
    server.returnUrl.set(router.url);
    router.navigateByUrl(maintenancePath);
  }
}

function toMessage(err: HttpErrorResponse, i18n: I18nStore): string {
  if (err.status === 0) {
    return i18n.t('common.errors.network');
  }
  const body = err.error as ApiError | null;
  if (body?.code && ERROR_CODE_KEYS[body.code]) {
    return i18n.t(ERROR_CODE_KEYS[body.code]);
  }
  if (body && typeof body.detail === 'string' && body.detail.length > 0) {
    return body.detail;
  }
  return i18n.t('common.errors.generic');
}
