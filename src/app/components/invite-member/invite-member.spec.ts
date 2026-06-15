import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMember } from './invite-member';

describe('InviteMember', () => {
  let component: InviteMember;
  let fixture: ComponentFixture<InviteMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteMember],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteMember);
    fixture.componentRef.setInput('companyId', 'company-id');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
