import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateCompanyRequest,
  CreateCompanyResponse,
  JoinInvitationRequest,
  JoinInvitationResponse,
} from '../../models/onboarding';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createCompany(payload: CreateCompanyRequest): Observable<CreateCompanyResponse> {
    return this.http.post<CreateCompanyResponse>(
      `${this.apiUrl}/onboarding/create-company`,
      payload,
    );
  }

  joinInvitation(payload: JoinInvitationRequest): Observable<JoinInvitationResponse> {
    return this.http.post<JoinInvitationResponse>(
      `${this.apiUrl}/onboarding/join-invitation`,
      payload,
    );
  }
}
