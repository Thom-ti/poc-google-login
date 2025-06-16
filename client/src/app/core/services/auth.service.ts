import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private readonly http: HttpClient) {}

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google`; // redirect ไป login
  }

  logout(): void {
    this.http
      .get(`${this.apiUrl}/logout`, { withCredentials: true })
      .subscribe({
        next: () => {
          // หลังล้าง cookie เสร็จ ให้ redirect ฝั่ง frontend
          console.log('calling logout')
          window.location.href = '/login';
        },
        error: (err) => {
          console.error('Logout failed:', err);
        },
      });
  }
}
