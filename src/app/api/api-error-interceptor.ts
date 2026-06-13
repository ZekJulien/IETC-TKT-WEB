import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { I18nStore } from '../i18n/i18n-store';
import { ApiError } from '../models/api-error';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const i18n = inject(I18nStore);
  return next(req).pipe(catchError((err: HttpErrorResponse) => throwError(() => new Error(toMessage(err, i18n)))));
};

function toMessage(err: HttpErrorResponse, i18n: I18nStore): string {
  if (err.status === 0) {
    return i18n.t('common.errors.network');
  }
  const body = err.error as ApiError | null;
  if (body && typeof body.error === 'string' && body.error.length > 0) {
    return body.error;
  }
  return i18n.t('common.errors.generic');
}
