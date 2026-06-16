import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { TicketsService } from '../../api/tickets';
import { Comment, CreateCommentRequest } from '../../models/tickets';

@Injectable({
  providedIn: 'root',
})
export class CommentsStore {
  private readonly api = inject(TicketsService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly comments = signal<Comment[]>([]);

  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);

  load(ticketId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .listComments(ticketId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (comments) => {
          this.comments.set(comments);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
      });
  }

  create(ticketId: string, payload: CreateCommentRequest, onDone: () => void): void {
    this.saving.set(true);
    this.saveError.set(null);

    this.api
      .createComment(ticketId, payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (comment) => {
          this.comments.update((list) => [...list, comment]);
          onDone();
        },
        error: (err: Error) => {
          this.saveError.set(err.message);
        },
      });
  }

  update(commentId: string, content: string, onDone: () => void): void {
    this.saving.set(true);
    this.saveError.set(null);

    this.api
      .updateComment(commentId, { content })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (updated) => {
          this.comments.update((list) =>
            list.map((c) => (c.commentId === updated.commentId ? updated : c)),
          );
          onDone();
        },
        error: (err: Error) => {
          this.saveError.set(err.message);
        },
      });
  }
}
