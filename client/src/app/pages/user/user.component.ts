import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  user: any;

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => (this.user = user),
      error: (err) => {
        console.error('Failed to load user:', err);
        this.user = null;
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
