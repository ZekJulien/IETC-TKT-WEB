import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { apiErrorInterceptor } from './api/api-error-interceptor';
import { apiRefreshInterceptor } from './api/api-refresh-interceptor';
import { apiRequestInterceptor } from './api/api-request-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiRequestInterceptor, apiErrorInterceptor, apiRefreshInterceptor]),
    ),
  ],
};
