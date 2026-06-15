import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRoute } from '../../app-route';
import { TenantStore } from '../../state/tenant';

export const tenantGuard: CanActivateFn = () => {
  const tenant = inject(TenantStore);
  const router = inject(Router);

  return tenant.activeCompanyId() ? true : router.createUrlTree(['/', AppRoute.SelectCompany]);
};
