import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketComments } from './ticket-comments';

describe('TicketComments', () => {
  let component: TicketComments;
  let fixture: ComponentFixture<TicketComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketComments],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketComments);
    fixture.componentRef.setInput('ticketId', '00000000-0000-0000-0000-000000000001');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
