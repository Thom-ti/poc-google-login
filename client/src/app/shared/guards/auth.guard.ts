import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = () => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http.get(`${environment.apiUrl}/user`, { withCredentials: true }).pipe(
    map(() => true), // Authenticated → allow access
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    }) // Not authenticated → block
  );
};
