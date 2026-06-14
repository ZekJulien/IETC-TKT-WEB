import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { I18nStore } from '../i18n/i18n-store';
import { SessionStore } from '../state/auth';

export const apiRequestInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const session = inject(SessionStore);
  const i18n = inject(I18nStore);
  const token = session.accessToken();

  return next(
    req.clone({
      setHeaders: {
        'Accept-Language': i18n.lang(),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }),
  );
};
