import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketForm } from './ticket-form';

describe('TicketForm', () => {
  let component: TicketForm;
  let fixture: ComponentFixture<TicketForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketForm],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketForm);
    fixture.componentRef.setInput('companyId', '00000000-0000-0000-0000-000000000000');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the form invalid when the title is too short', () => {
    component.form.controls.title.setValue('ab');
    expect(component.form.controls.title.valid).toBe(false);
  });

  it('should accept a title of at least three characters', () => {
    component.form.controls.title.setValue('Bug');
    expect(component.form.controls.title.valid).toBe(true);
  });
});
