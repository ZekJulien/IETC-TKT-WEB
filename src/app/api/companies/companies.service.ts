import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ChangeMemberRoleResponse,
  CompanyRole,
  InviteMemberRequest,
  InviteMemberResponse,
  MemberListResponse,
  MemberStatusResponse,
} from '../../models/companies';

export interface ListMembersParams {
  page?: number;
  pageSize?: number;
  role?: CompanyRole;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  inviteMember(companyId: string, payload: InviteMemberRequest): Observable<InviteMemberResponse> {
    return this.http.post<InviteMemberResponse>(
      `${this.apiUrl}/companies/${companyId}/members/invite`,
      payload,
    );
  }

  listMembers(companyId: string, params: ListMembersParams = {}): Observable<MemberListResponse> {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        httpParams = httpParams.set(key, value);
      }
    }
    return this.http.get<MemberListResponse>(`${this.apiUrl}/companies/${companyId}/members`, {
      params: httpParams,
    });
  }

  changeMemberRole(
    companyId: string,
    accountId: string,
    role: CompanyRole,
  ): Observable<ChangeMemberRoleResponse> {
    return this.http.patch<ChangeMemberRoleResponse>(
      `${this.apiUrl}/companies/${companyId}/members/${accountId}`,
      { role },
    );
  }

  setMemberStatus(
    companyId: string,
    accountId: string,
    isActive: boolean,
  ): Observable<MemberStatusResponse> {
    return this.http.patch<MemberStatusResponse>(
      `${this.apiUrl}/companies/${companyId}/members/${accountId}/status`,
      { isActive },
    );
  }
}
