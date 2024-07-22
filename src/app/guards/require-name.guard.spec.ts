import { TestBed } from '@angular/core/testing';
import type { CanActivateFn } from '@angular/router';

import { requireNameGuard } from './require-name.guard';

describe('requireNameGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => requireNameGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
