import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export const loginRedirectGuard: CanActivateFn = () => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http.get(`${environment.apiUrl}/user`, { withCredentials: true }).pipe(
    tap(() => router.navigate(['/user'])), // login แล้ว → redirect ไป /user
    map(() => false),                      // ห้ามเข้า /login
    catchError(() => of(true))            // ถ้ายังไม่ login → อนุญาตให้เข้า /login
  );
};
