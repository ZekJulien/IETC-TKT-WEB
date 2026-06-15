import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthTokens } from '../../models/auth';
import { MyCompaniesResponse, SwitchTenantRequest } from '../../models/tenant';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  listCompanies(): Observable<MyCompaniesResponse> {
    return this.http.get<MyCompaniesResponse>(`${this.apiUrl}/users/me/companies`);
  }

  switchTenant(companyId: string): Observable<AuthTokens> {
    const payload: SwitchTenantRequest = { companyId };
    return this.http.post<AuthTokens>(`${this.apiUrl}/auth/switch-tenant`, payload);
  }
}
