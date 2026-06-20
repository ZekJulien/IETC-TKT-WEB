import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, UrlSerializer } from '@angular/router';

import { routes } from './app.routes';
import { apiErrorInterceptor } from './api/api-error-interceptor';
import { apiRefreshInterceptor } from './api/api-refresh-interceptor';
import { apiRequestInterceptor } from './api/api-request-interceptor';
import { loadingInterceptor } from './api/loading-interceptor';
import { TenantUrlSerializer } from './routing/tenant-url-serializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: UrlSerializer, useClass: TenantUrlSerializer },
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,
        apiRequestInterceptor,
        apiErrorInterceptor,
        apiRefreshInterceptor,
      ]),
    ),
  ],
};
