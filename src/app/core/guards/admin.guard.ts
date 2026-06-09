import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

export const adminGuard: CanActivateFn = () => {
  const adminSvc = inject(AdminService);
  const router   = inject(Router);

  if (adminSvc.isLoggedIn()) return true;

  router.navigate(['/'], { replaceUrl: true });
  return false;
};
