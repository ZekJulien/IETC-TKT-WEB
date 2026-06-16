import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTicketRequest, CreateTicketResponse } from '../../models/tickets';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createTicket(payload: CreateTicketRequest): Observable<CreateTicketResponse> {
    return this.http.post<CreateTicketResponse>(`${this.apiUrl}/tickets`, payload);
  }
}
