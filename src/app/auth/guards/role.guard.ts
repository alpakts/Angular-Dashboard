import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole: string = route.data?.['role'] || '';

  const currentUser = authService.getCurrentUser();

  if (!currentUser || !authService.hasPermission(requiredRole)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
