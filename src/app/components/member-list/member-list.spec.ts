import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberList } from './member-list';

describe('MemberList', () => {
  let component: MemberList;
  let fixture: ComponentFixture<MemberList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberList],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberList);
    fixture.componentRef.setInput('companyId', 'company-id');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
