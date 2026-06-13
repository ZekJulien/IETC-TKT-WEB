import { TestBed } from '@angular/core/testing';

import { I18nStore } from './i18n-store';

describe('I18nStore', () => {
  let service: I18nStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
