import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private readonly http: HttpClient) {}

  getProfile() {
    return this.http.get(`${this.apiUrl}`, { withCredentials: true });
  }
}
