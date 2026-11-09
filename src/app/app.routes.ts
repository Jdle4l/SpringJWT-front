import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Users } from './pages/users/users';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'users', component: Users, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'users' },
  { path: '**', redirectTo: 'users' },
];
