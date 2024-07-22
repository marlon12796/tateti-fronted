import type { CanActivateFn } from '@angular/router';

export const requireNameGuard: CanActivateFn = (route, state) => {
  return true;
};
