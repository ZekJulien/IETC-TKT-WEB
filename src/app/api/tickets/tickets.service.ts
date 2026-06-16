import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateTicketRequest,
  CreateTicketResponse,
  TicketListQuery,
  TicketListResponse,
} from '../../models/tickets';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createTicket(payload: CreateTicketRequest): Observable<CreateTicketResponse> {
    return this.http.post<CreateTicketResponse>(`${this.apiUrl}/tickets`, payload);
  }

  listTickets(query: TicketListQuery = {}): Observable<TicketListResponse> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http.get<TicketListResponse>(`${this.apiUrl}/tickets`, { params });
  }
}
