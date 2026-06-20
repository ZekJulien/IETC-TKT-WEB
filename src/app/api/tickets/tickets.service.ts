import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Comment,
  CreateCommentRequest,
  CreateTicketRequest,
  CreateTicketResponse,
  TicketDetail,
  TicketListQuery,
  TicketListResponse,
  TicketStats,
  UpdateCommentRequest,
  UpdateTicketRequest,
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

  getStats(): Observable<TicketStats> {
    return this.http.get<TicketStats>(`${this.apiUrl}/tickets/stats`);
  }

  getTicket(ticketId: string): Observable<TicketDetail> {
    return this.http.get<TicketDetail>(`${this.apiUrl}/tickets/${ticketId}`);
  }

  updateTicket(ticketId: string, payload: UpdateTicketRequest): Observable<TicketDetail> {
    return this.http.patch<TicketDetail>(`${this.apiUrl}/tickets/${ticketId}`, payload);
  }

  listComments(ticketId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/tickets/${ticketId}/comments`);
  }

  createComment(ticketId: string, payload: CreateCommentRequest): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/tickets/${ticketId}/comments`, payload);
  }

  updateComment(commentId: string, payload: UpdateCommentRequest): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}/comments/${commentId}`, payload);
  }
}
