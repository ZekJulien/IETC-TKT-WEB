import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoadingStore } from '../state/loading';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const loading = inject(LoadingStore);
  loading.start();

  return next(req).pipe(finalize(() => loading.stop()));
};
