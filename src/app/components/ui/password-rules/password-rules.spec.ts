import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRules } from './password-rules';

describe('PasswordRules', () => {
  let component: PasswordRules;
  let fixture: ComponentFixture<PasswordRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRules],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordRules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
