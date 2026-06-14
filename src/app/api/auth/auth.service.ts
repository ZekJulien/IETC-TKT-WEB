import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConfirmEmailResponse, RegisterRequest } from '../../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  register(payload: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/register`, payload);
  }

  confirmEmail(token: string): Observable<ConfirmEmailResponse> {
    return this.http.get<ConfirmEmailResponse>(`${this.apiUrl}/auth/confirm-email`, {
      params: { token },
    });
  }
}
