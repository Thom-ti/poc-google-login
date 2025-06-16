import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';

import { loginRedirectGuard } from './shared/guards/login-redirect.guard';
import { authGuard } from './shared/guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginRedirectGuard] },
  { path: 'user', component: UserComponent, canActivate: [authGuard] },
];
