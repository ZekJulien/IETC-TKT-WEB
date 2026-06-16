import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TicketsPage } from './tickets-page';

describe('TicketsPage', () => {
  let component: TicketsPage;
  let fixture: ComponentFixture<TicketsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
