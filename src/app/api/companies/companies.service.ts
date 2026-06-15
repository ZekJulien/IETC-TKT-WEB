import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InviteMemberRequest, InviteMemberResponse } from '../../models/companies';

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
}
